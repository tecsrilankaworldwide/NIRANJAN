from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class TeenAgeLevel(str, Enum):
    MIDDLE_TEEN = "12-14"  # Ages 12-14
    HIGH_TEEN = "15-17"    # Ages 15-17

class TeenDifficultyLevel(str, Enum):
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced" 
    EXPERT = "Expert"

class TeenCourseCategory(str, Enum):
    CODING = "Advanced Coding"
    ROBOTICS = "Robotics & AI"
    APP_DEV = "Mobile Development"
    WEB_DEV = "Web Development"
    DATA_SCIENCE = "Data Science"
    GAME_DEV = "Game Development"
    CYBERSECURITY = "Cybersecurity"
    ENTREPRENEURSHIP = "Digital Entrepreneurship"
    CAREER_PREP = "Career Preparation"

class ProjectType(str, Enum):
    CODING_PROJECT = "Coding Project"
    ROBOTICS_BUILD = "Robotics Build"
    APP_CREATION = "App Creation"
    WEB_APPLICATION = "Web Application"
    RESEARCH_PROJECT = "Research Project"
    STARTUP_PITCH = "Startup Pitch"

# Teen User Models
class TeenUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: int
    age_level: TeenAgeLevel
    parent_email: str
    student_email: Optional[str] = None
    school: Optional[str] = None
    grade: Optional[int] = None
    interests: List[str] = []
    career_goals: List[str] = []
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    total_points: int = 0
    streak_days: int = 0
    projects_completed: int = 0
    certifications_earned: int = 0
    last_activity: Optional[datetime] = None

class TeenUserCreate(BaseModel):
    name: str
    age: int
    parent_email: str
    student_email: Optional[str] = None
    school: Optional[str] = None
    grade: Optional[int] = None
    interests: List[str] = []
    career_goals: List[str] = []

# Advanced Course Models
class TeenCourse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: TeenCourseCategory
    age_level: TeenAgeLevel
    difficulty: TeenDifficultyLevel
    duration_weeks: int
    hours_per_week: int
    total_modules: int
    instructor: str
    instructor_bio: str
    prerequisites: List[str] = []
    learning_outcomes: List[str] = []
    tools_required: List[str] = []
    image_url: Optional[str] = None
    color_gradient: str
    price_lkr: float
    is_premium: bool = True
    certification_available: bool = True
    portfolio_project: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TeenCourseCreate(BaseModel):
    title: str
    description: str
    category: TeenCourseCategory
    age_level: TeenAgeLevel
    difficulty: TeenDifficultyLevel
    duration_weeks: int
    hours_per_week: int
    total_modules: int
    instructor: str
    instructor_bio: str
    prerequisites: List[str] = []
    learning_outcomes: List[str] = []
    tools_required: List[str] = []
    image_url: Optional[str] = None
    color_gradient: str
    price_lkr: float
    is_premium: bool = True
    certification_available: bool = True
    portfolio_project: bool = True

