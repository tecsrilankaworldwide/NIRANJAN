#!/usr/bin/env python3
"""
Initial data setup script for TEC Future-Ready Learning Platform
"""
import asyncio
import os
import sys
sys.path.append('/app/backend')

from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import uuid
from datetime import datetime

# Database setup
mongo_url = "mongodb://localhost:27017"
client = AsyncIOMotorClient(mongo_url)
db = client["test_database"]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin_user():
    """Create an admin user for testing"""
    print("🔧 Creating admin user...")
    
    # Check if admin already exists
    existing_admin = await db.users.find_one({"email": "admin@tecaikids.com"})
    if existing_admin:
        print("✅ Admin user already exists")
        return existing_admin["id"]
    
    # Create admin user
    admin_user = {
        "id": str(uuid.uuid4()),
        "email": "admin@tecaikids.com",
        "full_name": "TEC Admin",
        "role": "admin",
        "age_group": None,
        "created_at": datetime.utcnow(),
        "is_active": True,
        "subscription_type": None,
        "subscription_expires": None,
        "learning_level": None,
        "skill_progress": {},
        "total_watch_time": 0,
        "hashed_password": pwd_context.hash("admin123")
    }
    
    await db.users.insert_one(admin_user)
    print("✅ Admin user created: admin@tecaikids.com / admin123")
    return admin_user["id"]

async def create_sample_student():
    """Create a sample student for testing"""
    print("🎓 Creating sample student...")
    
    # Check if student already exists
    existing_student = await db.users.find_one({"email": "student@tecaikids.com"})
    if existing_student:
        print("✅ Sample student already exists")
        return existing_student["id"]
    
    # Create student user
    student_user = {
        "id": str(uuid.uuid4()),
        "email": "student@tecaikids.com",
        "full_name": "Alex Student",
        "role": "student",
        "age_group": "9-12",
        "created_at": datetime.utcnow(),
        "is_active": True,
        "subscription_type": "monthly",
        "subscription_expires": datetime.utcnow(),
        "learning_level": "development",
        "skill_progress": {
            "ai_literacy": 30,
            "logical_thinking": 45,
            "creative_problem_solving": 25,
            "future_career_skills": 20,
            "systems_thinking": 15,
            "innovation_methods": 10
        },
        "total_watch_time": 120,
        "hashed_password": pwd_context.hash("student123")
    }
    
    await db.users.insert_one(student_user)
    print("✅ Sample student created: student@tecaikids.com / student123")
    
    # Create learning path for student
    learning_path = {
        "id": str(uuid.uuid4()),
        "student_id": student_user["id"],
        "learning_level": "development",
        "skill_progress": {
            "ai_literacy": 30,
            "logical_thinking": 45,
            "creative_problem_solving": 25,
            "future_career_skills": 20,
            "systems_thinking": 15,
            "innovation_methods": 10
        },
        "completed_courses": [],
        "current_focus_areas": ["logical_thinking", "ai_literacy"],
        "total_learning_time": 120,
        "level_completion_percentage": 28.5,
        "next_recommended_courses": [],
        "last_updated": datetime.utcnow()
    }
    
    await db.learning_paths.insert_one(learning_path)
    print("✅ Learning path created for sample student")
    
    return student_user["id"]

