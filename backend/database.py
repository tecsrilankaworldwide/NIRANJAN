from motor.motor_asyncio import AsyncIOMotorClient
from models import *
import os
from typing import List, Optional
from datetime import datetime, timedelta

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
users_collection = db.users
courses_collection = db.courses
quizzes_collection = db.quizzes
quiz_attempts_collection = db.quiz_attempts
progress_collection = db.user_progress
achievements_collection = db.achievements
user_achievements_collection = db.user_achievements
activities_collection = db.activities

class DatabaseManager:
    
    # User Operations
    @staticmethod
    async def create_user(user_data: UserCreate) -> User:
        # Determine age level based on age
        if user_data.age <= 6:
            age_level = AgeLevel.PRESCHOOL
        elif user_data.age <= 9:
            age_level = AgeLevel.ELEMENTARY
        else:
            age_level = AgeLevel.INTERMEDIATE
            
        user = User(
            name=user_data.name,
            age=user_data.age,
            age_level=age_level,
            parent_email=user_data.parent_email,
            avatar=user_data.avatar
        )
        
        await users_collection.insert_one(user.dict())
        return user
    
    @staticmethod
    async def get_user(user_id: str) -> Optional[User]:
        user_doc = await users_collection.find_one({"id": user_id})
        return User(**user_doc) if user_doc else None
    
    @staticmethod
    async def get_users_by_age_level(age_level: AgeLevel) -> List[User]:
        cursor = users_collection.find({"age_level": age_level})
        users = []
        async for doc in cursor:
            users.append(User(**doc))
        return users
    
    @staticmethod
    async def update_user_points(user_id: str, points: int):
        await users_collection.update_one(
            {"id": user_id},
            {"$inc": {"total_points": points}, "$set": {"last_activity": datetime.utcnow()}}
        )
    
    # Course Operations
    @staticmethod
    async def create_course(course_data: CourseCreate) -> Course:
        course = Course(**course_data.dict())
        await courses_collection.insert_one(course.dict())
        return course
    
    @staticmethod
    async def get_courses_by_age_level(age_level: AgeLevel) -> List[Course]:
        cursor = courses_collection.find({"age_level": age_level})
        courses = []
        async for doc in cursor:
            courses.append(Course(**doc))
        return courses
    
    @staticmethod
    async def get_courses_by_category(category: CourseCategory, age_level: AgeLevel) -> List[Course]:
        cursor = courses_collection.find({"category": category, "age_level": age_level})
        courses = []
        async for doc in cursor:
            courses.append(Course(**doc))
        return courses
    
    @staticmethod
    async def get_all_courses() -> List[Course]:
        cursor = courses_collection.find({})
        courses = []
        async for doc in cursor:
            courses.append(Course(**doc))
        return courses
    
    # Quiz Operations
    @staticmethod
    async def create_quiz(quiz_data: QuizCreate) -> Quiz:
        quiz = Quiz(**quiz_data.dict())
        await quizzes_collection.insert_one(quiz.dict())
        return quiz
    
    @staticmethod
    async def get_quiz(quiz_id: str) -> Optional[Quiz]:
        quiz_doc = await quizzes_collection.find_one({"id": quiz_id})
        return Quiz(**quiz_doc) if quiz_doc else None
    
    @staticmethod
    async def get_quizzes_by_age_level(age_level: AgeLevel) -> List[Quiz]:
        cursor = quizzes_collection.find({"age_level": age_level})
        quizzes = []
        async for doc in cursor:
            quizzes.append(Quiz(**doc))
        return quizzes
    
    @staticmethod
    async def get_quizzes_by_category(category: CourseCategory, age_level: AgeLevel) -> List[Quiz]:
        cursor = quizzes_collection.find({"category": category, "age_level": age_level})
        quizzes = []
        async for doc in cursor:
            quizzes.append(Quiz(**doc))
        return quizzes
    
    # Quiz Attempt Operations
    @staticmethod
    async def create_quiz_attempt(attempt_data: QuizAttemptCreate) -> QuizResult:
        # Calculate score and percentage
        total_questions = len(attempt_data.answers)
        correct_answers = sum(1 for answer in attempt_data.answers if answer.is_correct)
        score = sum(answer.points_earned for answer in attempt_data.answers)
        percentage = (correct_answers / total_questions) * 100
        
        # Get quiz to check passing score
        quiz = await DatabaseManager.get_quiz(attempt_data.quiz_id)
        passed = percentage >= quiz.passing_score if quiz else False
        
        attempt = QuizAttempt(
            user_id=attempt_data.user_id,
            quiz_id=attempt_data.quiz_id,
            answers=attempt_data.answers,
            score=score,
            percentage=percentage,
            time_taken_seconds=attempt_data.time_taken_seconds,
            passed=passed
        )
        
        await quiz_attempts_collection.insert_one(attempt.dict())
        
        # Update user points
        await DatabaseManager.update_user_points(attempt_data.user_id, score)
        
        # Check for achievements
        achievements = await DatabaseManager.check_achievements(attempt_data.user_id, score, percentage)
        
        # Format time taken
        minutes = attempt_data.time_taken_seconds // 60
        seconds = attempt_data.time_taken_seconds % 60
        time_taken = f"{minutes}m {seconds}s"
        
        return QuizResult(
            quiz_attempt=attempt,
            correct_answers=correct_answers,
            total_questions=total_questions,
            time_taken=time_taken,
            achievements_unlocked=achievements
        )
    
    @staticmethod
    async def get_user_quiz_attempts(user_id: str) -> List[QuizAttempt]:
        cursor = quiz_attempts_collection.find({"user_id": user_id}).sort("completed_at", -1)
        attempts = []
        async for doc in cursor:
            attempts.append(QuizAttempt(**doc))
        return attempts
    
    # Progress Tracking
    @staticmethod
    async def update_user_progress(user_id: str, course_id: str = None, quiz_id: str = None, 
                                 category: CourseCategory = None, time_spent: int = 0):
        progress_data = {
            "user_id": user_id,
            "last_accessed": datetime.utcnow(),
            "time_spent_minutes": time_spent
        }
        
        if course_id:
            progress_data["course_id"] = course_id
        if quiz_id:
            progress_data["quiz_id"] = quiz_id
        if category:
            progress_data["category"] = category
            
        await progress_collection.update_one(
            {"user_id": user_id, "course_id": course_id, "quiz_id": quiz_id},
            {"$set": progress_data, "$inc": {"time_spent_minutes": time_spent}},
            upsert=True
        )
    
    @staticmethod
    async def get_user_stats(user_id: str) -> UserStats:
        user = await DatabaseManager.get_user(user_id)
        if not user:
            return None
            
        # Get completion stats
        progress_cursor = progress_collection.find({"user_id": user_id})
        total_courses = 0
        total_time_minutes = 0
        category_time = {}
        
        async for progress in progress_cursor:
            if progress.get("course_id"):
                total_courses += 1
            total_time_minutes += progress.get("time_spent_minutes", 0)
            
            category = progress.get("category")
            if category:
                category_time[category] = category_time.get(category, 0) + progress.get("time_spent_minutes", 0)
        
        # Get quiz completions
        quiz_attempts = await DatabaseManager.get_user_quiz_attempts(user_id)
        total_quizzes = len(quiz_attempts)
        
        # Get achievements count
        achievement_count = await user_achievements_collection.count_documents({"user_id": user_id})
        
        # Favorite category
        favorite_category = max(category_time, key=category_time.get) if category_time else None
        
        # Weekly progress (mock data for now)
        weekly_progress = {
            "Monday": 2,
            "Tuesday": 3,
            "Wednesday": 1,
            "Thursday": 4,
            "Friday": 2,
            "Saturday": 1,
            "Sunday": 0
        }
        
        return UserStats(
            user=user,
            total_courses_completed=total_courses,
            total_quizzes_completed=total_quizzes,
            total_time_spent_hours=total_time_minutes / 60,
            current_streak=user.streak_days,
            achievements_count=achievement_count,
            favorite_category=favorite_category,
            weekly_progress=weekly_progress
        )
    
    # Achievement System
    @staticmethod
    async def check_achievements(user_id: str, score: int, percentage: float) -> List[Achievement]:
        achievements_unlocked = []
        
        # Example achievement logic
        if percentage == 100:
            # Perfect Score Achievement
            achievement = Achievement(
                title="Perfect Score!",
                description="Got 100% on a quiz",
                icon="🏆",
                category="Quiz Master",
                points_required=0,
                rarity="Rare"
            )
            achievements_unlocked.append(achievement)
        
        return achievements_unlocked
    
    # Leaderboard
    @staticmethod
    async def get_leaderboard(age_level: AgeLevel, limit: int = 10) -> List[LeaderboardEntry]:
        pipeline = [
            {"$match": {"age_level": age_level}},
            {"$sort": {"total_points": -1}},
            {"$limit": limit}
        ]
        
        leaderboard = []
        rank = 1
        async for user_doc in users_collection.aggregate(pipeline):
            entry = LeaderboardEntry(
                user_id=user_doc["id"],
                user_name=user_doc["name"],
                total_points=user_doc["total_points"],
                rank=rank,
                age_level=user_doc["age_level"],
                avatar=user_doc.get("avatar")
            )
            leaderboard.append(entry)
            rank += 1
            
        return leaderboard
    
    # Age-based content
    @staticmethod
    async def get_age_based_content(age_level: AgeLevel) -> AgeBasedContent:
        courses = await DatabaseManager.get_courses_by_age_level(age_level)
        quizzes = await DatabaseManager.get_quizzes_by_age_level(age_level)
        
        # Get activities (we'll create this collection)
        activities_cursor = activities_collection.find({"age_level": age_level})
        activities = []
        async for doc in activities_cursor:
            activities.append(Activity(**doc))
        
        return AgeBasedContent(
            courses=courses,
            quizzes=quizzes,
            activities=activities,
            recommended_for_age=age_level
        )