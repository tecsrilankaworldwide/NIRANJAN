#!/usr/bin/env python3
"""
Enhanced Content Creation Script for TEC Platform
Adds advanced workouts, achievements, and quiz system
"""
import asyncio
import sys
sys.path.append('/app/backend')

from motor.motor_asyncio import AsyncIOMotorClient
from enhanced_workouts import ENHANCED_WORKOUTS, ACHIEVEMENTS, AchievementType
import uuid
from datetime import datetime

# Database setup
mongo_url = "mongodb://localhost:27017"
client = AsyncIOMotorClient(mongo_url)
db = client["test_database"]

async def add_enhanced_workouts():
    """Add more sophisticated workouts"""
    print("🧩 Adding enhanced workout collection...")
    
    # Get admin user
    admin = await db.users.find_one({"role": "admin"})
    if not admin:
        print("❌ No admin user found. Please run setup_initial_data.py first")
        return
    
    admin_id = admin["id"]
    
    # Add enhanced workouts
    added_count = 0
    for workout_data in ENHANCED_WORKOUTS:
        # Check if workout already exists
        existing = await db.logical_workouts.find_one({"title": workout_data["title"]})
        if not existing:
            workout = {
                "id": str(uuid.uuid4()),
                **workout_data,
                "created_by": admin_id,
                "created_at": datetime.utcnow(),
                "is_active": True
            }
            await db.logical_workouts.insert_one(workout)
            added_count += 1
    
    print(f"✅ Added {added_count} enhanced workouts")

async def create_achievement_system():
    """Set up achievement system"""
    print("🏆 Creating achievement system...")
    
    # Create achievements collection if not exists
    achievement_count = 0
    for ach_type, ach_data in ACHIEVEMENTS.items():
        existing = await db.achievements.find_one({"achievement_type": ach_type.value})
        if not existing:
            achievement = {
                "id": str(uuid.uuid4()),
                "achievement_type": ach_type.value,
                "title": ach_data["title"],
                "description": ach_data["description"],
                "icon": ach_data["icon"],
                "points": ach_data["points"],
                "unlock_condition": ach_data["unlock_condition"],
                "created_at": datetime.utcnow(),
                "is_active": True
            }
            await db.achievements.insert_one(achievement)
            achievement_count += 1
    
    print(f"✅ Created {achievement_count} achievements")

async def add_advanced_courses():
    """Add more comprehensive courses with modules"""
    print("📚 Adding advanced course content...")
    
    admin = await db.users.find_one({"role": "admin"})
    admin_id = admin["id"]
    
    advanced_courses = [
        {
            "title": "Complete AI Literacy Program",
            "description": "Comprehensive AI education program covering fundamentals to advanced applications. Perfect for future-ready learners who want to understand and work with AI systems.",
            "learning_level": "development",
            "skill_areas": ["ai_literacy", "logical_thinking", "future_career_skills"],
            "age_group": "9-12",
            "thumbnail_url": None,
            "is_premium": True,
            "difficulty_level": 4,
            "estimated_hours": 25,
            "modules": [
                {
                    "title": "What is AI?",
                    "description": "Understanding artificial intelligence basics",
                    "estimated_minutes": 45,
                    "topics": ["AI definition", "Types of AI", "AI in daily life", "Future possibilities"]
                },
                {
                    "title": "How AI Learns",
                    "description": "Machine learning concepts made simple",
                    "estimated_minutes": 60,
                    "topics": ["Pattern recognition", "Training data", "Algorithms", "AI decision making"]
                },
                {
                    "title": "AI Ethics & Responsibility", 
                    "description": "Understanding responsible AI use",
                    "estimated_minutes": 50,
                    "topics": ["Bias in AI", "Privacy concerns", "Responsible development", "Future implications"]
                },
                {
                    "title": "Building Simple AI Models",
                    "description": "Hands-on AI creation experience",
                    "estimated_minutes": 90,
                    "topics": ["Simple chatbots", "Image recognition", "Recommendation systems", "AI testing"]
                }
            ],
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_published": True,
            "videos": [],
            "enrollment_count": 23,
            "average_rating": 4.8
        },
        {
            "title": "Creative Problem Solving Mastery",
            "description": "Advanced problem-solving techniques used by innovators and leaders worldwide. Learn design thinking, creative methodologies, and real-world application.",
            "learning_level": "mastery",
            "skill_areas": ["creative_problem_solving", "innovation_methods", "systems_thinking"],
            "age_group": "13-16",
            "thumbnail_url": None,
            "is_premium": True,
            "difficulty_level": 5,
            "estimated_hours": 30,
            "modules": [
                {
                    "title": "Design Thinking Process",
                    "description": "Master the 5-stage design thinking methodology",
                    "estimated_minutes": 75,
                    "topics": ["Empathize", "Define", "Ideate", "Prototype", "Test"]
                },
                {
                    "title": "Innovation Frameworks",
                    "description": "Learn proven innovation methodologies",
                    "estimated_minutes": 80,
                    "topics": ["SCAMPER technique", "Six thinking hats", "Blue ocean strategy", "Disruptive innovation"]
                },
                {
                    "title": "Systems Thinking",
                    "description": "Understanding complex interconnected problems",
                    "estimated_minutes": 85,
                    "topics": ["System components", "Feedback loops", "Leverage points", "Unintended consequences"]
                },
                {
                    "title": "Real-World Projects",
                    "description": "Apply skills to solve actual challenges",
                    "estimated_minutes": 120,
                    "topics": ["Community problems", "Business challenges", "Environmental issues", "Social innovation"]
                }
            ],
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_published": True,
            "videos": [],
            "enrollment_count": 18,
            "average_rating": 4.9
        },
        {
            "title": "Future Career Navigator Pro",
            "description": "Complete career preparation for the jobs of 2030 and beyond. Explore emerging careers, develop future skills, and build a competitive edge.",
            "learning_level": "mastery",
            "skill_areas": ["future_career_skills", "ai_literacy", "innovation_methods"],
            "age_group": "13-16",
            "thumbnail_url": None,
            "is_premium": True,
            "difficulty_level": 5,
            "estimated_hours": 35,
            "modules": [
                {
                    "title": "Jobs of the Future",
                    "description": "Explore emerging career opportunities",
                    "estimated_minutes": 70,
                    "topics": ["AI specialists", "Sustainability experts", "Virtual reality designers", "Data scientists"]
                },
                {
                    "title": "Future Skills Development",
                    "description": "Build skills that can't be automated",
                    "estimated_minutes": 90,
                    "topics": ["Emotional intelligence", "Creative thinking", "Complex problem solving", "Cross-cultural communication"]
                },
                {
                    "title": "Personal Branding",
                    "description": "Create your professional identity",
                    "estimated_minutes": 65,
                    "topics": ["Digital portfolio", "Social media presence", "Networking strategies", "Professional storytelling"]
                },
                {
                    "title": "Entrepreneurship Basics",
                    "description": "Learn to create your own opportunities",
                    "estimated_minutes": 95,
                    "topics": ["Idea validation", "Business models", "Startup basics", "Innovation mindset"]
                }
            ],
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_published": True,
            "videos": [],
            "enrollment_count": 14,
            "average_rating": 4.7
        }
    ]
    
    added_courses = 0
    for course_data in advanced_courses:
        existing = await db.courses.find_one({"title": course_data["title"]})
        if not existing:
            course = {
                "id": str(uuid.uuid4()),
                **course_data
            }
            await db.courses.insert_one(course)
            added_courses += 1
    
    print(f"✅ Added {added_courses} advanced courses")

