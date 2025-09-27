#!/usr/bin/env python3
import asyncio
import sys
sys.path.append('/app/backend')
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timedelta
import uuid
import random

async def create_realistic_data():
    # Connect to MongoDB
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["test_database"]
    
    # Create realistic student users
    students = [
        {
            "id": str(uuid.uuid4()),
            "email": "amal.perera@gmail.com",
            "full_name": "Amal Perera",
            "role": "student",
            "age_group": "9-12",
            "learning_level": "development",
            "created_at": datetime.utcnow() - timedelta(days=15),
            "subscription_type": "quarterly",
            "subscription_expires": datetime.utcnow() + timedelta(days=75),
            "total_watch_time": 450
        },
        {
            "id": str(uuid.uuid4()),
            "email": "sasha.fernando@yahoo.com", 
            "full_name": "Sasha Fernando",
            "role": "student",
            "age_group": "5-8",
            "learning_level": "foundation",
            "created_at": datetime.utcnow() - timedelta(days=8),
            "subscription_type": "monthly",
            "subscription_expires": datetime.utcnow() + timedelta(days=22),
            "total_watch_time": 180
        },
        {
            "id": str(uuid.uuid4()),
            "email": "kavinda.silva@hotmail.com",
            "full_name": "Kavinda Silva", 
            "role": "student",
            "age_group": "13-16",
            "learning_level": "mastery",
            "created_at": datetime.utcnow() - timedelta(days=22),
            "subscription_type": "quarterly",
            "subscription_expires": datetime.utcnow() + timedelta(days=68),
            "total_watch_time": 720
        },
        {
            "id": str(uuid.uuid4()),
            "email": "nimali.jayawardana@gmail.com",
            "full_name": "Nimali Jayawardana",
            "role": "student", 
            "age_group": "9-12",
            "learning_level": "development",
            "created_at": datetime.utcnow() - timedelta(days=5),
            "subscription_type": None,
            "subscription_expires": None,
            "total_watch_time": 85
        },
        {
            "id": str(uuid.uuid4()),
            "email": "roshan.wijesinghe@outlook.com",
            "full_name": "Roshan Wijesinghe",
            "role": "student",
            "age_group": "13-16", 
            "learning_level": "mastery",
            "created_at": datetime.utcnow() - timedelta(days=30),
            "subscription_type": "quarterly",
            "subscription_expires": datetime.utcnow() + timedelta(days=60),
            "total_watch_time": 960
        },
        {
            "id": str(uuid.uuid4()),
            "email": "thilini.rathnayake@gmail.com",
            "full_name": "Thilini Rathnayake",
            "role": "student",
            "age_group": "5-8",
            "learning_level": "foundation", 
            "created_at": datetime.utcnow() - timedelta(days=12),
            "subscription_type": "monthly",
            "subscription_expires": datetime.utcnow() + timedelta(days=18),
            "total_watch_time": 220
        }
    ]
    
    # Create learning paths with realistic progress
    learning_paths = []
    for student in students:
        if student["learning_level"] == "foundation":
            progress = {
                "ai_literacy": random.randint(20, 85),
                "logical_thinking": random.randint(15, 70),  
                "creative_problem_solving": random.randint(25, 90),
                "future_career_skills": random.randint(10, 60)
            }
        elif student["learning_level"] == "development":
            progress = {
                "ai_literacy": random.randint(30, 95),
                "logical_thinking": random.randint(40, 90),
                "creative_problem_solving": random.randint(35, 85),
                "systems_thinking": random.randint(20, 75),
                "innovation_methods": random.randint(25, 80)
            }
        else:  # mastery
            progress = {
                "ai_literacy": random.randint(60, 100),
                "logical_thinking": random.randint(70, 95),
                "creative_problem_solving": random.randint(65, 100),
                "future_career_skills": random.randint(50, 95),
                "systems_thinking": random.randint(55, 90),
                "innovation_methods": random.randint(60, 95)
            }
        
        learning_paths.append({
            "id": str(uuid.uuid4()),
            "student_id": student["id"],
            "learning_level": student["learning_level"],
            "skill_progress": progress,
            "total_learning_time": student["total_watch_time"],
            "level_completion_percentage": sum(progress.values()) / len(progress),
            "completed_courses": random.randint(0, 3),
            "last_updated": datetime.utcnow() - timedelta(days=random.randint(1, 7))
        })
    
    # Create sample enrollments
    enrollments = []
    course_ids = [
        "ai-magic-foundation",
        "logic-puzzles-development", 
        "innovation-lab-mastery",
        "creative-coding-development",
        "inventors-workshop-foundation"
    ]
    
    for student in students:
        num_enrollments = random.randint(1, 3)
        student_courses = random.sample(course_ids, min(num_enrollments, len(course_ids)))
        
        for course_id in student_courses:
            enrollments.append({
                "id": str(uuid.uuid4()),
                "student_id": student["id"],
                "course_id": course_id,
                "enrolled_at": datetime.utcnow() - timedelta(days=random.randint(1, 25)),
                "progress": random.randint(10, 100),
                "completed": random.choice([True, False]),
                "last_accessed": datetime.utcnow() - timedelta(days=random.randint(0, 7))
            })
    
    # Create activity logs
    activities = []
    activity_types = [
        "login", "course_enrollment", "video_watched", "video_completed", 
        "course_started", "course_completed", "skill_progression", "learning_path_updated"
    ]
    
    for student in students:
        num_activities = random.randint(5, 15)
        for _ in range(num_activities):
            activities.append({
                "id": str(uuid.uuid4()),
                "user_id": student["id"],
                "activity_type": random.choice(activity_types),
                "timestamp": datetime.utcnow() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23)),
                "metadata": {"course_id": random.choice(course_ids)} if "course" in random.choice(activity_types) else {}
            })
    
    # Insert all data
    await db.students_sample.insert_many(students)
    await db.learning_paths.insert_many(learning_paths)
    await db.enrollments.insert_many(enrollments) 
    await db.activities.insert_many(activities)
    
    print(f"✅ Created realistic data:")
    print(f"   📚 {len(students)} students")
    print(f"   🛤️ {len(learning_paths)} learning paths")
    print(f"   📝 {len(enrollments)} enrollments")
    print(f"   📊 {len(activities)} activity records")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    asyncio.run(create_realistic_data())