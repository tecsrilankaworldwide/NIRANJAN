from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import hashlib
import jwt
from enum import Enum
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DELTA = timedelta(days=7)

# Create the main app without a prefix
app = FastAPI(title="TecAI Kids Educational Platform API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Enums
class UserRole(str, Enum):
    STUDENT = "student"
    PARENT = "parent"
    TEACHER = "teacher"
    ADMIN = "admin"

class AgeGroup(str, Enum):
    EARLY = "5-8"  # Early elementary
    LATE = "9-12"  # Late elementary  
    TEEN = "13-16" # Middle/High school

# Models
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: UserRole
    age_group: Optional[AgeGroup] = None  # Only for students
    phone: Optional[str] = None
    parent_email: Optional[EmailStr] = None  # For students, link to parent

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    is_active: bool = True
    subscription_status: str = "free"  # free, paid, expired
    
class User(UserResponse):
    password_hash: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class CourseCreate(BaseModel):
    title: str
    description: str
    age_groups: List[AgeGroup]
    difficulty_level: int = Field(ge=1, le=5)  # 1-5 difficulty scale

class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    age_groups: List[AgeGroup]
    created_by: str  # Teacher ID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    difficulty_level: int = Field(ge=1, le=5)  # 1-5 difficulty scale

class LessonType(str, Enum):
    TUTORIAL = "tutorial"
    CODING = "coding"
    QUIZ = "quiz"
    CHALLENGE = "challenge"

class Lesson(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    course_id: str
    title: str
    description: str
    content: str  # HTML/Markdown content
    lesson_type: LessonType
    order_index: int  # Order within the course
    coding_template: Optional[str] = None  # For coding lessons
    expected_output: Optional[str] = None  # For coding validation
    quiz_questions: Optional[List[dict]] = None  # For quiz lessons
    points: int = Field(default=10)  # Points awarded for completion
    estimated_duration: int = Field(default=15)  # Minutes
    is_active: bool = True

class LessonCreate(BaseModel):
    title: str
    description: str
    content: str
    lesson_type: LessonType
    order_index: int
    coding_template: Optional[str] = None
    expected_output: Optional[str] = None
    quiz_questions: Optional[List[dict]] = None
    points: int = Field(default=10)
    estimated_duration: int = Field(default=15)

class LessonProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    lesson_id: str
    course_id: str
    completed: bool = False
    score: Optional[float] = None  # Quiz score or coding challenge score
    attempts: int = 0
    time_spent: int = 0  # Minutes spent
    completed_at: Optional[datetime] = None
    last_accessed: datetime = Field(default_factory=datetime.utcnow)

class Progress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    course_id: str
    progress_percentage: float = Field(ge=0, le=100)
    completed_lessons: List[str] = []
    last_accessed: datetime = Field(default_factory=datetime.utcnow)
    certificates_earned: List[str] = []
    total_points: int = 0
    current_lesson_id: Optional[str] = None

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    lesson_id: Optional[str] = None
    course_id: Optional[str] = None
    message: str
    response: str
    context_type: str = "general"  # general, lesson_help, code_help, quiz_help
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AITutorRequest(BaseModel):
    message: str
    context_type: str = "general"
    lesson_id: Optional[str] = None
    course_id: Optional[str] = None
    code_context: Optional[str] = None

class AITutorResponse(BaseModel):
    response: str
    suggestions: List[str] = []
    helpful_resources: List[str] = []

# Utility Functions
def hash_password(password: str) -> str:
    salt = "tecai-kids-salt-2024"  # In production, use random salt per user
    return hashlib.sha256((password + salt).encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + JWT_EXPIRATION_DELTA
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# Authentication Routes
@api_router.post("/auth/register", response_model=UserResponse)
async def register_user(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate parent email for students
    if user_data.role == UserRole.STUDENT and user_data.parent_email:
        parent = await db.users.find_one({"email": user_data.parent_email, "role": UserRole.PARENT})
        if not parent:
            raise HTTPException(status_code=400, detail="Parent email not found or not registered as parent")
    
    # Create user
    user_dict = user_data.dict(exclude={'password'})
    user_dict['id'] = str(uuid.uuid4())
    user_dict['password_hash'] = hash_password(user_data.password)
    user_dict['created_at'] = datetime.utcnow()
    user_dict['is_active'] = True
    user_dict['subscription_status'] = 'free'
    
    await db.users.insert_one(user_dict)
    return UserResponse(**user_dict)

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    user = await db.users.find_one({"email": login_data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(login_data.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user['is_active']:
        raise HTTPException(status_code=401, detail="Account is inactive")
    
    access_token = create_access_token(data={"sub": user['id'], "role": user['role']})
    user_response = UserResponse(**user)
    
    return LoginResponse(access_token=access_token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.dict())

# User Management Routes
@api_router.get("/users", response_model=List[UserResponse])
async def get_users(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.TEACHER]:
        raise HTTPException(status_code=403, detail="Not authorized to view users")
    
    users = await db.users.find({}, {"password_hash": 0}).to_list(1000)
    return [UserResponse(**user) for user in users]

@api_router.get("/users/students", response_model=List[UserResponse])
async def get_students(current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.PARENT:
        # Parents can only see their own children
        students = await db.users.find({"role": UserRole.STUDENT, "parent_email": current_user.email}, {"password_hash": 0}).to_list(1000)
    elif current_user.role in [UserRole.TEACHER, UserRole.ADMIN]:
        # Teachers and admins can see all students
        students = await db.users.find({"role": UserRole.STUDENT}, {"password_hash": 0}).to_list(1000)
    else:
        raise HTTPException(status_code=403, detail="Not authorized to view students")
    
    return [UserResponse(**student) for student in students]

# Course Management Routes
@api_router.post("/courses", response_model=Course)
async def create_course(course_data: CourseCreate, current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to create courses")
    
    course = Course(
        **course_data.dict(),
        created_by=current_user.id
    )
    course_dict = course.dict()
    await db.courses.insert_one(course_dict)
    return course

@api_router.get("/courses", response_model=List[Course])
async def get_courses(age_group: Optional[AgeGroup] = None):
    query = {"is_active": True}
    if age_group:
        query["age_groups"] = age_group
    
    courses = await db.courses.find(query).to_list(1000)
    return [Course(**course) for course in courses]

@api_router.get("/courses/{course_id}", response_model=Course)
async def get_course(course_id: str):
    course = await db.courses.find_one({"id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return Course(**course)

# Lesson Management Routes
@api_router.post("/courses/{course_id}/lessons", response_model=Lesson)
async def create_lesson(course_id: str, lesson_data: LessonCreate, current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to create lessons")
    
    # Verify course exists and user owns it
    course = await db.courses.find_one({"id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if current_user.role == UserRole.TEACHER and course["created_by"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this course")
    
    lesson = Lesson(
        **lesson_data.dict(),
        course_id=course_id
    )
    lesson_dict = lesson.dict()
    await db.lessons.insert_one(lesson_dict)
    return lesson

@api_router.get("/courses/{course_id}/lessons", response_model=List[Lesson])
async def get_course_lessons(course_id: str):
    lessons = await db.lessons.find({"course_id": course_id, "is_active": True}).sort("order_index", 1).to_list(1000)
    return [Lesson(**lesson) for lesson in lessons]

@api_router.get("/lessons/{lesson_id}", response_model=Lesson)
async def get_lesson(lesson_id: str):
    lesson = await db.lessons.find_one({"id": lesson_id})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return Lesson(**lesson)

@api_router.put("/lessons/{lesson_id}", response_model=Lesson)
async def update_lesson(lesson_id: str, lesson_data: LessonCreate, current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to update lessons")
    
    lesson = await db.lessons.find_one({"id": lesson_id})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Verify user owns the course
    if current_user.role == UserRole.TEACHER:
        course = await db.courses.find_one({"id": lesson["course_id"]})
        if course and course["created_by"] != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to modify this lesson")
    
    await db.lessons.update_one(
        {"id": lesson_id},
        {"$set": lesson_data.dict()}
    )
    
    updated_lesson = await db.lessons.find_one({"id": lesson_id})
    return Lesson(**updated_lesson)

# Lesson Progress Routes
@api_router.post("/lessons/{lesson_id}/progress", response_model=LessonProgress)
async def update_lesson_progress(
    lesson_id: str, 
    completed: bool = False,
    score: Optional[float] = None,
    time_spent: int = 0,
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can update lesson progress")
    
    lesson = await db.lessons.find_one({"id": lesson_id})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Check if progress already exists
    existing_progress = await db.lesson_progress.find_one({
        "student_id": current_user.id,
        "lesson_id": lesson_id
    })
    
    if existing_progress:
        # Update existing progress
        update_data = {
            "last_accessed": datetime.utcnow(),
            "attempts": existing_progress["attempts"] + 1,
            "time_spent": existing_progress["time_spent"] + time_spent
        }
        
        if completed:
            update_data["completed"] = True
            update_data["completed_at"] = datetime.utcnow()
        
        if score is not None:
            update_data["score"] = score
        
        await db.lesson_progress.update_one(
            {"student_id": current_user.id, "lesson_id": lesson_id},
            {"$set": update_data}
        )
        
        updated_progress = await db.lesson_progress.find_one({
            "student_id": current_user.id,
            "lesson_id": lesson_id
        })
        lesson_progress = LessonProgress(**updated_progress)
    else:
        # Create new progress
        lesson_progress = LessonProgress(
            student_id=current_user.id,
            lesson_id=lesson_id,
            course_id=lesson["course_id"],
            completed=completed,
            score=score,
            attempts=1,
            time_spent=time_spent,
            completed_at=datetime.utcnow() if completed else None
        )
        await db.lesson_progress.insert_one(lesson_progress.dict())
    
    # Update overall course progress
    await update_course_progress(current_user.id, lesson["course_id"])
    
    return lesson_progress

@api_router.get("/courses/{course_id}/progress", response_model=List[LessonProgress])
async def get_course_lesson_progress(course_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.STUDENT:
        student_id = current_user.id
    else:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    progress_records = await db.lesson_progress.find({
        "student_id": student_id,
        "course_id": course_id
    }).to_list(1000)
    
    return [LessonProgress(**record) for record in progress_records]

async def update_course_progress(student_id: str, course_id: str):
    """Helper function to update overall course progress based on lesson completion"""
    # Get all lessons for the course
    lessons = await db.lessons.find({"course_id": course_id, "is_active": True}).to_list(1000)
    total_lessons = len(lessons)
    
    if total_lessons == 0:
        return
    
    # Get completed lessons
    completed_lessons = await db.lesson_progress.find({
        "student_id": student_id,
        "course_id": course_id,
        "completed": True
    }).to_list(1000)
    
    completed_count = len(completed_lessons)
    progress_percentage = (completed_count / total_lessons) * 100
    
    # Calculate total points
    total_points = sum([lesson["points"] for lesson in lessons if any(
        cp["lesson_id"] == lesson["id"] for cp in completed_lessons
    )])
    
    # Update or create course progress
    existing_progress = await db.progress.find_one({
        "student_id": student_id,
        "course_id": course_id
    })
    
    if existing_progress:
        await db.progress.update_one(
            {"student_id": student_id, "course_id": course_id},
            {
                "$set": {
                    "progress_percentage": progress_percentage,
                    "completed_lessons": [cp["lesson_id"] for cp in completed_lessons],
                    "total_points": total_points,
                    "last_accessed": datetime.utcnow()
                }
            }
        )
    else:
        progress = Progress(
            student_id=student_id,
            course_id=course_id,
            progress_percentage=progress_percentage,
            completed_lessons=[cp["lesson_id"] for cp in completed_lessons],
            total_points=total_points
        )
        await db.progress.insert_one(progress.dict())

# AI Tutoring Routes
@api_router.post("/ai-tutor", response_model=AITutorResponse)
async def ai_tutor_chat(request: AITutorRequest, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="AI tutoring is available for students only")
    
    try:
        # Get context information if provided
        context_info = ""
        
        if request.lesson_id:
            lesson = await db.lessons.find_one({"id": request.lesson_id})
            if lesson:
                context_info += f"Current lesson: {lesson['title']} - {lesson['description']}\\n"
                context_info += f"Lesson content: {lesson['content'][:500]}...\\n"
        
        if request.course_id:
            course = await db.courses.find_one({"id": request.course_id})
            if course:
                context_info += f"Course: {course['title']} - {course['description']}\\n"
        
        # Create age-appropriate system message
        age_group = current_user.age_group or "9-12"
        
        system_message = f"""You are TecAI, a friendly AI tutor for kids aged {age_group}. Your role is to help students learn programming and technology in a fun, encouraging way.

Guidelines:
- Use simple, age-appropriate language
- Be encouraging and positive
- Break down complex concepts into small steps
- Use analogies and examples kids can relate to
- Ask questions to check understanding
- Provide hints rather than direct answers for coding problems
- Make learning fun with emojis and engaging explanations

Context: {context_info}

Always remember you're talking to a {age_group} year old student."""

        # Initialize chat
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=f"student_{current_user.id}_{request.context_type}",
            system_message=system_message
        ).with_model("gemini", "gemini-2.0-flash")
        
        # Prepare user message with context
        user_message_text = request.message
        if request.code_context:
            user_message_text += f"\\n\\nMy code: {request.code_context}"
        
        user_message = UserMessage(text=user_message_text)
        
        # Get AI response
        ai_response = await chat.send_message(user_message)
        
        # Generate suggestions based on context
        suggestions = []
        helpful_resources = []
        
        if request.context_type == "code_help":
            suggestions = [
                "Try running your code step by step",
                "Check for typos in your code",
                "Make sure your indentation is correct",
                "Test with simple examples first"
            ]
        elif request.context_type == "lesson_help":
            suggestions = [
                "Review the lesson content again",
                "Try the examples in the lesson",
                "Ask me specific questions about concepts",
                "Practice with similar problems"
            ]
        elif request.context_type == "quiz_help":
            suggestions = [
                "Read each question carefully",
                "Think about what you learned in the lesson",
                "Eliminate answers you know are wrong",
                "Take your time to think through each option"
            ]
        
        # Save chat message to database
        chat_message = ChatMessage(
            student_id=current_user.id,
            lesson_id=request.lesson_id,
            course_id=request.course_id,
            message=request.message,
            response=ai_response,
            context_type=request.context_type
        )
        await db.chat_messages.insert_one(chat_message.dict())
        
        return AITutorResponse(
            response=ai_response,
            suggestions=suggestions,
            helpful_resources=helpful_resources
        )
        
    except Exception as e:
        logger.error(f"AI tutoring error: {str(e)}")
        raise HTTPException(status_code=500, detail="AI tutoring service is temporarily unavailable")

@api_router.get("/ai-tutor/history")
async def get_chat_history(
    lesson_id: Optional[str] = None,
    course_id: Optional[str] = None,
    limit: int = 20,
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Chat history is available for students only")
    
    query = {"student_id": current_user.id}
    if lesson_id:
        query["lesson_id"] = lesson_id
    if course_id:
        query["course_id"] = course_id
    
    messages = await db.chat_messages.find(query).sort("created_at", -1).limit(limit).to_list(limit)
    return [ChatMessage(**msg) for msg in messages]

@api_router.post("/ai-tutor/personalized-recommendations")
async def get_personalized_recommendations(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Recommendations are available for students only")
    
    try:
        # Get student's progress data
        progress_records = await db.progress.find({"student_id": current_user.id}).to_list(1000)
        lesson_progress = await db.lesson_progress.find({"student_id": current_user.id}).to_list(1000)
        
        # Analyze learning patterns
        total_courses = len(progress_records)
        completed_lessons = len([lp for lp in lesson_progress if lp.get("completed", False)])
        avg_score = sum([lp.get("score", 0) for lp in lesson_progress if lp.get("score")]) / max(len(lesson_progress), 1)
        
        # Get available courses for student's age group
        available_courses = await db.courses.find({
            "age_groups": current_user.age_group,
            "is_active": True
        }).to_list(1000)
        
        # Create personalized recommendations using AI
        system_message = f"""You are an AI learning advisor for a {current_user.age_group} year old student named {current_user.first_name}.

Student's Learning Profile:
- Enrolled in {total_courses} courses
- Completed {completed_lessons} lessons
- Average quiz score: {avg_score:.1f}%
- Learning focus: Programming and technology for kids

Available courses: {[course['title'] for course in available_courses]}

Provide 3-5 personalized learning recommendations that are encouraging and specific to their progress level. Focus on:
1. Next steps in their learning journey
2. Areas where they're doing well
3. Gentle suggestions for improvement
4. Fun challenges to keep them engaged

Keep recommendations positive, age-appropriate, and motivating."""

        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=f"recommendations_{current_user.id}",
            system_message=system_message
        ).with_model("gemini", "gemini-2.0-flash")
        
        user_message = UserMessage(text="Please provide personalized learning recommendations for me based on my progress.")
        
        recommendations = await chat.send_message(user_message)
        
        return {
            "recommendations": recommendations,
            "learning_stats": {
                "total_courses": total_courses,
                "completed_lessons": completed_lessons,
                "average_score": round(avg_score, 1),
                "available_courses": len(available_courses)
            }
        }
        
    except Exception as e:
        logger.error(f"Recommendations error: {str(e)}")
        raise HTTPException(status_code=500, detail="Recommendation service is temporarily unavailable")

# Progress Tracking Routes
@api_router.post("/progress", response_model=Progress)
async def update_progress(progress: Progress, current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.STUDENT:
        progress.student_id = current_user.id
    elif current_user.role in [UserRole.PARENT, UserRole.TEACHER, UserRole.ADMIN]:
        # Allow parents/teachers/admins to update student progress
        pass
    else:
        raise HTTPException(status_code=403, detail="Not authorized to update progress")
    
    # Update or create progress record
    existing = await db.progress.find_one({"student_id": progress.student_id, "course_id": progress.course_id})
    if existing:
        await db.progress.update_one(
            {"student_id": progress.student_id, "course_id": progress.course_id},
            {"$set": progress.dict()}
        )
    else:
        await db.progress.insert_one(progress.dict())
    
    return progress

@api_router.get("/progress/student/{student_id}", response_model=List[Progress])
async def get_student_progress(student_id: str, current_user: User = Depends(get_current_user)):
    # Authorization check
    if current_user.role == UserRole.STUDENT and current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Can only view your own progress")
    elif current_user.role == UserRole.PARENT:
        # Check if this student belongs to the parent
        student = await db.users.find_one({"id": student_id, "parent_email": current_user.email})
        if not student:
            raise HTTPException(status_code=403, detail="Not authorized to view this student's progress")
    elif current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to view progress")
    
    progress_records = await db.progress.find({"student_id": student_id}).to_list(1000)
    return [Progress(**record) for record in progress_records]

# Dashboard Data Routes
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.ADMIN:
        total_students = await db.users.count_documents({"role": UserRole.STUDENT})
        total_teachers = await db.users.count_documents({"role": UserRole.TEACHER})
        total_courses = await db.courses.count_documents({"is_active": True})
        total_parents = await db.users.count_documents({"role": UserRole.PARENT})
        
        return {
            "total_students": total_students,
            "total_teachers": total_teachers,
            "total_courses": total_courses,
            "total_parents": total_parents
        }
    elif current_user.role == UserRole.TEACHER:
        my_courses = await db.courses.count_documents({"created_by": current_user.id, "is_active": True})
        total_students = await db.users.count_documents({"role": UserRole.STUDENT})
        
        return {
            "my_courses": my_courses,
            "total_students": total_students
        }
    elif current_user.role == UserRole.PARENT:
        my_children = await db.users.count_documents({"role": UserRole.STUDENT, "parent_email": current_user.email})
        
        return {
            "my_children": my_children
        }
    elif current_user.role == UserRole.STUDENT:
        my_progress = await db.progress.count_documents({"student_id": current_user.id})
        
        return {
            "courses_enrolled": my_progress
        }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}
