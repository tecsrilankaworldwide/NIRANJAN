# Enhanced Workouts System for TEC Platform
# Advanced logical thinking challenges with achievement tracking

from datetime import datetime
import uuid
from typing import List, Dict, Any
from enum import Enum

class AchievementType(str, Enum):
    FIRST_WORKOUT = "first_workout"
    STREAK_7_DAYS = "streak_7_days"
    STREAK_30_DAYS = "streak_30_days"
    PATTERN_MASTER = "pattern_master"
    LOGIC_CHAMPION = "logic_champion"
    SPEED_SOLVER = "speed_solver"
    PERFECTIONIST = "perfectionist"
    HINT_MINIMALIST = "hint_minimalist"
    DIFFICULTY_CLIMBER = "difficulty_climber"
    ALL_ROUNDER = "all_rounder"

# Enhanced Workouts Collection - More Variety and Difficulty Levels
ENHANCED_WORKOUTS = [
    # Foundation Level (Ages 5-8) - Fun and Interactive
    {
        "title": "Color Pattern Detective",
        "description": "Follow the rainbow! Find the missing color in these beautiful sequences.",
        "workout_type": "pattern_recognition",
        "difficulty": "beginner",
        "learning_level": "foundation",
        "age_group": "5-8",
        "estimated_time_minutes": 3,
        "exercise_data": {
            "sequence": ["red", "blue", "red", "blue", "?"],
            "type": "color_sequence",
            "instructions": "What color comes next in this pattern?",
            "options": ["red", "blue", "green", "yellow"]
        },
        "solution": {"answer": "red", "explanation": "The pattern alternates: red, blue, red, blue, so red comes next!"},
        "hints": ["Look at every other color", "What do you see repeating?"],
        "skill_areas": ["logical_thinking"],
        "reward_points": 10
    },
    {
        "title": "Animal Home Matching",
        "description": "Help each animal find their perfect home using logical thinking!",
        "workout_type": "logical_matching",
        "difficulty": "beginner",
        "learning_level": "foundation",
        "age_group": "5-8",
        "estimated_time_minutes": 4,
        "exercise_data": {
            "animals": ["fish", "bird", "bear"],
            "homes": ["nest", "cave", "pond"],
            "clues": [
                "Fish live in water",
                "Birds build homes in trees", 
                "Bears sleep in dark places"
            ],
            "instructions": "Match each animal to their correct home"
        },
        "solution": {
            "matches": {"fish": "pond", "bird": "nest", "bear": "cave"},
            "explanation": "Fish need water (pond), birds build nests, bears live in caves!"
        },
        "hints": ["Think about where you see these animals in real life", "What does each animal need?"],
        "skill_areas": ["logical_thinking", "creative_problem_solving"],
        "reward_points": 15
    },
    
    # Development Level (Ages 9-12) - More Complex Logic
    {
        "title": "Number Detective Challenge",
        "description": "Crack the code! Find the hidden rule in these number sequences.",
        "workout_type": "pattern_recognition",
        "difficulty": "intermediate",
        "learning_level": "development", 
        "age_group": "9-12",
        "estimated_time_minutes": 7,
        "exercise_data": {
            "sequences": [
                {"sequence": [2, 6, 18, 54, "?"], "rule": "multiply by 3"},
                {"sequence": [100, 50, 25, 12.5, "?"], "rule": "divide by 2"}
            ],
            "type": "multiple_patterns",
            "instructions": "Find the pattern in each sequence and predict the next number"
        },
        "solution": {
            "answers": [162, 6.25],
            "explanation": "First sequence multiplies by 3 each time. Second sequence divides by 2 each time."
        },
        "hints": ["Try multiplication and division", "Look at how each number changes", "What operation connects the numbers?"],
        "skill_areas": ["logical_thinking", "systems_thinking"],
        "reward_points": 25
    },
    {
        "title": "School Schedule Puzzle",
        "description": "Help organize the perfect class schedule using logical constraints!",
        "workout_type": "constraint_solving",
        "difficulty": "intermediate",
        "learning_level": "development",
        "age_group": "9-12", 
        "estimated_time_minutes": 12,
        "exercise_data": {
            "subjects": ["Math", "Science", "Art", "PE"],
            "time_slots": ["9AM", "10AM", "11AM", "12PM"],
            "constraints": [
                "Math must be before lunch (12PM)",
                "PE should be the last class",
                "Science needs lab equipment available at 10AM",
                "Art class can't be first thing in the morning"
            ],
            "instructions": "Arrange the subjects in time slots following all constraints"
        },
        "solution": {
            "schedule": {"9AM": "Math", "10AM": "Science", "11AM": "Art", "12PM": "PE"},
            "explanation": "Math first (before lunch), Science at 10AM (lab time), Art not first, PE last"
        },
        "hints": ["Start with the most specific constraints", "Work backwards from PE being last", "Which subject MUST be at 10AM?"],
        "skill_areas": ["logical_thinking", "creative_problem_solving", "systems_thinking"],
        "reward_points": 35
    },
    
    # Mastery Level (Ages 13-16) - Advanced Problem Solving
    {
        "title": "AI Decision Tree Builder",
        "description": "Create a logical decision tree for an AI system to classify different scenarios.",
        "workout_type": "systems_design",
        "difficulty": "advanced",
        "learning_level": "mastery",
        "age_group": "13-16",
        "estimated_time_minutes": 18,
        "exercise_data": {
            "scenario": "Design an AI system to recommend study methods based on learning style",
            "inputs": ["learning_style", "available_time", "subject_difficulty", "exam_deadline"],
            "outputs": ["intensive_review", "spaced_practice", "group_study", "individual_focus"],
            "sample_data": [
                {"learning_style": "visual", "time": "limited", "difficulty": "high", "deadline": "soon", "best_method": "intensive_review"},
                {"learning_style": "auditory", "time": "plenty", "difficulty": "medium", "deadline": "far", "best_method": "spaced_practice"}
            ],
            "instructions": "Create decision rules that determine the best study method"
        },
        "solution": {
            "decision_tree": {
                "if deadline == 'soon' and difficulty == 'high'": "intensive_review",
                "if time == 'plenty' and deadline == 'far'": "spaced_practice", 
                "if learning_style == 'auditory'": "group_study",
                "else": "individual_focus"
            },
            "explanation": "Urgent + difficult = intensive. Plenty of time = spaced. Auditory learners benefit from group discussion."
        },
        "hints": ["Consider the most urgent conditions first", "Match learning styles to methods", "Think about time constraints"],
        "skill_areas": ["ai_literacy", "logical_thinking", "systems_thinking", "future_career_skills"],
        "reward_points": 50
    },
    {
        "title": "Smart City Resource Optimizer",
        "description": "Balance resources in a smart city to maximize efficiency and citizen happiness.",
        "workout_type": "optimization_challenge",
        "difficulty": "expert",
        "learning_level": "mastery",
        "age_group": "13-16",
        "estimated_time_minutes": 25,
        "exercise_data": {
            "resources": {
                "energy": 1000,
                "water": 800, 
                "budget": 50000,
                "workforce": 200
            },
            "city_needs": [
                {"area": "transportation", "energy": 300, "budget": 15000, "workforce": 50, "happiness": 25},
                {"area": "healthcare", "energy": 200, "budget": 20000, "workforce": 80, "happiness": 40},
                {"area": "education", "energy": 150, "budget": 12000, "workforce": 60, "happiness": 35},
                {"area": "environment", "energy": 250, "budget": 8000, "workforce": 30, "happiness": 30}
            ],
            "constraints": ["Must allocate at least 60% of budget", "Happiness must exceed 100 total"],
            "instructions": "Allocate resources to maximize citizen happiness while staying within constraints"
        },
        "solution": {
            "allocation": {
                "healthcare": "full investment",
                "education": "full investment", 
                "environment": "partial investment",
                "transportation": "minimal investment"
            },
            "total_happiness": 130,
            "explanation": "Prioritize healthcare and education for maximum happiness per resource unit"
        },
        "hints": ["Calculate happiness per resource ratio", "Essential services first", "Look for efficiency wins"],
        "skill_areas": ["systems_thinking", "future_career_skills", "logical_thinking", "innovation_methods"],
        "reward_points": 75
    }
]

