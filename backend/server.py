from fastapi import FastAPI, APIRouter, HTTPException, Request, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from models import *
from unified_database import UnifiedDatabaseManager
from payment_service import PaymentService
from course_data import populate_sample_courses
from quiz_data import populate_sample_quizzes
from teen_data import populate_teen_sample_data
from typing import List, Optional, Dict, Any

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize Payment Service
payment_service = PaymentService(db)

# Create the main app
app = FastAPI(title="TecaiKids Unified API", version="2.0.0", description="Unified TecaiKids Platform API (Ages 4-18)")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Basic health check
@api_router.get("/")
async def root():
    return {"message": "TecaiKids Unified API is running!", "version": "2.0.0", "platform": "Unified Ages 4-18"}

# ================================
# UNIFIED USER MANAGEMENT
# ================================

@api_router.post("/users", response_model=User)
async def create_user(user_data: UserCreate):
    """Create a new user with unified age-level assignment (Ages 4-18)."""
    try:
        user = await UnifiedDatabaseManager.create_user(user_data)
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get user by ID."""
    user = await UnifiedDatabaseManager.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.get("/users/{user_id}/stats", response_model=UserStats)
async def get_user_stats(user_id: str):
    """Get comprehensive user statistics and progress."""
    stats = await UnifiedDatabaseManager.get_user_stats(user_id)
    if not stats:
        raise HTTPException(status_code=404, detail="User not found")
    return stats

@api_router.get("/users/{user_id}/dashboard")
async def get_unified_dashboard(user_id: str):
    """Get unified dashboard data for any age level."""
    try:
        dashboard_data = await UnifiedDatabaseManager.get_unified_dashboard_data(user_id)
        if not dashboard_data:
            raise HTTPException(status_code=404, detail="User not found")
        return dashboard_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ================================
# UNIFIED CONTENT MANAGEMENT
# ================================

@api_router.get("/content/{age_level}", response_model=AgeBasedContent)
async def get_age_based_content(age_level: UnifiedAgeLevel):
    """Get all content appropriate for a specific unified age level."""
    try:
        content = await UnifiedDatabaseManager.get_age_based_content(age_level)
        return content
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/courses", response_model=List[Course])
async def get_all_courses():
    """Get all available courses across all age levels."""
    courses = await UnifiedDatabaseManager.get_all_courses()
    return courses

@api_router.get("/courses/age/{age_level}", response_model=List[Course])
async def get_courses_by_age(age_level: UnifiedAgeLevel):
    """Get courses filtered by unified age level."""
    courses = await UnifiedDatabaseManager.get_courses_by_age_level(age_level)
    return courses

@api_router.get("/courses/category/{category}", response_model=List[Course])
async def get_courses_by_category(category: CourseCategory, age_level: UnifiedAgeLevel = None):
    """Get courses filtered by category and optionally age level."""
    courses = await UnifiedDatabaseManager.get_courses_by_category(category, age_level)
    return courses

@api_router.post("/courses", response_model=Course)
async def create_course(course_data: CourseCreate):
    """Create a new course."""
    try:
        course = await UnifiedDatabaseManager.create_course(course_data)
        return course
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ================================
# QUIZ MANAGEMENT
# ================================

@api_router.get("/quizzes/age/{age_level}", response_model=List[Quiz])
async def get_quizzes_by_age(age_level: UnifiedAgeLevel):
    """Get all quizzes for a specific unified age level."""
    quizzes = await UnifiedDatabaseManager.get_quizzes_by_age_level(age_level)
    return quizzes

@api_router.get("/quizzes/category/{category}", response_model=List[Quiz])
async def get_quizzes_by_category(category: CourseCategory, age_level: UnifiedAgeLevel = None):
    """Get quizzes filtered by category and optionally age level."""
    quizzes = await UnifiedDatabaseManager.get_quizzes_by_category(category, age_level)
    return quizzes

@api_router.get("/quizzes/{quiz_id}", response_model=Quiz)
async def get_quiz(quiz_id: str):
    """Get a specific quiz by ID."""
    quiz = await UnifiedDatabaseManager.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@api_router.post("/quizzes", response_model=Quiz)
async def create_quiz(quiz_data: QuizCreate):
    """Create a new quiz."""
    try:
        quiz = await UnifiedDatabaseManager.create_quiz(quiz_data)
        return quiz
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/quiz-attempts", response_model=QuizResult)
async def submit_quiz_attempt(attempt_data: QuizAttemptCreate):
    """Submit a quiz attempt and get results with achievements."""
    try:
        result = await UnifiedDatabaseManager.create_quiz_attempt(attempt_data)
        
        # Update user progress
        await UnifiedDatabaseManager.update_user_progress(
            user_id=attempt_data.user_id,
            quiz_id=attempt_data.quiz_id,
            time_spent=attempt_data.time_taken_seconds // 60
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/users/{user_id}/quiz-attempts", response_model=List[QuizAttempt])
async def get_user_quiz_attempts(user_id: str):
    """Get all quiz attempts for a user."""
    attempts = await UnifiedDatabaseManager.get_user_quiz_attempts(user_id)
    return attempts

# ================================
# LEADERBOARD & PROGRESS
# ================================

@api_router.get("/leaderboard/{age_level}", response_model=List[LeaderboardEntry])
async def get_leaderboard(age_level: UnifiedAgeLevel, limit: int = 10):
    """Get leaderboard for specific unified age level."""
    leaderboard = await UnifiedDatabaseManager.get_leaderboard(age_level, limit)
    return leaderboard

@api_router.post("/progress")
async def update_progress(user_id: str, course_id: str = None, quiz_id: str = None, 
                         category: CourseCategory = None, time_spent: int = 0):
    """Update user progress for courses or quizzes."""
    try:
        await UnifiedDatabaseManager.update_user_progress(user_id, course_id, quiz_id, category, time_spent)
        return {"message": "Progress updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ================================
# PAYMENT & SUBSCRIPTION SYSTEM
# ================================

@api_router.get("/pricing")
async def get_pricing_plans():
    """Get pricing plans for all age levels."""
    pricing_plans = {}
    for age_level in UnifiedAgeLevel:
        plan = payment_service.get_pricing_plan(age_level)
        if plan:
            pricing_plans[age_level.value] = plan.dict()
    return {"pricing_plans": pricing_plans}

@api_router.get("/pricing/{age_level}")
async def get_pricing_plan(age_level: UnifiedAgeLevel):
    """Get pricing plan for specific age level."""
    plan = payment_service.get_pricing_plan(age_level)
    if not plan:
        raise HTTPException(status_code=404, detail="Pricing plan not found")
    return plan.dict()

@api_router.post("/payments/stripe", response_model=PaymentResponse)
async def create_stripe_payment(payment_request: PaymentRequest, request: Request):
    """Create Stripe checkout session."""
    try:
        host_url = str(request.base_url).rstrip('/')
        response = await payment_service.create_stripe_payment(payment_request, host_url)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/payments/bank-transfer", response_model=PaymentResponse)
async def create_bank_transfer_payment(payment_request: PaymentRequest):
    """Create bank transfer payment."""
    try:
        response = await payment_service.create_bank_transfer_payment(payment_request)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/payments/ezcash", response_model=PaymentResponse)
async def create_ezcash_payment(payment_request: PaymentRequest):
    """Create eZ Cash payment."""
    try:
        response = await payment_service.create_ezcash_payment(payment_request)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str):
    """Get payment status for a session."""
    try:
        status = await payment_service.get_payment_status(session_id)
        return status
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    """Handle Stripe webhook events."""
    try:
        webhook_body = await request.body()
        signature = request.headers.get("Stripe-Signature", "")
        
        # Process webhook in background
        background_tasks.add_task(
            payment_service.handle_stripe_webhook,
            webhook_body,
            signature
        )
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Stripe webhook error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/subscriptions/{user_id}")
async def get_user_subscription(user_id: str):
    """Get user subscription details."""
    try:
        subscription_data = await db.subscriptions.find_one({"user_id": user_id, "status": SubscriptionStatus.ACTIVE})
        if subscription_data:
            return Subscription(**subscription_data).dict()
        return {"message": "No active subscription found"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/workbook-deliveries/{user_id}")
async def get_user_workbook_deliveries(user_id: str):
    """Get user workbook delivery history."""
    try:
        deliveries = await db.workbook_deliveries.find({"user_id": user_id}).sort("created_at", -1).to_list(length=None)
        return {"deliveries": [WorkbookDelivery(**delivery).dict() for delivery in deliveries]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ================================
# UNIFIED AGE LEVELS & METADATA
# ================================

@api_router.get("/age-levels")
async def get_unified_age_levels():
    """Get all available unified age levels."""
    return {
        "age_levels": [
            {
                "value": UnifiedAgeLevel.LITTLE_LEARNERS,
                "label": "Little Learners (Ages 4-6)",
                "description": "Fun basics for little learners",
                "icon": "🌟",
                "skills": ["Numbers 1-10", "Letters & Sounds", "Colors & Shapes", "Logical Thinking Basics"]
            },
            {
                "value": UnifiedAgeLevel.YOUNG_EXPLORERS,
                "label": "Young Explorers (Ages 7-9)",
                "description": "Building foundational skills",
                "icon": "🚀",
                "skills": ["Math & Reading", "Science Basics", "Creative Projects", "Logical Thinking Development"]
            },
            {
                "value": UnifiedAgeLevel.SMART_KIDS,
                "label": "Smart Kids (Ages 10-12)",
                "description": "Advanced concepts and challenges",
                "icon": "⚡",
                "skills": ["Advanced Math", "Coding Basics", "STEM Projects", "Algorithmic Thinking"]
            },
            {
                "value": UnifiedAgeLevel.TECH_TEENS,
                "label": "Tech Teens (Ages 13-15)",
                "description": "Technology and programming skills",
                "icon": "💻",
                "skills": ["Programming", "Web Development", "Digital Literacy", "Advanced Algorithms"]
            },
            {
                "value": UnifiedAgeLevel.FUTURE_LEADERS,
                "label": "Future Leaders (Ages 16-18)",
                "description": "Advanced technology and leadership",
                "icon": "🎯",
                "skills": ["AI & Machine Learning", "App Development", "Leadership Skills", "Complex Problem Solving"]
            }
        ]
    }

@api_router.get("/categories")
async def get_categories():
    """Get all available course categories."""
    return {
        "categories": [
            {"value": CourseCategory.MATH, "label": "Math", "icon": "🔢"},
            {"value": CourseCategory.SCIENCE, "label": "Science", "icon": "🔬"},
            {"value": CourseCategory.ENGLISH, "label": "English", "icon": "📚"},
            {"value": CourseCategory.ART, "label": "Art", "icon": "🎨"},
            {"value": CourseCategory.CODING, "label": "Coding", "icon": "💻"},
            {"value": CourseCategory.MUSIC, "label": "Music", "icon": "🎵"},
            {"value": CourseCategory.LOGICAL_THINKING, "label": "Logical Thinking", "icon": "🧠"},
            {"value": CourseCategory.ALGORITHMIC_THINKING, "label": "Algorithmic Thinking", "icon": "⚙️"}
        ]
    }

@api_router.get("/payment-methods")
async def get_payment_methods():
    """Get available payment methods."""
    return {
        "payment_methods": [
            {
                "value": PaymentMethod.STRIPE,
                "label": "Credit/Debit Card",
                "description": "Secure online payment via Stripe",
                "icon": "💳",
                "available": True
            },
            {
                "value": PaymentMethod.BANK_TRANSFER,
                "label": "Bank Transfer",
                "description": "Direct transfer to Bank of Ceylon",
                "icon": "🏦",
                "available": True,
                "bank_details": {
                    "bank_name": "Bank of Ceylon",
                    "account_holder": "TEC Sri Lanka Worldwide (Pvt.) Ltd"
                }
            },
            {
                "value": PaymentMethod.EZCASH,
                "label": "eZ Cash",
                "description": "Mobile payment via eZ Cash",
                "icon": "📱",
                "available": False,
                "coming_soon": True
            },
            {
                "value": PaymentMethod.MCASH,
                "label": "mCash",
                "description": "Mobile payment via mCash",
                "icon": "📱",
                "available": False,
                "coming_soon": True
            }
        ]
    }

# ================================
# SAMPLE DATA INITIALIZATION
# ================================

@api_router.post("/init/courses")
async def initialize_courses():
    """Initialize sample courses (development only)."""
    try:
        await populate_sample_courses()
        return {"message": "Sample courses initialized successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/init/quizzes")
async def initialize_quizzes():
    """Initialize sample quizzes (development only)."""
    try:
        await populate_sample_quizzes()
        return {"message": "Sample quizzes initialized successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/init/teen-data")
async def initialize_teen_data():
    """Initialize sample teen platform data (development only)."""
    try:
        await populate_teen_sample_data()
        return {"message": "Teen sample data initialized successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/init/all")
async def initialize_all_data():
    """Initialize all sample data (development only)."""
    try:
        await populate_sample_courses()
        await populate_sample_quizzes()
        await populate_teen_sample_data()
        return {"message": "All sample data initialized successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)