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

class Progress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    course_id: str
    progress_percentage: float = Field(ge=0, le=100)
    completed_lessons: List[str] = []
    last_accessed: datetime = Field(default_factory=datetime.utcnow)
    certificates_earned: List[str] = []

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
