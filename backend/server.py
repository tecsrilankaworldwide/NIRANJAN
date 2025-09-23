from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from models import *
from database import DatabaseManager
from quiz_data import populate_sample_quizzes
from course_data import populate_sample_courses
from teen_models import *
from teen_database import TeenDatabaseManager
from teen_data import populate_teen_sample_data
from typing import List, Optional

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="TecaiKids API", version="1.0.0")

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
    return {"message": "TecaiKids API is running!", "version": "1.0.0"}

# User Endpoints
@api_router.post("/users", response_model=User)
async def create_user(user_data: UserCreate):
    """Create a new user with age-appropriate level assignment."""
    try:
        user = await DatabaseManager.create_user(user_data)
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get user by ID."""
    user = await DatabaseManager.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.get("/users/{user_id}/stats", response_model=UserStats)
async def get_user_stats(user_id: str):
    """Get comprehensive user statistics and progress."""
    stats = await DatabaseManager.get_user_stats(user_id)
    if not stats:
        raise HTTPException(status_code=404, detail="User not found")
    return stats

# Age-based Content Endpoints
@api_router.get("/content/{age_level}", response_model=AgeBasedContent)
async def get_age_based_content(age_level: AgeLevel):
    """Get all content appropriate for a specific age level."""
    try:
        content = await DatabaseManager.get_age_based_content(age_level)
        return content
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Course Endpoints
@api_router.get("/courses", response_model=List[Course])
async def get_all_courses():
    """Get all available courses."""
    courses = await DatabaseManager.get_all_courses()
    return courses

@api_router.get("/courses/age/{age_level}", response_model=List[Course])
async def get_courses_by_age(age_level: AgeLevel):
    """Get courses filtered by age level."""
    courses = await DatabaseManager.get_courses_by_age_level(age_level)
    return courses

@api_router.get("/courses/category/{category}/age/{age_level}", response_model=List[Course])
async def get_courses_by_category_and_age(category: CourseCategory, age_level: AgeLevel):
    """Get courses filtered by category and age level."""
    courses = await DatabaseManager.get_courses_by_category(category, age_level)
    return courses

@api_router.post("/courses", response_model=Course)
async def create_course(course_data: CourseCreate):
    """Create a new course."""
    try:
        course = await DatabaseManager.create_course(course_data)
        return course
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Quiz Endpoints
@api_router.get("/quizzes/age/{age_level}", response_model=List[Quiz])
async def get_quizzes_by_age(age_level: AgeLevel):
    """Get all quizzes for a specific age level."""
    quizzes = await DatabaseManager.get_quizzes_by_age_level(age_level)
    return quizzes

@api_router.get("/quizzes/category/{category}/age/{age_level}", response_model=List[Quiz])
async def get_quizzes_by_category_and_age(category: CourseCategory, age_level: AgeLevel):
    """Get quizzes filtered by category and age level."""
    quizzes = await DatabaseManager.get_quizzes_by_category(category, age_level)
    return quizzes

@api_router.get("/quizzes/{quiz_id}", response_model=Quiz)
async def get_quiz(quiz_id: str):
    """Get a specific quiz by ID."""
    quiz = await DatabaseManager.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@api_router.post("/quizzes", response_model=Quiz)
async def create_quiz(quiz_data: QuizCreate):
    """Create a new quiz."""
    try:
        quiz = await DatabaseManager.create_quiz(quiz_data)
        return quiz
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Quiz Attempt Endpoints
@api_router.post("/quiz-attempts", response_model=QuizResult)
async def submit_quiz_attempt(attempt_data: QuizAttemptCreate):
    """Submit a quiz attempt and get results with achievements."""
    try:
        result = await DatabaseManager.create_quiz_attempt(attempt_data)
        
        # Update user progress
        await DatabaseManager.update_user_progress(
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
    attempts = await DatabaseManager.get_user_quiz_attempts(user_id)
    return attempts

# Leaderboard Endpoints
@api_router.get("/leaderboard/{age_level}", response_model=List[LeaderboardEntry])
async def get_leaderboard(age_level: AgeLevel, limit: int = 10):
    """Get leaderboard for specific age level."""
    leaderboard = await DatabaseManager.get_leaderboard(age_level, limit)
    return leaderboard

# Progress Tracking
@api_router.post("/progress")
async def update_progress(user_id: str, course_id: str = None, quiz_id: str = None, 
                         category: CourseCategory = None, time_spent: int = 0):
    """Update user progress for courses or quizzes."""
    try:
        await DatabaseManager.update_user_progress(user_id, course_id, quiz_id, category, time_spent)
        return {"message": "Progress updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Initialize Sample Data Endpoints (for development)
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

@api_router.post("/init/all")
async def initialize_all_data():
    """Initialize all sample data (development only)."""
    try:
        await populate_sample_courses()
        await populate_sample_quizzes()
        return {"message": "All sample data initialized successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Age Level Helper Endpoints
@api_router.get("/age-levels")
async def get_age_levels():
    """Get all available age levels."""
    return {
        "age_levels": [
            {"value": AgeLevel.PRESCHOOL, "label": "Preschool (4-6 years)", "description": "Fun basics for little learners"},
            {"value": AgeLevel.ELEMENTARY, "label": "Elementary (7-9 years)", "description": "Building foundational skills"},
            {"value": AgeLevel.INTERMEDIATE, "label": "Intermediate (10-12 years)", "description": "Advanced concepts and challenges"}
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
            {"value": CourseCategory.MUSIC, "label": "Music", "icon": "🎵"}
        ]
    }

# Dashboard Data
@api_router.get("/dashboard/{user_id}")
async def get_user_dashboard(user_id: str):
    """Get comprehensive dashboard data for a user."""
    try:
        user = await DatabaseManager.get_user(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get age-appropriate content
        content = await DatabaseManager.get_age_based_content(user.age_level)
        
        # Get user stats
        stats = await DatabaseManager.get_user_stats(user_id)
        
        # Get recent quiz attempts
        recent_attempts = await DatabaseManager.get_user_quiz_attempts(user_id)
        recent_attempts = recent_attempts[:5]  # Last 5 attempts
        
        # Get leaderboard position
        leaderboard = await DatabaseManager.get_leaderboard(user.age_level, 100)
        user_rank = next((entry.rank for entry in leaderboard if entry.user_id == user_id), None)
        
        return {
            "user": user,
            "stats": stats,
            "content": content,
            "recent_attempts": recent_attempts,
            "leaderboard_rank": user_rank,
            "recommended_quizzes": content.quizzes[:3],  # Top 3 recommended
            "recommended_courses": content.courses[:3]   # Top 3 recommended
        }
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