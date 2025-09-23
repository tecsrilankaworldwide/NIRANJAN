from motor.motor_asyncio import AsyncIOMotorClient
from teen_models import *
import os
from typing import List, Optional
from datetime import datetime, timedelta
import asyncio

# Use existing MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Teen Collections
teen_users_collection = db.teen_users
teen_courses_collection = db.teen_courses
teen_projects_collection = db.teen_projects
coding_challenges_collection = db.coding_challenges
coding_submissions_collection = db.coding_submissions
teen_certifications_collection = db.teen_certifications
teen_cert_earned_collection = db.teen_certifications_earned
mentors_collection = db.mentors
mentorship_sessions_collection = db.mentorship_sessions
career_paths_collection = db.career_paths
teen_portfolios_collection = db.teen_portfolios
competitions_collection = db.competitions
competition_participation_collection = db.competition_participation
teen_progress_collection = db.teen_progress

class TeenDatabaseManager:
    
    # Teen User Operations
    @staticmethod
    async def create_teen_user(user_data: TeenUserCreate) -> TeenUser:
        # Determine age level based on age
        if user_data.age <= 14:
            age_level = TeenAgeLevel.MIDDLE_TEEN
        else:
            age_level = TeenAgeLevel.HIGH_TEEN
            
        user = TeenUser(
            name=user_data.name,
            age=user_data.age,
            age_level=age_level,
            parent_email=user_data.parent_email,
            student_email=user_data.student_email,
            school=user_data.school,
            grade=user_data.grade,
            interests=user_data.interests,
            career_goals=user_data.career_goals
        )
        
        await teen_users_collection.insert_one(user.dict())
        return user
    
    @staticmethod
    async def get_teen_user(user_id: str) -> Optional[TeenUser]:
        user_doc = await teen_users_collection.find_one({"id": user_id})
        return TeenUser(**user_doc) if user_doc else None
    
    @staticmethod
    async def get_teen_users_by_age_level(age_level: TeenAgeLevel) -> List[TeenUser]:
        cursor = teen_users_collection.find({"age_level": age_level})
        users = []
        async for doc in cursor:
            users.append(TeenUser(**doc))
        return users
    
    # Teen Course Operations
    @staticmethod
    async def create_teen_course(course_data: TeenCourseCreate) -> TeenCourse:
        course = TeenCourse(**course_data.dict())
        await teen_courses_collection.insert_one(course.dict())
        return course
    
    @staticmethod
    async def get_teen_courses_by_age_level(age_level: TeenAgeLevel) -> List[TeenCourse]:
        cursor = teen_courses_collection.find({"age_level": age_level})
        courses = []
        async for doc in cursor:
            courses.append(TeenCourse(**doc))
        return courses
    
    @staticmethod
    async def get_teen_courses_by_category(category: TeenCourseCategory, age_level: TeenAgeLevel = None) -> List[TeenCourse]:
        query = {"category": category}
        if age_level:
            query["age_level"] = age_level
            
        cursor = teen_courses_collection.find(query)
        courses = []
        async for doc in cursor:
            courses.append(TeenCourse(**doc))
        return courses
    
    @staticmethod
    async def get_all_teen_courses() -> List[TeenCourse]:
        cursor = teen_courses_collection.find({})
        courses = []
        async for doc in cursor:
            courses.append(TeenCourse(**doc))
        return courses
    
    # Project Operations
    @staticmethod
    async def create_teen_project(project_data: dict) -> TeenProject:
        project = TeenProject(**project_data)
        await teen_projects_collection.insert_one(project.dict())
        return project
    
    @staticmethod
    async def get_student_projects(student_id: str) -> List[TeenProject]:
        cursor = teen_projects_collection.find({"student_id": student_id})
        projects = []
        async for doc in cursor:
            projects.append(TeenProject(**doc))
        return projects
    
    @staticmethod
    async def update_project_status(project_id: str, status: str, score: int = None, feedback: str = None):
        update_data = {"status": status}
        if score is not None:
            update_data["score"] = score
        if feedback:
            update_data["mentor_feedback"] = feedback
        if status == "Completed":
            update_data["completed_at"] = datetime.utcnow()
            
        await teen_projects_collection.update_one(
            {"id": project_id},
            {"$set": update_data}
        )
    
    # Coding Challenge Operations
    @staticmethod
    async def create_coding_challenge(challenge_data: dict) -> CodingChallenge:
        challenge = CodingChallenge(**challenge_data)
        await coding_challenges_collection.insert_one(challenge.dict())
        return challenge
    
    @staticmethod
    async def get_coding_challenges_by_difficulty(difficulty: TeenDifficultyLevel) -> List[CodingChallenge]:
        cursor = coding_challenges_collection.find({"difficulty": difficulty})
        challenges = []
        async for doc in cursor:
            challenges.append(CodingChallenge(**doc))
        return challenges
    
    @staticmethod
    async def submit_coding_solution(submission_data: dict) -> CodingSubmission:
        submission = CodingSubmission(**submission_data)
        await coding_submissions_collection.insert_one(submission.dict())
        
        # Update student points if solution is accepted
        if submission.status == "Accepted":
            await teen_users_collection.update_one(
                {"id": submission.student_id},
                {"$inc": {"total_points": submission.score}}
            )
        
        return submission
    
    # Certification Operations
    @staticmethod
    async def issue_certification(student_id: str, certification_id: str, course_id: str = None, 
                                final_score: float = 0, projects: List[str] = [], skills: List[str] = []) -> TeenCertificationEarned:
        
        verification_code = f"TEC-{datetime.now().year}-{str(uuid.uuid4())[:8].upper()}"
        verification_url = f"https://verify.tecaikids.com/{verification_code}"
        
        earned_cert = TeenCertificationEarned(
            student_id=student_id,
            certification_id=certification_id,
            course_id=course_id,
            final_score=final_score,
            projects_completed=projects,
            skills_demonstrated=skills,
            verification_url=verification_url
        )
        
        await teen_cert_earned_collection.insert_one(earned_cert.dict())
        
        # Update user certification count
        await teen_users_collection.update_one(
            {"id": student_id},
            {"$inc": {"certifications_earned": 1}}
        )
        
        return earned_cert
    
    # Mentorship Operations
    @staticmethod
    async def create_mentor(mentor_data: dict) -> Mentor:
        mentor = Mentor(**mentor_data)
        await mentors_collection.insert_one(mentor.dict())
        return mentor
    
    @staticmethod
    async def schedule_mentorship_session(session_data: dict) -> MentorshipSession:
        session = MentorshipSession(**session_data)
        await mentorship_sessions_collection.insert_one(session.dict())
        return session
    
    @staticmethod
    async def get_student_mentorship_sessions(student_id: str) -> List[MentorshipSession]:
        cursor = mentorship_sessions_collection.find({"student_id": student_id})
        sessions = []
        async for doc in cursor:
            sessions.append(MentorshipSession(**doc))
        return sessions
    
    # Portfolio Operations
    @staticmethod
    async def create_teen_portfolio(portfolio_data: dict) -> TeenPortfolio:
        portfolio = TeenPortfolio(**portfolio_data)
        await teen_portfolios_collection.insert_one(portfolio.dict())
        return portfolio
    
    @staticmethod
    async def get_student_portfolio(student_id: str) -> Optional[TeenPortfolio]:
        portfolio_doc = await teen_portfolios_collection.find_one({"student_id": student_id})
        return TeenPortfolio(**portfolio_doc) if portfolio_doc else None
    
    @staticmethod
    async def update_portfolio(student_id: str, update_data: dict):
        update_data["last_updated"] = datetime.utcnow()
        await teen_portfolios_collection.update_one(
            {"student_id": student_id},
            {"$set": update_data}
        )
    
    # Competition Operations
    @staticmethod
    async def create_competition(competition_data: dict) -> Competition:
        competition = Competition(**competition_data)
        await competitions_collection.insert_one(competition.dict())
        return competition
    
    @staticmethod
    async def register_for_competition(participation_data: dict) -> CompetitionParticipation:
        participation = CompetitionParticipation(**participation_data)
        await competition_participation_collection.insert_one(participation.dict())
        
        # Update competition participant count
        await competitions_collection.update_one(
            {"id": participation_data["competition_id"]},
            {"$inc": {"current_participants": len(participation_data["team_members"])}}
        )
        
        return participation
    
    # Dashboard Data
    @staticmethod
    async def get_teen_dashboard_data(student_id: str) -> TeenDashboardData:
        user = await TeenDatabaseManager.get_teen_user(student_id)
        if not user:
            return None
            
        # Get enrolled courses (mock for now)
        enrolled_courses = await TeenDatabaseManager.get_teen_courses_by_age_level(user.age_level)
        enrolled_courses = enrolled_courses[:3]  # Top 3
        
        # Get recent projects
        recent_projects = await TeenDatabaseManager.get_student_projects(student_id)
        recent_projects = recent_projects[:5]  # Last 5
        
        # Get upcoming mentorship sessions
        upcoming_sessions = await TeenDatabaseManager.get_student_mentorship_sessions(student_id)
        upcoming_sessions = [s for s in upcoming_sessions if s.scheduled_date > datetime.utcnow()]
        upcoming_sessions = upcoming_sessions[:3]  # Next 3
        
        # Coding challenge stats
        coding_stats = {
            "solved": 15,
            "attempted": 23,
            "success_rate": 65,
            "ranking": 42
        }
        
        # Career progress
        career_progress = {
            "current_path": "Full-Stack Developer",
            "progress_percentage": 45,
            "skills_acquired": 8,
            "skills_remaining": 12,
            "estimated_completion": "6 months"
        }
        
        # Get certifications
        certifications_cursor = teen_cert_earned_collection.find({"student_id": student_id})
        certifications = []
        async for doc in certifications_cursor:
            certifications.append(TeenCertificationEarned(**doc))
        
        # Portfolio stats
        portfolio = await TeenDatabaseManager.get_student_portfolio(student_id)
        portfolio_stats = {
            "projects": len(portfolio.projects) if portfolio else 0,
            "views": portfolio.views if portfolio else 0,
            "skills": len(portfolio.skills) if portfolio else 0,
            "certifications": len(certifications)
        }
        
        return TeenDashboardData(
            user=user,
            enrolled_courses=enrolled_courses,
            recent_projects=recent_projects,
            upcoming_sessions=upcoming_sessions,
            coding_challenge_stats=coding_stats,
            career_progress=career_progress,
            certifications=certifications,
            portfolio_stats=portfolio_stats
        )
    
    # Analytics and Statistics
    @staticmethod
    async def get_teen_platform_stats() -> TeenStats:
        total_students = await teen_users_collection.count_documents({})
        active_courses = await teen_courses_collection.count_documents({})
        projects_completed = await teen_projects_collection.count_documents({"status": "Completed"})
        certifications_issued = await teen_cert_earned_collection.count_documents({})
        
        return TeenStats(
            total_students=total_students,
            active_courses=active_courses,
            projects_completed=projects_completed,
            certifications_issued=certifications_issued,
            average_completion_rate=78.5,
            top_performers=[
                {"name": "Sarah Chen", "points": 2850, "projects": 12},
                {"name": "Arjun Patel", "points": 2720, "projects": 11},
                {"name": "Maya Fernando", "points": 2690, "projects": 10}
            ],
            career_placements=45
        )