async def create_quiz_system():
    """Create interactive quiz system"""
    print("❓ Creating interactive quiz system...")
    
    admin = await db.users.find_one({"role": "admin"})
    admin_id = admin["id"]
    
    sample_quizzes = [
        {
            "id": str(uuid.uuid4()),
            "title": "AI Fundamentals Quiz",
            "description": "Test your understanding of basic AI concepts",
            "course_id": None,  # General quiz
            "learning_level": "development",
            "skill_areas": ["ai_literacy"],
            "questions": [
                {
                    "question": "What does AI stand for?",
                    "type": "multiple_choice",
                    "options": ["Artificial Intelligence", "Automated Information", "Advanced Internet", "Algorithmic Integration"],
                    "correct_answer": 0,
                    "explanation": "AI stands for Artificial Intelligence - computer systems that can perform tasks typically requiring human intelligence."
                },
                {
                    "question": "Which of these is an example of AI in daily life?",
                    "type": "multiple_choice", 
                    "options": ["Voice assistants like Siri", "Calculator apps", "Digital cameras", "Text messaging"],
                    "correct_answer": 0,
                    "explanation": "Voice assistants use AI to understand speech and provide intelligent responses."
                },
                {
                    "question": "How do AI systems learn?",
                    "type": "multiple_choice",
                    "options": ["They are pre-programmed with all knowledge", "They learn from data and examples", "They copy human brains exactly", "They download information from the internet"],
                    "correct_answer": 1,
                    "explanation": "AI systems learn by analyzing patterns in large amounts of data and examples."
                }
            ],
            "time_limit_minutes": 10,
            "passing_score": 70,
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Logic & Reasoning Challenge",
            "description": "Challenge your logical thinking abilities",
            "course_id": None,
            "learning_level": "development",
            "skill_areas": ["logical_thinking"],
            "questions": [
                {
                    "question": "If all roses are flowers, and some flowers are red, which statement is definitely true?",
                    "type": "multiple_choice",
                    "options": ["All roses are red", "Some roses are red", "No roses are red", "Some roses might be red"],
                    "correct_answer": 3,
                    "explanation": "We can't determine the color of roses from the given information, so some roses might be red."
                },
                {
                    "question": "Complete the pattern: 2, 6, 18, 54, ?",
                    "type": "multiple_choice",
                    "options": ["108", "162", "216", "324"],
                    "correct_answer": 1,
                    "explanation": "Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162"
                }
            ],
            "time_limit_minutes": 15,
            "passing_score": 80,
            "created_by": admin_id,
            "created_at": datetime.utcnow(),
            "is_active": True
        }
    ]
    
    quiz_count = 0
    for quiz_data in sample_quizzes:
        existing = await db.quizzes.find_one({"title": quiz_data["title"]})
        if not existing:
            await db.quizzes.insert_one(quiz_data)
            quiz_count += 1
    
    print(f"✅ Created {quiz_count} interactive quizzes")

async def main():
    """Main enhancement function"""
    print("🚀 Enhancing TEC Platform with Advanced Learning Features...\n")
    
    try:
        await add_enhanced_workouts()
        await create_achievement_system() 
        await add_advanced_courses()
        await create_quiz_system()
        
        print("\n✨ Platform Enhancement Complete!")
        print("\n🎯 New Features Added:")
        print("   • Enhanced Workouts (6 new challenges)")
        print("   • Achievement System (10 achievements)")
        print("   • Advanced Courses (3 comprehensive programs)")
        print("   • Interactive Quiz System")
        print("   • Advanced Scoring Algorithm")
        print("\n💡 Students now have:")
        print("   • More engaging workout variety")
        print("   • Achievement tracking & rewards")
        print("   • Structured learning modules")
        print("   • Knowledge assessment quizzes")
        
    except Exception as e:
        print(f"❌ Error during enhancement: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())