from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

# Unified Age Levels for TecaiKids Platform (Ages 4-16)
class UnifiedAgeLevel(str, Enum):
    LITTLE_LEARNERS = "4-6"      # Ages 4-6: Little Learners
    YOUNG_EXPLORERS = "7-9"      # Ages 7-9: Young Explorers  
    SMART_KIDS = "10-12"         # Ages 10-12: Smart Kids
    TECH_TEENS = "13-15"         # Ages 13-15: Tech Teens
    FUTURE_LEADERS = "16-18"     # Ages 16-18: Future Leaders

# Backwards compatibility aliases
class AgeLevel(str, Enum):
    PRESCHOOL = "4-6"  # Ages 4-6
    ELEMENTARY = "7-9"  # Ages 7-9
    INTERMEDIATE = "10-12"  # Ages 10-12

class DifficultyLevel(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    FILL_BLANK = "fill_blank"
    MATCHING = "matching"

class CourseCategory(str, Enum):
    MATH = "Math"
    SCIENCE = "Science"
    ENGLISH = "English"
    ART = "Art"
    CODING = "Coding"
    MUSIC = "Music"
    LOGICAL_THINKING = "Logical Thinking"
    ALGORITHMIC_THINKING = "Algorithmic Thinking"

# Subscription and Payment Models
class SubscriptionType(str, Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUAL = "annual"

class PaymentMethod(str, Enum):
    STRIPE = "stripe"
    BANK_TRANSFER = "bank_transfer"
    EZCASH = "ezcash"
    MCASH = "mcash"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    CANCELLED = "cancelled"
    EXPIRED = "expired"

# Payment Transaction Model
class PaymentTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: Optional[str] = None
    amount: float
    currency: str = "LKR"
    payment_method: PaymentMethod
    payment_status: PaymentStatus = PaymentStatus.PENDING
    subscription_type: SubscriptionType
    age_level: UnifiedAgeLevel
    metadata: Optional[Dict[str, Any]] = {}
    stripe_session_id: Optional[str] = None
    bank_reference: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Subscription Model
class Subscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    subscription_type: SubscriptionType
    age_level: UnifiedAgeLevel
    status: SubscriptionStatus = SubscriptionStatus.ACTIVE
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: Optional[datetime] = None
    next_billing_date: Optional[datetime] = None
    monthly_amount: float
    quarterly_amount: float
    workbook_delivery_address: Optional[str] = None
    last_workbook_delivery: Optional[datetime] = None
    next_workbook_delivery: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Workbook Delivery Model
class WorkbookDelivery(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    subscription_id: str
    user_id: str
    age_level: UnifiedAgeLevel
    delivery_address: str
    delivery_status: str = "scheduled"  # scheduled, shipped, delivered, failed
    tracking_number: Optional[str] = None
    shipped_date: Optional[datetime] = None
    delivered_date: Optional[datetime] = None
    quarter: str  # Q1, Q2, Q3, Q4
    year: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

# User Models (Updated for Unified Platform)
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: int
    age_level: UnifiedAgeLevel
    parent_email: str
    student_email: Optional[str] = None
    phone: Optional[str] = None
    school: Optional[str] = None
    grade: Optional[int] = None
    interests: List[str] = []
    career_goals: List[str] = []
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    total_points: int = 0
    streak_days: int = 0
    last_activity: Optional[datetime] = None
    subscription_id: Optional[str] = None

class UserCreate(BaseModel):
    name: str
    age: int
    parent_email: str
    student_email: Optional[str] = None
    phone: Optional[str] = None
    school: Optional[str] = None
    grade: Optional[int] = None
    interests: List[str] = []
    career_goals: List[str] = []
    avatar: Optional[str] = None

# Course Models
class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: CourseCategory
    age_level: UnifiedAgeLevel
    difficulty: DifficultyLevel
    duration_minutes: int
    total_lessons: int
    instructor: str
    image_emoji: str
    color_gradient: str
    skills: List[str]
    is_premium: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CourseCreate(BaseModel):
    title: str
    description: str
    category: CourseCategory
    age_level: UnifiedAgeLevel
    difficulty: DifficultyLevel
    duration_minutes: int
    total_lessons: int
    instructor: str
    image_emoji: str
    color_gradient: str
    skills: List[str]
    is_premium: bool = False

# Quiz Models
class QuizOption(BaseModel):
    id: str
    text: str
    is_correct: bool

class QuizQuestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    question_type: QuestionType
    options: List[QuizOption]
    correct_answer: str
    explanation: Optional[str] = None
    points: int = 10
    difficulty: DifficultyLevel

class Quiz(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: CourseCategory
    age_level: UnifiedAgeLevel
    difficulty: DifficultyLevel
    questions: List[QuizQuestion]
    time_limit_minutes: Optional[int] = None
    passing_score: int = 70
    image_emoji: str
    color_gradient: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class QuizCreate(BaseModel):
    title: str
    description: str
    category: CourseCategory
    age_level: UnifiedAgeLevel
    difficulty: DifficultyLevel
    questions: List[QuizQuestion]
    time_limit_minutes: Optional[int] = None
    passing_score: int = 70
    image_emoji: str
    color_gradient: str

# Quiz Attempt Models
class QuizAnswer(BaseModel):
    question_id: str
    selected_answer: str
    is_correct: bool
    points_earned: int

class QuizAttempt(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    quiz_id: str
    answers: List[QuizAnswer]
    score: int
    percentage: float
    time_taken_seconds: int
    completed_at: datetime = Field(default_factory=datetime.utcnow)
    passed: bool

class QuizAttemptCreate(BaseModel):
    user_id: str
    quiz_id: str
    answers: List[QuizAnswer]
    time_taken_seconds: int

# Progress Models
class UserProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    course_id: Optional[str] = None
    quiz_id: Optional[str] = None
    category: CourseCategory
    completion_percentage: float
    time_spent_minutes: int
    last_accessed: datetime = Field(default_factory=datetime.utcnow)
    is_completed: bool = False

class Achievement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    icon: str
    category: str
    points_required: int
    rarity: str  # Common, Rare, Epic, Legendary

class UserAchievement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    achievement_id: str
    unlocked_at: datetime = Field(default_factory=datetime.utcnow)

# Activity Models
class Activity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: CourseCategory
    age_level: UnifiedAgeLevel
    difficulty: DifficultyLevel
    activity_type: str  # game, puzzle, creative, experiment
    duration_minutes: int
    image_emoji: str
    color_gradient: str
    skills: List[str]
    instructions: str
    is_premium: bool = False

# Leaderboard Models
class LeaderboardEntry(BaseModel):
    user_id: str
    user_name: str
    total_points: int
    rank: int
    age_level: UnifiedAgeLevel
    avatar: Optional[str] = None

# Response Models
class QuizResult(BaseModel):
    quiz_attempt: QuizAttempt
    correct_answers: int
    total_questions: int
    time_taken: str
    achievements_unlocked: List[Achievement] = []

class UserStats(BaseModel):
    user: User
    total_courses_completed: int
    total_quizzes_completed: int
    total_time_spent_hours: float
    current_streak: int
    achievements_count: int
    favorite_category: Optional[CourseCategory] = None
    weekly_progress: Dict[str, int]

class AgeBasedContent(BaseModel):
    courses: List[Course]
    quizzes: List[Quiz]
    activities: List[Activity]
    recommended_for_age: UnifiedAgeLevel

# Pricing Models
class PricingPlan(BaseModel):
    age_level: UnifiedAgeLevel
    monthly_price: float
    quarterly_price: float
    quarterly_savings: float
    digital_content_price: float
    physical_materials_price: float = 1500.00
    features: List[str]
    description: str

# Payment Request Models
class PaymentRequest(BaseModel):
    user_id: str
    age_level: UnifiedAgeLevel
    subscription_type: SubscriptionType
    payment_method: PaymentMethod
    delivery_address: Optional[str] = None

class PaymentResponse(BaseModel):
    transaction_id: str
    payment_url: Optional[str] = None
    bank_details: Optional[Dict[str, Any]] = None
    success: bool
    message: str