async def create_sample_workouts(admin_id):
    """Create sample logical thinking workouts"""
    print("🧩 Creating sample workouts...")
    
    # Check if workouts already exist
    existing_count = await db.logical_workouts.count_documents({})
    if existing_count > 0:
        print(f"✅ {existing_count} workouts already exist")
        return
    
    sample_workouts = [
        {
            "id": str(uuid.uuid4()),
            "title": "Pattern Detective",
            "description": "Find the hidden pattern in this sequence and predict what comes next!",
            "workout_type": "pattern_recognition",
            "difficulty": "beginner",
            "learning_level": "foundation",
            "age_group": "5-8",
            "estimated_time_minutes": 5,
            "exercise_data": {
                "sequence": [1, 3, 5, 7, "?"],
                "type": "number_sequence",
                "instructions": "Look at the numbers and find the pattern. What number should replace the question mark?"
            },
            "solution": {"answer": 9, "explanation": "The pattern is adding 2 each time: 1+2=3, 3+2=5, 5+2=7, 7+2=9"},
            "hints": ["Look at the difference between consecutive numbers", "Try adding the same number each time"],
            "skill_areas": ["logical_thinking"],
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Logic Grid Challenge",
            "description": "Use logical reasoning to solve this puzzle about three friends and their favorite activities.",
            "workout_type": "reasoning_chains",
            "difficulty": "intermediate", 
            "learning_level": "development",
            "age_group": "9-12",
            "estimated_time_minutes": 10,
            "exercise_data": {
                "clues": [
                    "Anna likes reading more than swimming but less than coding",
                    "Ben's favorite activity is not reading",
                    "The person who likes coding most also likes swimming least",
                    "Chris likes swimming more than Anna does"
                ],
                "people": ["Anna", "Ben", "Chris"],
                "activities": ["reading", "swimming", "coding"],
                "instructions": "Rank each person's preference for each activity from 1 (least favorite) to 3 (most favorite)"
            },
            "solution": {
                "Anna": {"reading": 2, "swimming": 1, "coding": 3},
                "Ben": {"reading": 1, "swimming": 3, "coding": 2}, 
                "Chris": {"reading": 3, "swimming": 2, "coding": 1}
            },
            "hints": ["Start with the clearest clues first", "Use process of elimination", "Draw a grid to track possibilities"],
            "skill_areas": ["logical_thinking", "creative_problem_solving"],
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Shape Puzzle Master",
            "description": "Arrange geometric shapes to create the target pattern using spatial reasoning.",
            "workout_type": "puzzle_solving",
            "difficulty": "advanced",
            "learning_level": "mastery", 
            "age_group": "13-16",
            "estimated_time_minutes": 15,
            "exercise_data": {
                "available_shapes": ["triangle", "square", "circle", "rectangle"],
                "target_pattern": "house_with_garden",
                "rules": ["Each shape can only be used once", "Shapes must touch at least one other shape", "Final pattern must be symmetrical"],
                "instructions": "Create a house with a garden using all available shapes following the given rules"
            },
            "solution": {
                "arrangement": {
                    "house_roof": "triangle",
                    "house_body": "square", 
                    "door": "rectangle",
                    "garden": "circle"
                },
                "explanation": "Triangle forms the roof, square is the house body, rectangle is the door, and circle represents the garden"
            },
            "hints": ["Think about what each shape could represent", "Start with the most obvious placements", "Consider symmetry requirements"],
            "skill_areas": ["logical_thinking", "creative_problem_solving", "systems_thinking"],
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Future Problem Solver",
            "description": "Break down a complex future scenario into manageable parts and develop solutions.",
            "workout_type": "problem_decomposition",
            "difficulty": "expert",
            "learning_level": "mastery",
            "age_group": "13-16", 
            "estimated_time_minutes": 20,
            "exercise_data": {
                "scenario": "By 2030, your city needs to reduce traffic by 50% while increasing economic activity. Design a solution.",
                "constraints": ["Limited budget", "Current infrastructure", "Environmental concerns", "Public acceptance"],
                "steps_required": 5,
                "instructions": "Break this problem into smaller parts and propose a step-by-step solution addressing each constraint"
            },
            "solution": {
                "steps": [
                    "Analyze current traffic patterns and economic drivers",
                    "Develop remote work incentives for businesses", 
                    "Create efficient public transportation network",
                    "Implement smart traffic management systems",
                    "Launch community engagement and education programs"
                ],
                "reasoning": "Each step addresses multiple constraints while building toward the 50% reduction goal"
            },
            "hints": ["Break the problem into smaller, manageable pieces", "Consider what causes traffic in the first place", "Think about solutions that address multiple constraints"],
            "skill_areas": ["logical_thinking", "systems_thinking", "future_career_skills", "creative_problem_solving"],
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_active": True
        }
    ]
    
    for workout in sample_workouts:
        await db.logical_workouts.insert_one(workout)
    
    print(f"✅ Created {len(sample_workouts)} sample workouts")

