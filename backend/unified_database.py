from motor.motor_asyncio import AsyncIOMotorClient
from models import *
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
import logging

logger = logging.getLogger(__name__)

class UnifiedDatabaseManager:
    """Unified database manager for TecaiKids platform (ages 4-16)"""
    
    @classmethod
    async def get_db(cls):
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        return db
    
    # User Management
    @classmethod
    async def create_user(cls, user_data: UserCreate) -> User:
        """Create a new user with unified age level assignment"""
        db = await cls.get_db()
        
        # Determine age level based on age
        age = user_data.age
        if 4 <= age <= 6:
            age_level = UnifiedAgeLevel.LITTLE_LEARNERS
        elif 7 <= age <= 9:
            age_level = UnifiedAgeLevel.YOUNG_EXPLORERS
        elif 10 <= age <= 12:
            age_level = UnifiedAgeLevel.SMART_KIDS
        elif 13 <= age <= 15:
            age_level = UnifiedAgeLevel.TECH_TEENS
        elif 16 <= age <= 18:
            age_level = UnifiedAgeLevel.FUTURE_LEADERS
        else:
            raise ValueError(f"Age {age} is not supported. Please use ages 4-18.")
        
        # Create user object
        user = User(
            name=user_data.name,
            age=user_data.age,
            age_level=age_level,
            parent_email=user_data.parent_email,
            student_email=user_data.student_email,
            phone=user_data.phone,
            school=user_data.school,
            grade=user_data.grade,
            interests=user_data.interests,
            career_goals=user_data.career_goals,
            avatar=user_data.avatar
        )
        
        # Insert into database
        result = await db.users.insert_one(user.dict())
        user.id = str(result.inserted_id) if result.inserted_id else user.id
        
        logger.info(f"Created user {user.id} with age level {age_level}")
        return user
    
    @classmethod
    async def get_user(cls, user_id: str) -> Optional[User]:
        """Get user by ID"""
        db = await cls.get_db()
        user_data = await db.users.find_one({"id": user_id})
        return User(**user_data) if user_data else None
    
    @classmethod
    async def get_user_stats(cls, user_id: str) -> Optional[UserStats]:
        """Get comprehensive user statistics"""
        db = await cls.get_db()
        
        user = await cls.get_user(user_id)
        if not user:
            return None
        
        # Get user progress data
        progress_data = await db.user_progress.find({"user_id": user_id}).to_list(length=None)
        quiz_attempts = await db.quiz_attempts.find({"user_id": user_id}).to_list(length=None)
        achievements = await db.user_achievements.find({"user_id": user_id}).to_list(length=None)
        
        # Calculate statistics
        total_courses_completed = len([p for p in progress_data if p.get("is_completed", False)])
        total_quizzes_completed = len(quiz_attempts)
        total_time_spent_hours = sum([p.get("time_spent_minutes", 0) for p in progress_data]) / 60.0
        
        # Calculate streak (simplified)
        current_streak = user.streak_days
        
        # Find favorite category
        category_counts = {}
        for progress in progress_data:
            category = progress.get("category")
            if category:
                category_counts[category] = category_counts.get(category, 0) + 1
        
        favorite_category = max(category_counts, key=category_counts.get) if category_counts else None
        
        # Weekly progress (simplified)
        weekly_progress = {
            "monday": 0, "tuesday": 0, "wednesday": 0, "thursday": 0,
            "friday": 0, "saturday": 0, "sunday": 0
        }
        
        return UserStats(
            user=user,
            total_courses_completed=total_courses_completed,
            total_quizzes_completed=total_quizzes_completed,
            total_time_spent_hours=total_time_spent_hours,
            current_streak=current_streak,
            achievements_count=len(achievements),
            favorite_category=favorite_category,
            weekly_progress=weekly_progress
        )
    
    # Content Management
    @classmethod
    async def get_age_based_content(cls, age_level: UnifiedAgeLevel) -> AgeBasedContent:
        """Get all content for a specific age level"""
        db = await cls.get_db()
        
        # Get courses for this age level
        course_data = await db.courses.find({"age_level": age_level}).to_list(length=None)
        courses = [Course(**course) for course in course_data]
        
        # Get quizzes for this age level
        quiz_data = await db.quizzes.find({"age_level": age_level}).to_list(length=None)
        quizzes = [Quiz(**quiz) for quiz in quiz_data]
        
        # Get activities for this age level
        activity_data = await db.activities.find({"age_level": age_level}).to_list(length=None)
        activities = [Activity(**activity) for activity in activity_data]
        
        return AgeBasedContent(
            courses=courses,
            quizzes=quizzes,
            activities=activities,
            recommended_for_age=age_level
        )
    
    # Course Management
    @classmethod
    async def get_all_courses(cls) -> List[Course]:
        """Get all available courses"""
        db = await cls.get_db()
        course_data = await db.courses.find({}).to_list(length=None)
        return [Course(**course) for course in course_data]
    
    @classmethod
    async def get_courses_by_age_level(cls, age_level: UnifiedAgeLevel) -> List[Course]:
        """Get courses filtered by age level"""
        db = await cls.get_db()
        course_data = await db.courses.find({"age_level": age_level}).to_list(length=None)
        return [Course(**course) for course in course_data]
    
    @classmethod
    async def get_courses_by_category(cls, category: CourseCategory, age_level: UnifiedAgeLevel = None) -> List[Course]:
        """Get courses filtered by category and optionally age level"""
        db = await cls.get_db()
        query = {"category": category}
        if age_level:
            query["age_level"] = age_level
        
        course_data = await db.courses.find(query).to_list(length=None)
        return [Course(**course) for course in course_data]
    
    @classmethod
    async def create_course(cls, course_data: CourseCreate) -> Course:
        """Create a new course"""
        db = await cls.get_db()
        
        course = Course(**course_data.dict())
        result = await db.courses.insert_one(course.dict())
        course.id = str(result.inserted_id) if result.inserted_id else course.id
        
        return course
    
    # Quiz Management
    @classmethod
    async def get_quizzes_by_age_level(cls, age_level: UnifiedAgeLevel) -> List[Quiz]:
        """Get quizzes for a specific age level"""
        db = await cls.get_db()
        quiz_data = await db.quizzes.find({"age_level": age_level}).to_list(length=None)
        return [Quiz(**quiz) for quiz in quiz_data]
    
    @classmethod
    async def get_quizzes_by_category(cls, category: CourseCategory, age_level: UnifiedAgeLevel = None) -> List[Quiz]:
        """Get quizzes filtered by category and optionally age level"""
        db = await cls.get_db()
        query = {"category": category}
        if age_level:
            query["age_level"] = age_level
        
        quiz_data = await db.quizzes.find(query).to_list(length=None)
        return [Quiz(**quiz) for quiz in quiz_data]
    
    @classmethod
    async def get_quiz(cls, quiz_id: str) -> Optional[Quiz]:
        """Get a specific quiz by ID"""
        db = await cls.get_db()
        quiz_data = await db.quizzes.find_one({"id": quiz_id})
        return Quiz(**quiz_data) if quiz_data else None
    
    @classmethod
    async def create_quiz(cls, quiz_data: QuizCreate) -> Quiz:
        """Create a new quiz"""
        db = await cls.get_db()
        
        quiz = Quiz(**quiz_data.dict())
        result = await db.quizzes.insert_one(quiz.dict())
        quiz.id = str(result.inserted_id) if result.inserted_id else quiz.id
        
        return quiz
    
    # Quiz Attempts
    @classmethod
    async def create_quiz_attempt(cls, attempt_data: QuizAttemptCreate) -> QuizResult:
        """Submit a quiz attempt and get results"""
        db = await cls.get_db()
        
        # Get the quiz to calculate scoring
        quiz = await cls.get_quiz(attempt_data.quiz_id)
        if not quiz:
            raise ValueError("Quiz not found")
        
        # Calculate score
        correct_answers = sum(1 for answer in attempt_data.answers if answer.is_correct)
        total_questions = len(quiz.questions)
        percentage = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        passed = percentage >= quiz.passing_score
        
        # Create quiz attempt
        quiz_attempt = QuizAttempt(
            user_id=attempt_data.user_id,
            quiz_id=attempt_data.quiz_id,
            answers=attempt_data.answers,
            score=correct_answers,
            percentage=percentage,
            time_taken_seconds=attempt_data.time_taken_seconds,
            passed=passed
        )
        
        # Insert into database
        result = await db.quiz_attempts.insert_one(quiz_attempt.dict())
        quiz_attempt.id = str(result.inserted_id) if result.inserted_id else quiz_attempt.id
        
        # Format time taken
        minutes = attempt_data.time_taken_seconds // 60
        seconds = attempt_data.time_taken_seconds % 60
        time_taken_formatted = f"{minutes}m {seconds}s"
        
        # Check for achievements (simplified)
        achievements_unlocked = []
        
        return QuizResult(
            quiz_attempt=quiz_attempt,
            correct_answers=correct_answers,
            total_questions=total_questions,
            time_taken=time_taken_formatted,
            achievements_unlocked=achievements_unlocked
        )
    
    @classmethod
    async def get_user_quiz_attempts(cls, user_id: str) -> List[QuizAttempt]:
        """Get all quiz attempts for a user"""
        db = await cls.get_db()
        attempt_data = await db.quiz_attempts.find({"user_id": user_id}).sort("completed_at", -1).to_list(length=None)
        return [QuizAttempt(**attempt) for attempt in attempt_data]
    
    # Leaderboard
    @classmethod
    async def get_leaderboard(cls, age_level: UnifiedAgeLevel, limit: int = 10) -> List[LeaderboardEntry]:
        """Get leaderboard for specific age level"""
        db = await cls.get_db()
        
        # Aggregate user scores for the age level
        pipeline = [
            {"$match": {"age_level": age_level}},
            {"$sort": {"total_points": -1}},
            {"$limit": limit}
        ]
        
        users_data = await db.users.aggregate(pipeline).to_list(length=None)
        
        leaderboard = []
        for i, user_data in enumerate(users_data):
            entry = LeaderboardEntry(
                user_id=user_data["id"],
                user_name=user_data["name"],
                total_points=user_data.get("total_points", 0),
                rank=i + 1,
                age_level=UnifiedAgeLevel(user_data["age_level"]),
                avatar=user_data.get("avatar")
            )
            leaderboard.append(entry)
        
        return leaderboard
    
    # Progress Tracking
    @classmethod
    async def update_user_progress(cls, user_id: str, course_id: str = None, quiz_id: str = None, 
                                 category: CourseCategory = None, time_spent: int = 0):
        """Update user progress"""
        db = await cls.get_db()
        
        # Update or create progress record
        query = {"user_id": user_id}
        if course_id:
            query["course_id"] = course_id
        if quiz_id:
            query["quiz_id"] = quiz_id
        
        progress_data = {
            "user_id": user_id,
            "category": category,
            "time_spent_minutes": time_spent,
            "last_accessed": datetime.utcnow(),
            "completion_percentage": 100.0 if quiz_id else 50.0  # Simplified
        }
        
        if course_id:
            progress_data["course_id"] = course_id
        if quiz_id:
            progress_data["quiz_id"] = quiz_id
            progress_data["is_completed"] = True
        
        await db.user_progress.update_one(
            query,
            {"$set": progress_data},
            upsert=True
        )
        
        # Update user's last activity
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"last_activity": datetime.utcnow()}}
        )
    
    # Dashboard Data
    @classmethod
    async def get_unified_dashboard_data(cls, user_id: str) -> Dict[str, Any]:
        """Get comprehensive dashboard data for unified platform"""
        db = await cls.get_db()
        
        user = await cls.get_user(user_id)
        if not user:
            return None
        
        # Get age-appropriate content
        content = await cls.get_age_based_content(user.age_level)
        
        # Get user stats
        stats = await cls.get_user_stats(user_id)
        
        # Get recent quiz attempts
        recent_attempts = await cls.get_user_quiz_attempts(user_id)
        recent_attempts = recent_attempts[:5]  # Last 5 attempts
        
        # Get leaderboard position
        leaderboard = await cls.get_leaderboard(user.age_level, 100)
        user_rank = next((entry.rank for entry in leaderboard if entry.user_id == user_id), None)
        
        # Get subscription information
        subscription = None
        if user.subscription_id:
            subscription_data = await db.subscriptions.find_one({"id": user.subscription_id})
            if subscription_data:
                subscription = Subscription(**subscription_data)
        
        return {
            "user": user,
            "stats": stats,
            "content": content,
            "recent_attempts": recent_attempts,
            "leaderboard_rank": user_rank,
            "subscription": subscription,
            "recommended_quizzes": content.quizzes[:3],  # Top 3 recommended
            "recommended_courses": content.courses[:3],   # Top 3 recommended
            "age_level_info": {
                "current_level": user.age_level,
                "level_name": cls.get_age_level_name(user.age_level),
                "level_description": cls.get_age_level_description(user.age_level),
                "skills_focus": cls.get_age_level_skills(user.age_level)
            }
        }
    
    @classmethod
    def get_age_level_name(cls, age_level: UnifiedAgeLevel) -> str:
        """Get display name for age level"""
        names = {
            UnifiedAgeLevel.LITTLE_LEARNERS: "Little Learners",
            UnifiedAgeLevel.YOUNG_EXPLORERS: "Young Explorers",
            UnifiedAgeLevel.SMART_KIDS: "Smart Kids",
            UnifiedAgeLevel.TECH_TEENS: "Tech Teens",
            UnifiedAgeLevel.FUTURE_LEADERS: "Future Leaders"
        }
        return names.get(age_level, "Unknown Level")
    
    @classmethod
    def get_age_level_description(cls, age_level: UnifiedAgeLevel) -> str:
        """Get description for age level"""
        descriptions = {
            UnifiedAgeLevel.LITTLE_LEARNERS: "Fun basics for little learners (Ages 4-6)",
            UnifiedAgeLevel.YOUNG_EXPLORERS: "Building foundational skills (Ages 7-9)",
            UnifiedAgeLevel.SMART_KIDS: "Advanced concepts and challenges (Ages 10-12)",
            UnifiedAgeLevel.TECH_TEENS: "Technology and programming skills (Ages 13-15)",
            UnifiedAgeLevel.FUTURE_LEADERS: "Advanced technology and leadership (Ages 16-18)"
        }
        return descriptions.get(age_level, "Unknown Level")
    
    @classmethod
    def get_age_level_skills(cls, age_level: UnifiedAgeLevel) -> List[str]:
        """Get skills focus for age level"""
        skills = {
            UnifiedAgeLevel.LITTLE_LEARNERS: ["Numbers 1-10", "Letters & Sounds", "Colors & Shapes", "Logical Thinking Basics"],
            UnifiedAgeLevel.YOUNG_EXPLORERS: ["Math & Reading", "Science Basics", "Creative Projects", "Logical Thinking Development"],
            UnifiedAgeLevel.SMART_KIDS: ["Advanced Math", "Coding Basics", "STEM Projects", "Algorithmic Thinking"],
            UnifiedAgeLevel.TECH_TEENS: ["Programming", "Web Development", "Digital Literacy", "Advanced Algorithms"],
            UnifiedAgeLevel.FUTURE_LEADERS: ["AI & Machine Learning", "App Development", "Leadership Skills", "Complex Problem Solving"]
        }
        return skills.get(age_level, [])