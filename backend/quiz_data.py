from models import *
from database import DatabaseManager
import asyncio

# Sample quiz data for different age levels and categories

SAMPLE_QUIZZES = {
    AgeLevel.PRESCHOOL: {
        CourseCategory.MATH: [
            {
                "title": "Counting Fun",
                "description": "Learn to count from 1 to 10 with colorful objects!",
                "category": CourseCategory.MATH,
                "age_level": AgeLevel.PRESCHOOL,
                "difficulty": DifficultyLevel.EASY,
                "time_limit_minutes": 10,
                "passing_score": 60,
                "image_emoji": "🔢",
                "color_gradient": "from-blue-400 to-blue-600",
                "questions": [
                    {
                        "question": "How many apples do you see? 🍎🍎🍎",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "2", "is_correct": False},
                            {"id": "b", "text": "3", "is_correct": True},
                            {"id": "c", "text": "4", "is_correct": False},
                            {"id": "d", "text": "5", "is_correct": False}
                        ],
                        "correct_answer": "b",
                        "explanation": "Count each apple: 1, 2, 3!",
                        "points": 10,
                        "difficulty": DifficultyLevel.EASY
                    },
                    {
                        "question": "What comes after 5?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "4", "is_correct": False},
                            {"id": "b", "text": "6", "is_correct": True},
                            {"id": "c", "text": "7", "is_correct": False},
                            {"id": "d", "text": "3", "is_correct": False}
                        ],
                        "correct_answer": "b",
                        "explanation": "When counting: 1, 2, 3, 4, 5, 6!",
                        "points": 10,
                        "difficulty": DifficultyLevel.EASY
                    },
                    {
                        "question": "Which group has MORE? 🐶🐶 or 🐱🐱🐱?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "Dogs", "is_correct": False},
                            {"id": "b", "text": "Cats", "is_correct": True},
                            {"id": "c", "text": "Same", "is_correct": False},
                            {"id": "d", "text": "Don't know", "is_correct": False}
                        ],
                        "correct_answer": "b",
                        "explanation": "2 dogs and 3 cats - cats have more!",
                        "points": 10,
                        "difficulty": DifficultyLevel.EASY
                    }
                ]
            }
        ],
        CourseCategory.SCIENCE: [
            {
                "title": "Animal Friends",
                "description": "Learn about different animals and where they live!",
                "category": CourseCategory.SCIENCE,
                "age_level": AgeLevel.PRESCHOOL,
                "difficulty": DifficultyLevel.EASY,
                "time_limit_minutes": 8,
                "passing_score": 60,
                "image_emoji": "🦁",
                "color_gradient": "from-green-400 to-green-600",
                "questions": [
                    {
                        "question": "Where do fish live?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "Trees", "is_correct": False},
                            {"id": "b", "text": "Water", "is_correct": True},
                            {"id": "c", "text": "Sky", "is_correct": False},
                            {"id": "d", "text": "House", "is_correct": False}
                        ],
                        "correct_answer": "b",
                        "explanation": "Fish live in water - lakes, rivers, and oceans!",
                        "points": 10,
                        "difficulty": DifficultyLevel.EASY
                    },
                    {
                        "question": "What sound does a cow make?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "Woof", "is_correct": False},
                            {"id": "b", "text": "Meow", "is_correct": False},
                            {"id": "c", "text": "Moo", "is_correct": True},
                            {"id": "d", "text": "Roar", "is_correct": False}
                        ],
                        "correct_answer": "c",
                        "explanation": "Cows say 'Moo'! 🐄",
                        "points": 10,
                        "difficulty": DifficultyLevel.EASY
                    }
                ]
            }
        ]
    },
    AgeLevel.ELEMENTARY: {
        CourseCategory.MATH: [
            {
                "title": "Addition Adventures",
                "description": "Master addition with fun word problems and number games!",
                "category": CourseCategory.MATH,
                "age_level": AgeLevel.ELEMENTARY,
                "difficulty": DifficultyLevel.MEDIUM,
                "time_limit_minutes": 15,
                "passing_score": 70,
                "image_emoji": "➕",
                "color_gradient": "from-blue-500 to-purple-600",
                "questions": [
                    {
                        "question": "Sarah has 8 stickers. Her friend gives her 5 more. How many stickers does she have now?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "12", "is_correct": False},
                            {"id": "b", "text": "13", "is_correct": True},
                            {"id": "c", "text": "14", "is_correct": False},
                            {"id": "d", "text": "15", "is_correct": False}
                        ],
                        "correct_answer": "b",
                        "explanation": "8 + 5 = 13 stickers total!",
                        "points": 15,
                        "difficulty": DifficultyLevel.MEDIUM
                    },
                    {
                        "question": "What is 25 + 17?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "41", "is_correct": False},
                            {"id": "b", "text": "42", "is_correct": True},
                            {"id": "c", "text": "43", "is_correct": False},
                            {"id": "d", "text": "44", "is_correct": False}
                        ],
                        "correct_answer": "b",
                        "explanation": "25 + 17 = 42. Break it down: 20 + 10 = 30, then 5 + 7 = 12, so 30 + 12 = 42!",
                        "points": 15,
                        "difficulty": DifficultyLevel.MEDIUM
                    },
                    {
                        "question": "Tom collected 15 shells on Monday and 23 shells on Tuesday. How many shells did he collect in total?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "38", "is_correct": True},
                            {"id": "b", "text": "37", "is_correct": False},
                            {"id": "c", "text": "39", "is_correct": False},
                            {"id": "d", "text": "36", "is_correct": False}
                        ],
                        "correct_answer": "a",
                        "explanation": "15 + 23 = 38 shells total!",
                        "points": 15,
                        "difficulty": DifficultyLevel.MEDIUM
                    }
                ]
            }
        ],
        CourseCategory.SCIENCE: [
            {
                "title": "Solar System Explorer",
                "description": "Journey through space and learn about planets!",
                "category": CourseCategory.SCIENCE,
                "age_level": AgeLevel.ELEMENTARY,
                "difficulty": DifficultyLevel.MEDIUM,
                "time_limit_minutes": 12,
                "passing_score": 70,
                "image_emoji": "🌍",
                "color_gradient": "from-purple-500 to-pink-600",
                "questions": [
                    {
                        "question": "Which planet is closest to the Sun?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "Earth", "is_correct": False},
                            {"id": "b", "text": "Mercury", "is_correct": True},
                            {"id": "c", "text": "Venus", "is_correct": False},
                            {"id": "d", "text": "Mars", "is_correct": False}
                        ],
                        "correct_answer": "b",
                        "explanation": "Mercury is the closest planet to the Sun!",
                        "points": 15,
                        "difficulty": DifficultyLevel.MEDIUM
                    },
                    {
                        "question": "How many moons does Earth have?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "0", "is_correct": False},
                            {"id": "b", "text": "1", "is_correct": True},
                            {"id": "c", "text": "2", "is_correct": False},
                            {"id": "d", "text": "3", "is_correct": False}
                        ],
                        "correct_answer": "b",
                        "explanation": "Earth has one moon that we can see in the sky!",
                        "points": 15,
                        "difficulty": DifficultyLevel.MEDIUM
                    }
                ]
            }
        ]
    },
    AgeLevel.INTERMEDIATE: {
        CourseCategory.MATH: [
            {
                "title": "Multiplication Masters",
                "description": "Become a multiplication expert with challenging problems!",
                "category": CourseCategory.MATH,
                "age_level": AgeLevel.INTERMEDIATE,
                "difficulty": DifficultyLevel.HARD,
                "time_limit_minutes": 20,
                "passing_score": 80,
                "image_emoji": "✖️",
                "color_gradient": "from-orange-500 to-red-600",
                "questions": [
                    {
                        "question": "A classroom has 8 rows of desks with 6 desks in each row. How many desks are there in total?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "46", "is_correct": False},
                            {"id": "b", "text": "48", "is_correct": True},
                            {"id": "c", "text": "50", "is_correct": False},
                            {"id": "d", "text": "52", "is_correct": False}
                        ],
                        "correct_answer": "b",
                        "explanation": "8 rows × 6 desks per row = 48 desks total!",
                        "points": 20,
                        "difficulty": DifficultyLevel.HARD
                    },
                    {
                        "question": "What is 12 × 15?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "180", "is_correct": True},
                            {"id": "b", "text": "170", "is_correct": False},
                            {"id": "c", "text": "190", "is_correct": False},
                            {"id": "d", "text": "175", "is_correct": False}
                        ],
                        "correct_answer": "a",
                        "explanation": "12 × 15 = 180. You can break it down: 12 × 10 = 120, 12 × 5 = 60, so 120 + 60 = 180!",
                        "points": 20,
                        "difficulty": DifficultyLevel.HARD
                    }
                ]
            }
        ],
        CourseCategory.SCIENCE: [
            {
                "title": "Chemistry Lab",
                "description": "Explore the world of atoms, molecules, and reactions!",
                "category": CourseCategory.SCIENCE,
                "age_level": AgeLevel.INTERMEDIATE,
                "difficulty": DifficultyLevel.HARD,
                "time_limit_minutes": 18,
                "passing_score": 80,
                "image_emoji": "⚗️",
                "color_gradient": "from-green-500 to-blue-600",
                "questions": [
                    {
                        "question": "What is the chemical symbol for water?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "HO", "is_correct": False},
                            {"id": "b", "text": "H2O", "is_correct": True},
                            {"id": "c", "text": "WA", "is_correct": False},
                            {"id": "d", "text": "H3O", "is_correct": False}
                        ],
                        "correct_answer": "b",
                        "explanation": "Water is H2O - 2 hydrogen atoms and 1 oxygen atom!",
                        "points": 20,
                        "difficulty": DifficultyLevel.HARD
                    },
                    {
                        "question": "What happens when you mix baking soda and vinegar?",
                        "question_type": QuestionType.MULTIPLE_CHOICE,
                        "options": [
                            {"id": "a", "text": "Nothing", "is_correct": False},
                            {"id": "b", "text": "It bubbles and fizzes", "is_correct": True},
                            {"id": "c", "text": "It turns blue", "is_correct": False},
                            {"id": "d", "text": "It freezes", "is_correct": False}
                        ],
                        "correct_answer": "b",
                        "explanation": "Baking soda and vinegar react to create carbon dioxide gas, which makes bubbles!",
                        "points": 20,
                        "difficulty": DifficultyLevel.HARD
                    }
                ]
            }
        ]
    }
}

