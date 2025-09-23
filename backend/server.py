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

# ================================
# TEEN PLATFORM API ENDPOINTS
# ================================

# Teen User Endpoints
@api_router.post("/teen/users", response_model=TeenUser)
async def create_teen_user(user_data: TeenUserCreate):
    """Create a new teen user with age-appropriate level assignment."""
    try:
        user = await TeenDatabaseManager.create_teen_user(user_data)
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/teen/users/{user_id}", response_model=TeenUser)
async def get_teen_user(user_id: str):
    """Get teen user by ID."""
    user = await TeenDatabaseManager.get_teen_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Teen user not found")
    return user

@api_router.get("/teen/users/{user_id}/dashboard", response_model=TeenDashboardData)
async def get_teen_dashboard(user_id: str):
    """Get comprehensive dashboard data for teen user."""
    try:
        dashboard = await TeenDatabaseManager.get_teen_dashboard_data(user_id)
        if not dashboard:
            raise HTTPException(status_code=404, detail="Teen user not found")
        return dashboard
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Teen Course Endpoints
@api_router.get("/teen/courses", response_model=List[TeenCourse])
async def get_all_teen_courses():
    """Get all available teen courses."""
    courses = await TeenDatabaseManager.get_all_teen_courses()
    return courses

@api_router.get("/teen/courses/age/{age_level}", response_model=List[TeenCourse])
async def get_teen_courses_by_age(age_level: TeenAgeLevel):
    """Get teen courses filtered by age level."""
    courses = await TeenDatabaseManager.get_teen_courses_by_age_level(age_level)
    return courses

@api_router.get("/teen/courses/category/{category}", response_model=List[TeenCourse])
async def get_teen_courses_by_category(category: TeenCourseCategory, age_level: TeenAgeLevel = None):
    """Get teen courses filtered by category and optionally age level."""
    courses = await TeenDatabaseManager.get_teen_courses_by_category(category, age_level)
    return courses

@api_router.post("/teen/courses", response_model=TeenCourse)
async def create_teen_course(course_data: TeenCourseCreate):
    """Create a new teen course."""
    try:
        course = await TeenDatabaseManager.create_teen_course(course_data)
        return course
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Teen Project Endpoints
@api_router.get("/teen/users/{user_id}/projects", response_model=List[TeenProject])
async def get_student_projects(user_id: str):
    """Get all projects for a teen student."""
    projects = await TeenDatabaseManager.get_student_projects(user_id)
    return projects

@api_router.post("/teen/projects")
async def create_teen_project(project_data: dict):
    """Create a new teen project."""
    try:
        project = await TeenDatabaseManager.create_teen_project(project_data)
        return project
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.put("/teen/projects/{project_id}/status")
async def update_project_status(project_id: str, status: str, score: int = None, feedback: str = None):
    """Update project status and scoring."""
    try:
        await TeenDatabaseManager.update_project_status(project_id, status, score, feedback)
        return {"message": "Project status updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Coding Challenge Endpoints
@api_router.get("/teen/challenges/difficulty/{difficulty}", response_model=List[CodingChallenge])
async def get_coding_challenges_by_difficulty(difficulty: TeenDifficultyLevel):
    """Get coding challenges by difficulty level."""
    challenges = await TeenDatabaseManager.get_coding_challenges_by_difficulty(difficulty)
    return challenges

@api_router.post("/teen/challenges", response_model=CodingChallenge)
async def create_coding_challenge(challenge_data: dict):
    """Create a new coding challenge."""
    try:
        challenge = await TeenDatabaseManager.create_coding_challenge(challenge_data)
        return challenge
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/teen/challenges/submit", response_model=CodingSubmission)
async def submit_coding_solution(submission_data: dict):
    """Submit a coding solution."""
    try:
        submission = await TeenDatabaseManager.submit_coding_solution(submission_data)
        return submission
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Mentorship Endpoints
@api_router.post("/teen/mentors", response_model=Mentor)
async def create_mentor(mentor_data: dict):
    """Create a new mentor."""
    try:
        mentor = await TeenDatabaseManager.create_mentor(mentor_data)
        return mentor
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/teen/mentorship/sessions", response_model=MentorshipSession)
async def schedule_mentorship_session(session_data: dict):
    """Schedule a mentorship session."""
    try:
        session = await TeenDatabaseManager.schedule_mentorship_session(session_data)
        return session
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/teen/users/{user_id}/mentorship", response_model=List[MentorshipSession])
async def get_student_mentorship_sessions(user_id: str):
    """Get mentorship sessions for a student."""
    sessions = await TeenDatabaseManager.get_student_mentorship_sessions(user_id)
    return sessions

# Portfolio Endpoints
@api_router.get("/teen/users/{user_id}/portfolio", response_model=TeenPortfolio)
async def get_student_portfolio(user_id: str):
    """Get student portfolio."""
    portfolio = await TeenDatabaseManager.get_student_portfolio(user_id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio

@api_router.post("/teen/portfolios", response_model=TeenPortfolio)
async def create_teen_portfolio(portfolio_data: dict):
    """Create a new teen portfolio."""
    try:
        portfolio = await TeenDatabaseManager.create_teen_portfolio(portfolio_data)
        return portfolio
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.put("/teen/users/{user_id}/portfolio")
async def update_portfolio(user_id: str, update_data: dict):
    """Update student portfolio."""
    try:
        await TeenDatabaseManager.update_portfolio(user_id, update_data)
        return {"message": "Portfolio updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Teen Platform Statistics
@api_router.get("/teen/stats", response_model=TeenStats)
async def get_teen_platform_stats():
    """Get teen platform statistics."""
    try:
        stats = await TeenDatabaseManager.get_teen_platform_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Teen Age Levels and Categories
@api_router.get("/teen/age-levels")
async def get_teen_age_levels():
    """Get all available teen age levels."""
    return {
        "age_levels": [
            {"value": TeenAgeLevel.MIDDLE_TEEN, "label": "Middle Teen (12-14 years)", "description": "Foundation skills and project-based learning"},
            {"value": TeenAgeLevel.HIGH_TEEN, "label": "High Teen (15-17 years)", "description": "Advanced concepts and career preparation"}
        ]
    }

@api_router.get("/teen/categories")
async def get_teen_categories():
    """Get all available teen course categories."""
    return {
        "categories": [
            {"value": TeenCourseCategory.CODING, "label": "Advanced Coding", "icon": "💻"},
            {"value": TeenCourseCategory.ROBOTICS, "label": "Robotics & AI", "icon": "🤖"},
            {"value": TeenCourseCategory.APP_DEV, "label": "Mobile Development", "icon": "📱"},
            {"value": TeenCourseCategory.WEB_DEV, "label": "Web Development", "icon": "🌐"},
            {"value": TeenCourseCategory.DATA_SCIENCE, "label": "Data Science", "icon": "📊"},
            {"value": TeenCourseCategory.GAME_DEV, "label": "Game Development", "icon": "🎮"},
            {"value": TeenCourseCategory.CYBERSECURITY, "label": "Cybersecurity", "icon": "🔒"},
            {"value": TeenCourseCategory.ENTREPRENEURSHIP, "label": "Digital Entrepreneurship", "icon": "🚀"},
            {"value": TeenCourseCategory.CAREER_PREP, "label": "Career Preparation", "icon": "🎯"}
        ]
    }

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