async def create_sample_courses(admin_id):
    """Create sample courses"""
    print("📚 Creating sample courses...")
    
    # Check if courses already exist
    existing_count = await db.courses.count_documents({})
    if existing_count > 0:
        print(f"✅ {existing_count} courses already exist")
        return
    
    sample_courses = [
        {
            "id": str(uuid.uuid4()),
            "title": "AI Fundamentals for Young Minds",
            "description": "Understanding artificial intelligence through fun activities and real-world examples. Perfect introduction to AI concepts for foundation level learners.",
            "learning_level": "foundation",
            "skill_areas": ["ai_literacy", "logical_thinking"],
            "age_group": "5-8",
            "thumbnail_url": None,
            "is_premium": False,
            "difficulty_level": 1,
            "estimated_hours": 8,
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_published": True,
            "videos": [],
            "enrollment_count": 15,
            "average_rating": 4.7
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Creative Logic Adventures",
            "description": "Building logical thinking through creative challenges and interactive problem-solving. Designed for development level students.",
            "learning_level": "development",
            "skill_areas": ["logical_thinking", "creative_problem_solving"],
            "age_group": "9-12",
            "thumbnail_url": None,
            "is_premium": True,
            "difficulty_level": 3,
            "estimated_hours": 12,
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_published": True,
            "videos": [],
            "enrollment_count": 28,
            "average_rating": 4.9
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Future Career Navigator",
            "description": "Exploring tomorrow's job market and developing essential future workplace skills. Advanced course for mastery level students.",
            "learning_level": "mastery",
            "skill_areas": ["future_career_skills", "systems_thinking"],
            "age_group": "13-16",
            "thumbnail_url": None,
            "is_premium": True,
            "difficulty_level": 5,
            "estimated_hours": 20,
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_published": True,
            "videos": [],
            "enrollment_count": 12,
            "average_rating": 4.8
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Innovation Design Thinking",
            "description": "Master the design thinking process and innovation methodologies used by global leaders. Hands-on approach to creative problem solving.",
            "learning_level": "mastery",
            "skill_areas": ["creative_problem_solving", "innovation_methods"],
            "age_group": "13-16",
            "thumbnail_url": None,
            "is_premium": True,
            "difficulty_level": 4,
            "estimated_hours": 16,
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_published": True,
            "videos": [],
            "enrollment_count": 8,
            "average_rating": 4.6
        }
    ]
    
    for course in sample_courses:
        await db.courses.insert_one(course)
    
    print(f"✅ Created {len(sample_courses)} sample courses")

async def main():
    """Main setup function"""
    print("🚀 Setting up TEC Future-Ready Learning Platform initial data...\n")
    
    try:
        # Create users
        admin_id = await create_admin_user()
        student_id = await create_sample_student()
        
        # Create sample content
        await create_sample_workouts(admin_id)
        await create_sample_courses(admin_id)
        
        print("\n✅ Initial data setup complete!")
        print("\n📋 Test Accounts:")
        print("   👨‍💼 Admin: admin@tecaikids.com / admin123")
        print("   🎓 Student: student@tecaikids.com / student123")
        print("\n🎯 Platform Features Available:")
        print("   • User Authentication & Role Management")
        print("   • Learning Path Tracking")
        print("   • Logical Thinking Workouts")
        print("   • Course Catalog")
        print("   • Subscription Management")
        print("   • Analytics Dashboard")
        
    except Exception as e:
        print(f"❌ Error during setup: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())