async def populate_sample_quizzes():
    """Populate the database with sample quizzes for all age levels."""
    
    for age_level, categories in SAMPLE_QUIZZES.items():
        for category, quizzes in categories.items():
            for quiz_data in quizzes:
                # Convert questions to QuizQuestion objects
                questions = []
                for q_data in quiz_data["questions"]:
                    options = [QuizOption(**opt) for opt in q_data["options"]]
                    question = QuizQuestion(
                        question=q_data["question"],
                        question_type=q_data["question_type"],
                        options=options,
                        correct_answer=q_data["correct_answer"],
                        explanation=q_data.get("explanation"),
                        points=q_data["points"],
                        difficulty=q_data["difficulty"]
                    )
                    questions.append(question)
                
                quiz_create = QuizCreate(
                    title=quiz_data["title"],
                    description=quiz_data["description"],
                    category=quiz_data["category"],
                    age_level=quiz_data["age_level"],
                    difficulty=quiz_data["difficulty"],
                    questions=questions,
                    time_limit_minutes=quiz_data.get("time_limit_minutes"),
                    passing_score=quiz_data["passing_score"],
                    image_emoji=quiz_data["image_emoji"],
                    color_gradient=quiz_data["color_gradient"]
                )
                
                await DatabaseManager.create_quiz(quiz_create)
                print(f"Created quiz: {quiz_data['title']} for {age_level}")

if __name__ == "__main__":
    asyncio.run(populate_sample_quizzes())