# Achievement System
ACHIEVEMENTS = {
    AchievementType.FIRST_WORKOUT: {
        "title": "🎯 First Steps",
        "description": "Completed your first logical thinking workout!",
        "icon": "🎯",
        "points": 50,
        "unlock_condition": "complete_first_workout"
    },
    AchievementType.STREAK_7_DAYS: {
        "title": "🔥 Week Warrior",
        "description": "Completed workouts for 7 days in a row!",
        "icon": "🔥",
        "points": 200,
        "unlock_condition": "7_day_streak"
    },
    AchievementType.STREAK_30_DAYS: {
        "title": "💎 Month Master",
        "description": "Amazing! 30 days of continuous learning!",
        "icon": "💎",
        "points": 1000,
        "unlock_condition": "30_day_streak"
    },
    AchievementType.PATTERN_MASTER: {
        "title": "🔍 Pattern Master",
        "description": "Solved 20 pattern recognition challenges!",
        "icon": "🔍",
        "points": 300,
        "unlock_condition": "pattern_recognition_20"
    },
    AchievementType.LOGIC_CHAMPION: {
        "title": "🧠 Logic Champion",
        "description": "Mastered all logical reasoning challenges!",
        "icon": "🧠", 
        "points": 500,
        "unlock_condition": "logic_perfect_score"
    },
    AchievementType.SPEED_SOLVER: {
        "title": "⚡ Speed Solver", 
        "description": "Completed 10 workouts in under 5 minutes each!",
        "icon": "⚡",
        "points": 400,
        "unlock_condition": "speed_solver_10"
    },
    AchievementType.PERFECTIONIST: {
        "title": "⭐ Perfectionist",
        "description": "Achieved 100% accuracy on 15 consecutive workouts!",
        "icon": "⭐",
        "points": 600,
        "unlock_condition": "perfect_streak_15"
    },
    AchievementType.HINT_MINIMALIST: {
        "title": "💪 Independent Thinker",
        "description": "Solved 25 workouts without using any hints!",
        "icon": "💪",
        "points": 350,
        "unlock_condition": "no_hints_25"
    },
    AchievementType.DIFFICULTY_CLIMBER: {
        "title": "🏔️ Difficulty Climber",
        "description": "Progressed from beginner to expert level!",
        "icon": "🏔️",
        "points": 800,
        "unlock_condition": "all_difficulties_completed"
    },
    AchievementType.ALL_ROUNDER: {
        "title": "🌟 All-Rounder",
        "description": "Completed workouts in every skill area!",
        "icon": "🌟",
        "points": 1200,
        "unlock_condition": "all_skill_areas_completed"
    }
}

def calculate_workout_score(time_spent: int, estimated_time: int, hints_used: int, is_correct: bool) -> int:
    """Enhanced scoring algorithm with bonuses"""
    if not is_correct:
        return 0
    
    base_score = 100
    
    # Time bonus (finish faster than estimated time)
    if time_spent < estimated_time:
        time_bonus = min(30, (estimated_time - time_spent) * 2)
        base_score += time_bonus
    
    # Hint penalty
    hint_penalty = hints_used * 15
    base_score -= hint_penalty
    
    # No hints bonus
    if hints_used == 0:
        base_score += 25
    
    # Speed bonus (under 3 minutes)
    if time_spent < 3:
        base_score += 40
    
    return max(10, base_score)  # Minimum 10 points for correct answer