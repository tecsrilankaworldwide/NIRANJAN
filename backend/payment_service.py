from fastapi import HTTPException
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
from models import *
from typing import Dict, Any, Optional
import os
import logging
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

class PaymentService:
    def __init__(self, db):
        self.db = db
        self.stripe_api_key = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')
        
    async def initialize_stripe(self, host_url: str):
        """Initialize Stripe checkout with webhook URL"""
        webhook_url = f"{host_url}/api/webhook/stripe"
        self.stripe_checkout = StripeCheckout(
            api_key=self.stripe_api_key, 
            webhook_url=webhook_url
        )
        
    def get_pricing_plan(self, age_level: UnifiedAgeLevel) -> PricingPlan:
        """Get pricing plan for specific age level"""
        pricing_plans = {
            UnifiedAgeLevel.LITTLE_LEARNERS: PricingPlan(
                age_level=UnifiedAgeLevel.LITTLE_LEARNERS,
                monthly_price=800.00,
                quarterly_price=2800.00,
                quarterly_savings=600.00,
                digital_content_price=1800.00,
                physical_materials_price=1500.00,
                features=[
                    "Fun learning games", "Colors & shapes", "Number recognition", 
                    "Basic phonics", "Logical thinking basics", "Parent guidance"
                ],
                description="Little Learners (Ages 4-6) - Fun basics for little learners"
            ),
            UnifiedAgeLevel.YOUNG_EXPLORERS: PricingPlan(
                age_level=UnifiedAgeLevel.YOUNG_EXPLORERS,
                monthly_price=1200.00,
                quarterly_price=4200.00,
                quarterly_savings=900.00,
                digital_content_price=2700.00,
                physical_materials_price=1500.00,
                features=[
                    "Math & English courses", "Science experiments", "Reading comprehension",
                    "Creative projects", "Logical thinking development", "Progress tracking"
                ],
                description="Young Explorers (Ages 7-9) - Building foundational skills"
            ),
            UnifiedAgeLevel.SMART_KIDS: PricingPlan(
                age_level=UnifiedAgeLevel.SMART_KIDS,
                monthly_price=1500.00,
                quarterly_price=5250.00,
                quarterly_savings=1250.00,
                digital_content_price=3750.00,
                physical_materials_price=1500.00,
                features=[
                    "Advanced subjects", "Coding introduction", "STEM projects",
                    "Logical thinking mastery", "Algorithmic thinking basics", "Critical thinking"
                ],
                description="Smart Kids (Ages 10-12) - Advanced concepts and challenges"
            ),
            UnifiedAgeLevel.TECH_TEENS: PricingPlan(
                age_level=UnifiedAgeLevel.TECH_TEENS,
                monthly_price=2000.00,
                quarterly_price=7000.00,
                quarterly_savings=1500.00,
                digital_content_price=5500.00,
                physical_materials_price=1500.00,
                features=[
                    "Programming basics", "Web development intro", "Digital literacy",
                    "Advanced logical thinking", "Algorithmic thinking", "Project-based learning"
                ],
                description="Tech Teens (Ages 13-15) - Technology and programming skills"
            ),
            UnifiedAgeLevel.FUTURE_LEADERS: PricingPlan(
                age_level=UnifiedAgeLevel.FUTURE_LEADERS,
                monthly_price=2500.00,
                quarterly_price=8750.00,
                quarterly_savings=2250.00,
                digital_content_price=7250.00,
                physical_materials_price=1500.00,
                features=[
                    "Advanced programming", "AI & machine learning", "Mobile app development",
                    "Complex algorithmic thinking", "Data structures & algorithms", "Career preparation"
                ],
                description="Future Leaders (Ages 16-18) - Advanced technology and leadership"
            )
        }
        return pricing_plans.get(age_level)
    
    async def create_stripe_payment(self, payment_request: PaymentRequest, host_url: str) -> PaymentResponse:
        """Create Stripe checkout session"""
        try:
            await self.initialize_stripe(host_url)
            
            # Get pricing plan
            pricing_plan = self.get_pricing_plan(payment_request.age_level)
            if not pricing_plan:
                raise HTTPException(status_code=400, detail="Invalid age level")
            
            # Determine amount based on subscription type
            if payment_request.subscription_type == SubscriptionType.MONTHLY:
                amount = pricing_plan.monthly_price
            else:  # Quarterly
                amount = pricing_plan.quarterly_price
            
            # Create success and cancel URLs
            success_url = f"{host_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
            cancel_url = f"{host_url}/payment-cancel"
            
            # Prepare metadata
            metadata = {
                "user_id": payment_request.user_id,
                "age_level": payment_request.age_level,
                "subscription_type": payment_request.subscription_type,
                "payment_method": "stripe"
            }
            
            # Create checkout session request
            checkout_request = CheckoutSessionRequest(
                amount=amount,
                currency="lkr",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=metadata
            )
            
            # Create Stripe checkout session
            session = await self.stripe_checkout.create_checkout_session(checkout_request)
            
            # Create payment transaction record
            transaction = PaymentTransaction(
                user_id=payment_request.user_id,
                session_id=session.session_id,
                amount=amount,
                currency="LKR",
                payment_method=PaymentMethod.STRIPE,
                payment_status=PaymentStatus.PENDING,
                subscription_type=payment_request.subscription_type,
                age_level=payment_request.age_level,
                metadata=metadata,
                stripe_session_id=session.session_id
            )
            
            # Store transaction in database
            await self.db.payment_transactions.insert_one(transaction.dict())
            
            return PaymentResponse(
                transaction_id=transaction.id,
                payment_url=session.url,
                success=True,
                message="Payment session created successfully"
            )
            
        except Exception as e:
            logger.error(f"Stripe payment creation failed: {e}")
            raise HTTPException(status_code=400, detail=f"Payment creation failed: {str(e)}")
    
    async def create_bank_transfer_payment(self, payment_request: PaymentRequest) -> PaymentResponse:
        """Create bank transfer payment"""
        try:
            # Get pricing plan
            pricing_plan = self.get_pricing_plan(payment_request.age_level)
            if not pricing_plan:
                raise HTTPException(status_code=400, detail="Invalid age level")
            
            # Determine amount based on subscription type
            if payment_request.subscription_type == SubscriptionType.MONTHLY:
                amount = pricing_plan.monthly_price
            else:  # Quarterly
                amount = pricing_plan.quarterly_price
            
            # Generate bank reference
            bank_reference = f"TK_{datetime.now().strftime('%Y%m%d%H%M%S')}_{payment_request.user_id[:8]}"
            
            # Create payment transaction record
            transaction = PaymentTransaction(
                user_id=payment_request.user_id,
                amount=amount,
                currency="LKR",
                payment_method=PaymentMethod.BANK_TRANSFER,
                payment_status=PaymentStatus.PENDING,
                subscription_type=payment_request.subscription_type,
                age_level=payment_request.age_level,
                metadata={
                    "user_id": payment_request.user_id,
                    "age_level": payment_request.age_level,
                    "subscription_type": payment_request.subscription_type,
                    "bank_reference": bank_reference
                },
                bank_reference=bank_reference
            )
            
            # Store transaction in database
            await self.db.payment_transactions.insert_one(transaction.dict())
            
            # Bank details for TEC Sri Lanka Worldwide
            bank_details = {
                "bank_name": "Bank of Ceylon",
                "account_name": "TEC Sri Lanka Worldwide (Pvt.) Ltd",
                "account_number": "Please contact for account details",
                "branch": "Please contact for branch details",
                "reference": bank_reference,
                "amount": f"LKR {amount:,.2f}",
                "instructions": [
                    f"Please use reference number: {bank_reference}",
                    "Include your name and phone number in the deposit slip",
                    "Send deposit slip photo to hello@tecaikids.com",
                    "Payment will be verified within 24 hours"
                ]
            }
            
            return PaymentResponse(
                transaction_id=transaction.id,
                bank_details=bank_details,
                success=True,
                message="Bank transfer details generated successfully"
            )
            
        except Exception as e:
            logger.error(f"Bank transfer payment creation failed: {e}")
            raise HTTPException(status_code=400, detail=f"Payment creation failed: {str(e)}")
    
    async def create_ezcash_payment(self, payment_request: PaymentRequest) -> PaymentResponse:
        """Create eZ Cash payment (placeholder implementation)"""
        try:
            # Get pricing plan
            pricing_plan = self.get_pricing_plan(payment_request.age_level)
            if not pricing_plan:
                raise HTTPException(status_code=400, detail="Invalid age level")
            
            # Determine amount based on subscription type
            if payment_request.subscription_type == SubscriptionType.MONTHLY:
                amount = pricing_plan.monthly_price
            else:  # Quarterly
                amount = pricing_plan.quarterly_price
            
            # Create payment transaction record
            transaction = PaymentTransaction(
                user_id=payment_request.user_id,
                amount=amount,
                currency="LKR",
                payment_method=PaymentMethod.EZCASH,
                payment_status=PaymentStatus.PENDING,
                subscription_type=payment_request.subscription_type,
                age_level=payment_request.age_level,
                metadata={
                    "user_id": payment_request.user_id,
                    "age_level": payment_request.age_level,
                    "subscription_type": payment_request.subscription_type
                }
            )
            
            # Store transaction in database
            await self.db.payment_transactions.insert_one(transaction.dict())
            
            return PaymentResponse(
                transaction_id=transaction.id,
                success=True,
                message="eZ Cash payment integration coming soon. Please use Stripe or Bank Transfer for now."
            )
            
        except Exception as e:
            logger.error(f"eZ Cash payment creation failed: {e}")
            raise HTTPException(status_code=400, detail=f"Payment creation failed: {str(e)}")
    
    async def get_payment_status(self, session_id: str) -> Dict[str, Any]:
        """Get payment status for a session"""
        try:
            # Find transaction by session_id
            transaction = await self.db.payment_transactions.find_one({"session_id": session_id})
            
            if not transaction:
                return {"status": "not_found", "message": "Transaction not found"}
            
            # If Stripe payment, check with Stripe
            if transaction["payment_method"] == PaymentMethod.STRIPE and transaction.get("stripe_session_id"):
                try:
                    if not hasattr(self, 'stripe_checkout'):
                        await self.initialize_stripe("https://app.emergent.com")  # Default host
                    
                    checkout_status = await self.stripe_checkout.get_checkout_status(transaction["stripe_session_id"])
                    
                    # Update transaction status based on Stripe response
                    if checkout_status.payment_status == "paid" and transaction["payment_status"] != PaymentStatus.COMPLETED:
                        await self.db.payment_transactions.update_one(
                            {"session_id": session_id},
                            {
                                "$set": {
                                    "payment_status": PaymentStatus.COMPLETED,
                                    "updated_at": datetime.utcnow()
                                }
                            }
                        )
                        
                        # Create or update subscription
                        await self.create_subscription(transaction)
                    
                    return {
                        "status": checkout_status.status,
                        "payment_status": checkout_status.payment_status,
                        "amount": checkout_status.amount_total / 100,  # Convert from cents
                        "currency": checkout_status.currency.upper()
                    }
                    
                except Exception as e:
                    logger.error(f"Error checking Stripe status: {e}")
                    return {
                        "status": "error",
                        "message": "Error checking payment status",
                        "transaction_status": transaction["payment_status"]
                    }
            
            return {
                "status": transaction["payment_status"],
                "transaction_id": transaction["id"],
                "amount": transaction["amount"],
                "currency": transaction["currency"],
                "payment_method": transaction["payment_method"]
            }
            
        except Exception as e:
            logger.error(f"Error getting payment status: {e}")
            return {"status": "error", "message": str(e)}
    
    async def create_subscription(self, transaction_data: Dict[str, Any]):
        """Create or update subscription after successful payment"""
        try:
            user_id = transaction_data["user_id"]
            age_level = transaction_data["age_level"]
            subscription_type = transaction_data["subscription_type"]
            
            # Calculate subscription dates
            start_date = datetime.utcnow()
            if subscription_type == SubscriptionType.MONTHLY:
                end_date = start_date + timedelta(days=30)
                next_billing_date = end_date
            else:  # Quarterly
                end_date = start_date + timedelta(days=90)
                next_billing_date = end_date
                
            # Get pricing plan
            pricing_plan = self.get_pricing_plan(UnifiedAgeLevel(age_level))
            
            # Create subscription
            subscription = Subscription(
                user_id=user_id,
                subscription_type=SubscriptionType(subscription_type),
                age_level=UnifiedAgeLevel(age_level),
                status=SubscriptionStatus.ACTIVE,
                start_date=start_date,
                end_date=end_date,
                next_billing_date=next_billing_date,
                monthly_amount=pricing_plan.monthly_price,
                quarterly_amount=pricing_plan.quarterly_price
            )
            
            # Store subscription
            await self.db.subscriptions.insert_one(subscription.dict())
            
            # Update user with subscription ID
            await self.db.users.update_one(
                {"id": user_id},
                {"$set": {"subscription_id": subscription.id}}
            )
            
            # Schedule quarterly workbook delivery if quarterly subscription
            if subscription_type == SubscriptionType.QUARTERLY:
                await self.schedule_workbook_delivery(subscription.dict())
            
            logger.info(f"Created subscription {subscription.id} for user {user_id}")
            
        except Exception as e:
            logger.error(f"Error creating subscription: {e}")
    
    async def schedule_workbook_delivery(self, subscription_data: Dict[str, Any]):
        """Schedule quarterly workbook delivery"""
        try:
            # Get current quarter
            now = datetime.utcnow()
            quarter = f"Q{((now.month - 1) // 3) + 1}"
            year = now.year
            
            # Calculate next delivery date (next quarter)
            if quarter == "Q1":
                next_quarter_start = datetime(year, 4, 1)
            elif quarter == "Q2":
                next_quarter_start = datetime(year, 7, 1)
            elif quarter == "Q3":
                next_quarter_start = datetime(year, 10, 1)
            else:  # Q4
                next_quarter_start = datetime(year + 1, 1, 1)
            
            workbook_delivery = WorkbookDelivery(
                subscription_id=subscription_data["id"],
                user_id=subscription_data["user_id"],
                age_level=UnifiedAgeLevel(subscription_data["age_level"]),
                delivery_address=subscription_data.get("workbook_delivery_address", "Address to be provided"),
                quarter=quarter,
                year=year
            )
            
            await self.db.workbook_deliveries.insert_one(workbook_delivery.dict())
            
            # Update subscription with next workbook delivery date
            await self.db.subscriptions.update_one(
                {"id": subscription_data["id"]},
                {
                    "$set": {
                        "next_workbook_delivery": next_quarter_start,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            logger.info(f"Scheduled workbook delivery for subscription {subscription_data['id']}")
            
        except Exception as e:
            logger.error(f"Error scheduling workbook delivery: {e}")
    
    async def handle_stripe_webhook(self, webhook_body: bytes, signature: str) -> Dict[str, Any]:
        """Handle Stripe webhook"""
        try:
            if not hasattr(self, 'stripe_checkout'):
                await self.initialize_stripe("https://app.emergent.com")  # Default host
            
            webhook_response = await self.stripe_checkout.handle_webhook(webhook_body, signature)
            
            if webhook_response.event_type in ["checkout.session.completed", "payment_intent.succeeded"]:
                session_id = webhook_response.session_id
                
                # Update payment transaction
                await self.db.payment_transactions.update_one(
                    {"stripe_session_id": session_id},
                    {
                        "$set": {
                            "payment_status": PaymentStatus.COMPLETED,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                
                # Get transaction and create subscription
                transaction = await self.db.payment_transactions.find_one({"stripe_session_id": session_id})
                if transaction:
                    await self.create_subscription(transaction)
            
            return {"status": "success", "event_type": webhook_response.event_type}
            
        except Exception as e:
            logger.error(f"Webhook handling failed: {e}")
            raise HTTPException(status_code=400, detail=f"Webhook processing failed: {str(e)}")