# Project-Based Learning
class TeenProject(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    project_type: ProjectType
    course_id: str
    student_id: str
    difficulty: TeenDifficultyLevel
    technologies_used: List[str]
    project_url: Optional[str] = None
    github_repo: Optional[str] = None
    demo_video: Optional[str] = None
    presentation_slides: Optional[str] = None
    status: str = "In Progress"  # In Progress, Completed, Reviewed, Showcase
    score: Optional[int] = None
    mentor_feedback: Optional[str] = None
    peer_reviews: List[Dict] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

# Advanced Assessment Models
class CodingChallenge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: TeenCourseCategory
    difficulty: TeenDifficultyLevel
    problem_statement: str
    input_format: str
    output_format: str
    sample_inputs: List[str]
    expected_outputs: List[str]
    test_cases: List[Dict]
    time_limit_minutes: int
    programming_languages: List[str]
    points: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CodingSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    challenge_id: str
    student_id: str
    code: str
    language: str
    status: str  # Pending, Running, Accepted, Wrong Answer, Time Limit Exceeded
    test_results: List[Dict] = []
    score: int = 0
    execution_time: Optional[float] = None
    memory_used: Optional[float] = None
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

# Certification System
class TeenCertification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: TeenCourseCategory
    requirements: List[str]
    badge_image: str
    verification_code: str
    issued_by: str = "TEC Sri Lanka Worldwide"
    valid_until: Optional[datetime] = None

class TeenCertificationEarned(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    certification_id: str
    course_id: Optional[str] = None
    final_score: float
    projects_completed: List[str]
    skills_demonstrated: List[str]
    issued_date: datetime = Field(default_factory=datetime.utcnow)
    verification_url: str
    blockchain_hash: Optional[str] = None

# Mentorship & Career Guidance
class Mentor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    company: str
    expertise_areas: List[str]
    bio: str
    profile_image: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    years_experience: int
    rating: float = 0.0
    total_sessions: int = 0
    available_slots: List[str] = []

class MentorshipSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    mentor_id: str
    session_type: str  # Career Guidance, Technical Review, Project Help
    topic: str
    scheduled_date: datetime
    duration_minutes: int = 60
    meeting_link: Optional[str] = None
    notes: Optional[str] = None
    student_feedback: Optional[str] = None
    mentor_feedback: Optional[str] = None
    rating: Optional[int] = None
    status: str = "Scheduled"  # Scheduled, Completed, Cancelled

# Career Pathways
class CareerPath(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    categories: List[TeenCourseCategory]
    required_courses: List[str]
    optional_courses: List[str]
    estimated_duration_months: int
    career_outcomes: List[str]
    salary_range_lkr: Dict[str, int]  # {"entry": 50000, "mid": 150000, "senior": 300000}
    job_opportunities: List[str]
    success_stories: List[Dict]

# Portfolio & Showcase
class TeenPortfolio(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    portfolio_url: str
    projects: List[str]  # Project IDs
    certifications: List[str]  # Certification IDs
    skills: List[str]
    about_me: str
    career_interests: List[str]
    github_username: Optional[str] = None
    linkedin_profile: Optional[str] = None
    personal_website: Optional[str] = None
    is_public: bool = True
    views: int = 0
    last_updated: datetime = Field(default_factory=datetime.utcnow)

# Competition & Hackathons
class Competition(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    competition_type: str  # Hackathon, Coding Contest, Innovation Challenge
    start_date: datetime
    end_date: datetime
    registration_deadline: datetime
    max_participants: int
    current_participants: int = 0
    prizes: List[Dict]  # [{"position": "1st", "prize": "LKR 50,000", "additional": "Internship"}]
    rules: List[str]
    judging_criteria: List[str]
    sponsors: List[str] = []
    is_team_competition: bool = True
    max_team_size: int = 4

class CompetitionParticipation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    competition_id: str
    team_name: str
    team_members: List[str]  # Student IDs
    team_leader_id: str
    project_title: Optional[str] = None
    project_description: Optional[str] = None
    submission_url: Optional[str] = None
    github_repo: Optional[str] = None
    demo_video: Optional[str] = None
    final_score: Optional[float] = None
    ranking: Optional[int] = None
    awards: List[str] = []
    registered_at: datetime = Field(default_factory=datetime.utcnow)

# Teen-specific Progress Tracking
class TeenProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    course_id: Optional[str] = None
    module_completed: int = 0
    total_modules: int
    completion_percentage: float
    time_spent_hours: float
    projects_submitted: int
    coding_challenges_solved: int
    last_accessed: datetime = Field(default_factory=datetime.utcnow)
    performance_analytics: Dict[str, Any] = {}

# Response Models
class TeenDashboardData(BaseModel):
    user: TeenUser
    enrolled_courses: List[TeenCourse]
    recent_projects: List[TeenProject]
    upcoming_sessions: List[MentorshipSession]
    coding_challenge_stats: Dict[str, int]
    career_progress: Dict[str, Any]
    certifications: List[TeenCertificationEarned]
    portfolio_stats: Dict[str, int]

class TeenStats(BaseModel):
    total_students: int
    active_courses: int
    projects_completed: int
    certifications_issued: int
    average_completion_rate: float
    top_performers: List[Dict]
    career_placements: int