#!/usr/bin/env python3
import asyncio
import sys
sys.path.append('/app/backend')
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
import uuid

async def create_sample_data():
    # Connect to MongoDB
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["test_database"]
    
    # Create sample courses
    courses = [
        {
            "id": str(uuid.uuid4()),
            "title": "AI Magic for Little Explorers",
            "description": "Discover the wonderful world of AI through fun games and activities! Learn how computers can think, recognize pictures, and help us in amazing ways. Perfect for curious young minds ready to explore the future!",
            "learning_level": "foundation",
            "skill_areas": ["ai_literacy", "creative_problem_solving"],
            "age_group": "5-8",
            "thumbnail_url": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400",
            "is_premium": False,
            "difficulty_level": 1,
            "estimated_hours": 3,
            "created_by": "sample-teacher-id",
            "created_at": datetime.utcnow(),
            "is_published": True,
            "videos": [
                {"id": str(uuid.uuid4()), "title": "What is AI?", "duration": 300},
                {"id": str(uuid.uuid4()), "title": "AI in Daily Life", "duration": 420},
                {"id": str(uuid.uuid4()), "title": "Fun AI Activities", "duration": 360}
            ],
            "enrollment_count": 15,
            "average_rating": 4.8
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Logic Puzzles & Future Thinking", 
            "description": "Master logical reasoning through exciting puzzles and challenges! Build systematic thinking skills, learn pattern recognition, and develop problem-solving strategies that prepare you for advanced AI concepts.",
            "learning_level": "development",
            "skill_areas": ["logical_thinking", "systems_thinking", "creative_problem_solving"],
            "age_group": "9-12",
            "thumbnail_url": "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400",
            "is_premium": True,
            "difficulty_level": 3,
            "estimated_hours": 5,
            "created_by": "sample-teacher-id",
            "created_at": datetime.utcnow(),
            "is_published": True,
            "videos": [
                {"id": str(uuid.uuid4()), "title": "Introduction to Logic", "duration": 480},
                {"id": str(uuid.uuid4()), "title": "Pattern Recognition", "duration": 520},
                {"id": str(uuid.uuid4()), "title": "System Thinking Basics", "duration": 600},
                {"id": str(uuid.uuid4()), "title": "Advanced Problem Solving", "duration": 720}
            ],
            "enrollment_count": 8,
            "average_rating": 4.9
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Innovation Lab: AI & Future Careers",
            "description": "Dive deep into advanced AI concepts and future career preparation! Learn innovation methodologies, explore emerging technologies, and develop leadership skills for the digital age. Perfect for teens ready to shape the future!",
            "learning_level": "mastery",
            "skill_areas": ["ai_literacy", "innovation_methods", "future_career_skills", "systems_thinking"],
            "age_group": "13-16",
            "thumbnail_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
            "is_premium": True,
            "difficulty_level": 5,
            "estimated_hours": 8,
            "created_by": "sample-teacher-id", 
            "created_at": datetime.utcnow(),
            "is_published": True,
            "videos": [
                {"id": str(uuid.uuid4()), "title": "AI in Industry", "duration": 900},
                {"id": str(uuid.uuid4()), "title": "Innovation Frameworks", "duration": 1080},
                {"id": str(uuid.uuid4()), "title": "Future Career Paths", "duration": 960},
                {"id": str(uuid.uuid4()), "title": "Leadership in Tech", "duration": 840},
                {"id": str(uuid.uuid4()), "title": "Building Your Portfolio", "duration": 720}
            ],
            "enrollment_count": 12,
            "average_rating": 4.7
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Creative Coding Adventures",
            "description": "Learn basic programming through creative projects and games! Build animations, interactive stories, and simple apps while developing computational thinking skills. No prior coding experience needed!",
            "learning_level": "development",
            "skill_areas": ["logical_thinking", "creative_problem_solving", "innovation_methods"],
            "age_group": "9-12",
            "thumbnail_url": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
            "is_premium": False,
            "difficulty_level": 2,
            "estimated_hours": 4,
            "created_by": "sample-teacher-id",
            "created_at": datetime.utcnow(),
            "is_published": True,
            "videos": [
                {"id": str(uuid.uuid4()), "title": "Introduction to Coding", "duration": 360},
                {"id": str(uuid.uuid4()), "title": "Creating Animations", "duration": 420},
                {"id": str(uuid.uuid4()), "title": "Interactive Stories", "duration": 480}
            ],
            "enrollment_count": 22,
            "average_rating": 4.6
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Little Inventors Workshop",
            "description": "Spark creativity and problem-solving skills through hands-on invention activities! Design simple solutions, build prototypes with everyday materials, and learn the basics of innovative thinking. Perfect for budding inventors!",
            "learning_level": "foundation",
            "skill_areas": ["creative_problem_solving", "innovation_methods"],
            "age_group": "5-8",
            "thumbnail_url": "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400",
            "is_premium": True,
            "difficulty_level": 2,
            "estimated_hours": 2,
            "created_by": "sample-teacher-id",
            "created_at": datetime.utcnow(),
            "is_published": True,
            "videos": [
                {"id": str(uuid.uuid4()), "title": "What is an Inventor?", "duration": 240},
                {"id": str(uuid.uuid4()), "title": "Simple Machines", "duration": 300},
                {"id": str(uuid.uuid4()), "title": "Building Prototypes", "duration": 360}
            ],
            "enrollment_count": 18,
            "average_rating": 4.9
        }
    ]
    
    # Clear existing courses and insert new ones
    await db.courses.delete_many({})
    await db.courses.insert_many(courses)
    
    print(f"✅ Created {len(courses)} sample courses!")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    asyncio.run(create_sample_data())