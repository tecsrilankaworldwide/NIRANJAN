# Stripe Payment Integration for TEC Future-Ready Learning Platform
import os
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging
import uuid

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, 
    CheckoutSessionResponse, 
    CheckoutStatusResponse, 
    CheckoutSessionRequest
)

logger = logging.getLogger(__name__)

class TecStripeIntegration:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.stripe_api_key = os.environ.get('STRIPE_API_KEY')
        if not self.stripe_api_key:
            logger.warning("STRIPE_API_KEY not found in environment variables")
        
        # TEC Platform Subscription Packages
        self.subscription_packages = {
            "foundation_monthly": {
                "name": "Foundation Level - Monthly",
                "description": "Ages 5-8 • Basic AI & Logic • Building blocks of future thinking",
                "age_group": "5-8",
                "learning_level": "foundation", 
                "price": 1200.00,  # LKR
                "currency": "lkr",
                "billing_cycle": "monthly",
                "features": [
                    "Interactive learning activities",
                    "Basic AI literacy concepts", 
                    "Logical thinking fundamentals",
                    "Creative problem solving basics",
                    "Age-appropriate challenges",
                    "Progress tracking"
                ]
            },
            "development_monthly": {
                "name": "Development Level - Monthly", 
                "description": "Ages 9-12 • Logical Thinking & Creativity • Expanding cognitive abilities",
                "age_group": "9-12",
                "learning_level": "development",
                "price": 1800.00,  # LKR
                "currency": "lkr", 
                "billing_cycle": "monthly",
                "features": [
                    "Advanced logical reasoning",
                    "Creative problem solving",
                    "AI literacy deep dive",
                    "Systems thinking introduction",
                    "Interactive brain workouts",
                    "Personalized learning paths"
                ]
            },
            "mastery_monthly": {
                "name": "Mastery Level - Monthly",
                "description": "Ages 13-16 • Future Career Skills • Leadership preparation", 
                "age_group": "13-16",
                "learning_level": "mastery",
                "price": 2800.00,  # LKR
                "currency": "lkr",
                "billing_cycle": "monthly", 
                "features": [
                    "Future career preparation",
                    "Advanced AI applications", 
                    "Innovation methodologies",
                    "Leadership development",
                    "Real-world project experience",
                    "Comprehensive analytics"
                ]
            },
            "foundation_quarterly": {
                "name": "Foundation Level - Quarterly",
                "description": "Ages 5-8 • 3 months + Physical materials",
                "age_group": "5-8", 
                "learning_level": "foundation",
                "price": 3240.00,  # LKR (10% discount + materials)
                "currency": "lkr",
                "billing_cycle": "quarterly",
                "features": [
                    "All monthly features",
                    "Physical learning materials",
                    "Workbooks and activity sheets", 
                    "10% cost savings",
                    "Priority support"
                ]
            },
            "development_quarterly": {
                "name": "Development Level - Quarterly", 
                "description": "Ages 9-12 • 3 months + Physical materials",
                "age_group": "9-12",
                "learning_level": "development", 
                "price": 4860.00,  # LKR (10% discount + materials)
                "currency": "lkr",
                "billing_cycle": "quarterly",
                "features": [
                    "All monthly features",
                    "Physical learning materials",
                    "Advanced workbooks",
                    "10% cost savings", 
                    "Premium support"
                ]
            },
            "mastery_quarterly": {
                "name": "Mastery Level - Quarterly",
                "description": "Ages 13-16 • 3 months + Physical materials",
                "age_group": "13-16",
                "learning_level": "mastery",
                "price": 7560.00,  # LKR (10% discount + materials) 
                "currency": "lkr",
                "billing_cycle": "quarterly",
                "features": [
                    "All monthly features", 
                    "Physical learning materials",
                    "Project guidebooks",
                    "10% cost savings",
                    "VIP support & mentoring"
                ]
            }
        }
    
    def _get_stripe_checkout(self, request: Request) -> StripeCheckout:
        """Initialize Stripe checkout with webhook URL"""
        if not self.stripe_api_key:
            raise HTTPException(status_code=500, detail="Stripe API key not configured")
        
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        
        return StripeCheckout(api_key=self.stripe_api_key, webhook_url=webhook_url)
    
    async def create_checkout_session(
        self, 
        package_id: str, 
        user_id: str, 
        origin_url: str,
        request: Request
    ) -> CheckoutSessionResponse:
        """Create Stripe checkout session for TEC subscription"""
        
        # Validate package
        if package_id not in self.subscription_packages:
            raise HTTPException(status_code=400, detail=f"Invalid package ID: {package_id}")
        
        package = self.subscription_packages[package_id]
        stripe_checkout = self._get_stripe_checkout(request)
        
        # Build success and cancel URLs
        success_url = f"{origin_url}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{origin_url}/subscription"
        
        # Create metadata for tracking
        metadata = {
            "user_id": user_id,
            "package_id": package_id,
            "learning_level": package["learning_level"],
            "age_group": package["age_group"],
            "billing_cycle": package["billing_cycle"],
            "platform": "tec_learning"
        }
        
        # Create checkout session request
        checkout_request = CheckoutSessionRequest(
            amount=package["price"],
            currency=package["currency"], 
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        try:
            # Create Stripe session
            session = await stripe_checkout.create_checkout_session(checkout_request)
            
            # Create payment transaction record
            payment_transaction = {
                "id": str(uuid.uuid4()),
                "session_id": session.session_id,
                "user_id": user_id,
                "package_id": package_id,
                "amount": package["price"],
                "currency": package["currency"],
                "payment_status": "initiated",
                "status": "pending",
                "metadata": metadata,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "stripe_url": session.url
            }
            
            # Save to database
            await self.db.payment_transactions.insert_one(payment_transaction)
            
            logger.info(f"Created checkout session {session.session_id} for user {user_id}")
            return session
            
        except Exception as e:
            logger.error(f"Failed to create checkout session: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to create payment session: {str(e)}")
    
    async def get_checkout_status(self, session_id: str, request: Request) -> CheckoutStatusResponse:
        """Get payment status and update database"""
        
        stripe_checkout = self._get_stripe_checkout(request)
        
        try:
            # Get status from Stripe
            checkout_status = await stripe_checkout.get_checkout_status(session_id)
            
            # Find transaction in database
            transaction = await self.db.payment_transactions.find_one({"session_id": session_id})
            if not transaction:
                raise HTTPException(status_code=404, detail="Transaction not found")
            
            # Update transaction status if changed
            if transaction["payment_status"] != checkout_status.payment_status:
                await self.db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {
                        "$set": {
                            "payment_status": checkout_status.payment_status,
                            "status": checkout_status.status,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                
                # If payment successful, activate subscription
                if checkout_status.payment_status == "paid" and transaction.get("subscription_activated") != True:
                    await self._activate_subscription(transaction, checkout_status)
            
            return checkout_status
            
        except Exception as e:
            logger.error(f"Failed to get checkout status: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to check payment status: {str(e)}")
    
    async def handle_webhook(self, webhook_body: bytes, stripe_signature: str, request: Request) -> Dict[str, Any]:
        """Handle Stripe webhooks"""
        
        stripe_checkout = self._get_stripe_checkout(request)
        
        try:
            webhook_response = await stripe_checkout.handle_webhook(webhook_body, stripe_signature)
            
            logger.info(f"Webhook received: {webhook_response.event_type} for session {webhook_response.session_id}")
            
            # Update transaction based on webhook
            if webhook_response.session_id:
                transaction = await self.db.payment_transactions.find_one({"session_id": webhook_response.session_id})
                
                if transaction:
                    await self.db.payment_transactions.update_one(
                        {"session_id": webhook_response.session_id},
                        {
                            "$set": {
                                "payment_status": webhook_response.payment_status,
                                "webhook_event_type": webhook_response.event_type,
                                "webhook_event_id": webhook_response.event_id,
                                "updated_at": datetime.utcnow()
                            }
                        }
                    )
                    
                    # Activate subscription if payment successful
                    if webhook_response.payment_status == "paid" and transaction.get("subscription_activated") != True:
                        checkout_status = CheckoutStatusResponse(
                            status="complete",
                            payment_status="paid",
                            amount_total=int(transaction["amount"] * 100),  # Stripe uses cents
                            currency=transaction["currency"],
                            metadata=transaction["metadata"]
                        )
                        await self._activate_subscription(transaction, checkout_status)
            
            return {
                "event_type": webhook_response.event_type,
                "session_id": webhook_response.session_id,
                "processed": True
            }
            
        except Exception as e:
            logger.error(f"Webhook processing failed: {e}")
            raise HTTPException(status_code=400, detail="Webhook processing failed")
    
    async def _activate_subscription(self, transaction: Dict[str, Any], checkout_status: CheckoutStatusResponse):
        """Activate user subscription after successful payment"""
        
        try:
            user_id = transaction["user_id"]
            package_id = transaction["package_id"]
            package = self.subscription_packages[package_id]
            
            # Calculate subscription expiry
            from datetime import timedelta
            if package["billing_cycle"] == "monthly":
                expires_at = datetime.utcnow() + timedelta(days=30)
            else:  # quarterly
                expires_at = datetime.utcnow() + timedelta(days=90)
            
            # Update user subscription
            await self.db.users.update_one(
                {"id": user_id},
                {
                    "$set": {
                        "subscription_type": package["billing_cycle"],
                        "subscription_package": package_id,
                        "subscription_expires": expires_at,
                        "learning_level": package["learning_level"],
                        "age_group": package["age_group"],
                        "subscription_activated_at": datetime.utcnow(),
                        "is_premium": True
                    }
                }
            )
            
            # Mark transaction as activated
            await self.db.payment_transactions.update_one(
                {"session_id": transaction["session_id"]},
                {
                    "$set": {
                        "subscription_activated": True,
                        "subscription_activated_at": datetime.utcnow()
                    }
                }
            )
            
            # Log subscription activity
            activity = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "activity_type": "subscription_activated",
                "description": f"Subscription activated: {package['name']}",
                "metadata": {
                    "package_id": package_id,
                    "amount": transaction["amount"],
                    "currency": transaction["currency"],
                    "expires_at": expires_at.isoformat()
                },
                "timestamp": datetime.utcnow(),
                "ip_address": None
            }
            
            await self.db.activity_logs.insert_one(activity)
            
            logger.info(f"Activated subscription for user {user_id}: {package['name']}")
            
        except Exception as e:
            logger.error(f"Failed to activate subscription: {e}")
            # Don't raise exception here to avoid breaking webhook processing
    
    def get_package_info(self, package_id: str) -> Dict[str, Any]:
        """Get package information"""
        if package_id not in self.subscription_packages:
            raise HTTPException(status_code=404, detail="Package not found")
        return self.subscription_packages[package_id]
    
    def get_all_packages(self) -> Dict[str, Any]:
        """Get all available packages"""
        return self.subscription_packages
    
    async def get_user_subscription_status(self, user_id: str) -> Dict[str, Any]:
        """Get user's current subscription status"""
        user = await self.db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get recent transactions
        transactions = await self.db.payment_transactions.find(
            {"user_id": user_id},
            sort=[("created_at", -1)]
        ).limit(5).to_list(5)
        
        # Clean up ObjectId
        for transaction in transactions:
            if "_id" in transaction:
                del transaction["_id"]
        
        subscription_info = {
            "has_subscription": bool(user.get("subscription_type")),
            "subscription_type": user.get("subscription_type"),
            "subscription_package": user.get("subscription_package"),
            "subscription_expires": user.get("subscription_expires"),
            "is_premium": user.get("is_premium", False),
            "learning_level": user.get("learning_level"),
            "age_group": user.get("age_group"),
            "recent_transactions": transactions
        }
        
        return subscription_info