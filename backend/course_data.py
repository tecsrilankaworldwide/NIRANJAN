from models import *
from database import DatabaseManager
import asyncio

# Sample course data for different age levels and categories

SAMPLE_COURSES = {
    AgeLevel.PRESCHOOL: [
        {
            "title": "Number Friends (1-10)",
            "description": "Meet the number friends and learn to count from 1 to 10 with fun songs and games!",
            "category": CourseCategory.MATH,
            "age_level": AgeLevel.PRESCHOOL,
            "difficulty": DifficultyLevel.EASY,
            "duration_minutes": 15,
            "total_lessons": 10,
            "instructor": "Ms. Sarah",
            "image_emoji": "🔢",
            "color_gradient": "from-blue-400 to-blue-600",
            "skills": ["Counting", "Number Recognition", "Basic Math"],
            "is_premium": False
        },
        {
            "title": "Colors & Shapes Adventure",
            "description": "Explore the world of colors and shapes through interactive stories and activities!",
            "category": CourseCategory.ART,
            "age_level": AgeLevel.PRESCHOOL,
            "difficulty": DifficultyLevel.EASY,
            "duration_minutes": 12,
            "total_lessons": 8,
            "instructor": "Mr. Rainbow",
            "image_emoji": "🎨",
            "color_gradient": "from-pink-400 to-purple-600",
            "skills": ["Color Recognition", "Shape Identification", "Creativity"],
            "is_premium": False
        },
        {
            "title": "Animal Kingdom Safari",
            "description": "Go on a safari adventure to meet animals and learn about their homes!",
            "category": CourseCategory.SCIENCE,
            "age_level": AgeLevel.PRESCHOOL,
            "difficulty": DifficultyLevel.EASY,
            "duration_minutes": 18,
            "total_lessons": 12,
            "instructor": "Dr. Zoey",
            "image_emoji": "🦁",
            "color_gradient": "from-green-400 to-teal-600",
            "skills": ["Animal Recognition", "Habitats", "Nature Awareness"],
            "is_premium": False
        },
        {
            "title": "ABC Phonics Fun",
            "description": "Learn letters and their sounds with catchy songs and phonics games!",
            "category": CourseCategory.ENGLISH,
            "age_level": AgeLevel.PRESCHOOL,
            "difficulty": DifficultyLevel.EASY,
            "duration_minutes": 20,
            "total_lessons": 26,
            "instructor": "Miss Alphabet",
            "image_emoji": "🔤",
            "color_gradient": "from-orange-400 to-red-600",
            "skills": ["Letter Recognition", "Phonics", "Pre-reading"],
            "is_premium": True
        }
    ],
    AgeLevel.ELEMENTARY: [
        {
            "title": "Addition & Subtraction Heroes",
            "description": "Become a math hero by mastering addition and subtraction with exciting quests!",
            "category": CourseCategory.MATH,
            "age_level": AgeLevel.ELEMENTARY,
            "difficulty": DifficultyLevel.MEDIUM,
            "duration_minutes": 25,
            "total_lessons": 15,
            "instructor": "Captain Calculator",
            "image_emoji": "🦸‍♂️",
            "color_gradient": "from-blue-500 to-purple-600",
            "skills": ["Addition", "Subtraction", "Word Problems", "Mental Math"],
            "is_premium": False
        },
        {
            "title": "Space Explorers",
            "description": "Journey through the solar system and discover amazing facts about planets and stars!",
            "category": CourseCategory.SCIENCE,
            "age_level": AgeLevel.ELEMENTARY,
            "difficulty": DifficultyLevel.MEDIUM,
            "duration_minutes": 30,
            "total_lessons": 18,
            "instructor": "Astronaut Alex",
            "image_emoji": "🚀",
            "color_gradient": "from-purple-500 to-indigo-600",
            "skills": ["Astronomy", "Solar System", "Space Science", "Observation"],
            "is_premium": False
        },
        {
            "title": "Reading Adventures",
            "description": "Improve reading skills with exciting stories, comprehension games, and vocabulary building!",
            "category": CourseCategory.ENGLISH,
            "age_level": AgeLevel.ELEMENTARY,
            "difficulty": DifficultyLevel.MEDIUM,
            "duration_minutes": 28,
            "total_lessons": 20,
            "instructor": "Professor Bookworm",
            "image_emoji": "📚",
            "color_gradient": "from-green-500 to-blue-600",
            "skills": ["Reading Comprehension", "Vocabulary", "Fluency", "Critical Thinking"],
            "is_premium": True
        },
        {
            "title": "Digital Art Studio",
            "description": "Create amazing digital artwork while learning about colors, composition, and design!",
            "category": CourseCategory.ART,
            "age_level": AgeLevel.ELEMENTARY,
            "difficulty": DifficultyLevel.MEDIUM,
            "duration_minutes": 35,
            "total_lessons": 16,
            "instructor": "Artist Pixel",
            "image_emoji": "🖥️",
            "color_gradient": "from-pink-500 to-orange-600",
            "skills": ["Digital Design", "Color Theory", "Composition", "Creativity"],
            "is_premium": True
        },
        {
            "title": "Music Makers",
            "description": "Learn about rhythm, melody, and create your own musical compositions!",
            "category": CourseCategory.MUSIC,
            "age_level": AgeLevel.ELEMENTARY,
            "difficulty": DifficultyLevel.MEDIUM,
            "duration_minutes": 22,
            "total_lessons": 14,
            "instructor": "Maestro Melody",
            "image_emoji": "🎵",
            "color_gradient": "from-yellow-500 to-red-600",
            "skills": ["Rhythm", "Melody", "Music Theory", "Composition"],
            "is_premium": True
        }
    ],
    AgeLevel.INTERMEDIATE: [
        {
            "title": "Multiplication & Division Masters",
            "description": "Master advanced multiplication and division with challenging problems and real-world applications!",
            "category": CourseCategory.MATH,
            "age_level": AgeLevel.INTERMEDIATE,
            "difficulty": DifficultyLevel.HARD,
            "duration_minutes": 35,
            "total_lessons": 22,
            "instructor": "Dr. Mathzilla",
            "image_emoji": "🔥",
            "color_gradient": "from-red-500 to-orange-600",
            "skills": ["Multiplication", "Division", "Problem Solving", "Applied Math"],
            "is_premium": False
        },
        {
            "title": "Chemistry Lab Adventures",
            "description": "Explore the fascinating world of chemistry with safe virtual experiments and discoveries!",
            "category": CourseCategory.SCIENCE,
            "age_level": AgeLevel.INTERMEDIATE,
            "difficulty": DifficultyLevel.HARD,
            "duration_minutes": 40,
            "total_lessons": 25,
            "instructor": "Professor Beaker",
            "image_emoji": "⚗️",
            "color_gradient": "from-green-500 to-cyan-600",
            "skills": ["Chemistry Basics", "Scientific Method", "Experiments", "Analysis"],
            "is_premium": True
        },
        {
            "title": "Creative Writing Workshop",
            "description": "Develop advanced writing skills through storytelling, poetry, and creative expression!",
            "category": CourseCategory.ENGLISH,
            "age_level": AgeLevel.INTERMEDIATE,
            "difficulty": DifficultyLevel.HARD,
            "duration_minutes": 45,
            "total_lessons": 20,
            "instructor": "Author Wordsmith",
            "image_emoji": "✍️",
            "color_gradient": "from-purple-500 to-pink-600",
            "skills": ["Creative Writing", "Grammar", "Vocabulary", "Storytelling"],
            "is_premium": True
        },
        {
            "title": "Coding Adventures with Python",
            "description": "Learn programming fundamentals with Python through games, animations, and projects!",
            "category": CourseCategory.CODING,
            "age_level": AgeLevel.INTERMEDIATE,
            "difficulty": DifficultyLevel.HARD,
            "duration_minutes": 50,
            "total_lessons": 30,
            "instructor": "Code Master Bot",
            "image_emoji": "🐍",
            "color_gradient": "from-blue-600 to-green-600",
            "skills": ["Programming", "Logic", "Problem Solving", "Computational Thinking"],
            "is_premium": True
        },
        {
            "title": "Advanced Art Techniques",
            "description": "Master advanced art techniques including perspective, shading, and digital illustration!",
            "category": CourseCategory.ART,
            "age_level": AgeLevel.INTERMEDIATE,
            "difficulty": DifficultyLevel.HARD,
            "duration_minutes": 42,
            "total_lessons": 24,
            "instructor": "Master Artist",
            "image_emoji": "🖌️",
            "color_gradient": "from-indigo-500 to-purple-600",
            "skills": ["Advanced Drawing", "Perspective", "Shading", "Digital Art"],
            "is_premium": True
        },
        {
            "title": "Music Theory & Composition",
            "description": "Dive deep into music theory and create your own musical compositions and arrangements!",
            "category": CourseCategory.MUSIC,
            "age_level": AgeLevel.INTERMEDIATE,
            "difficulty": DifficultyLevel.HARD,
            "duration_minutes": 38,
            "total_lessons": 28,
            "instructor": "Symphony Sam",
            "image_emoji": "🎼",
            "color_gradient": "from-violet-500 to-pink-600",
            "skills": ["Music Theory", "Composition", "Harmony", "Arrangement"],
            "is_premium": True
        }
    ]
}

async def populate_sample_courses():
    """Populate the database with sample courses for all age levels."""
    
    for age_level, courses in SAMPLE_COURSES.items():
        for course_data in courses:
            course_create = CourseCreate(**course_data)
            course = await DatabaseManager.create_course(course_create)
            print(f"Created course: {course.title} for {age_level}")

if __name__ == "__main__":
    asyncio.run(populate_sample_courses())