# Performance Optimizations for TEC Platform
import asyncio
from functools import wraps
from typing import Dict, Any
import time
import logging
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

class PerformanceMonitor:
    """Monitor and optimize platform performance"""
    
    def __init__(self):
        self.request_times = []
        self.slow_queries = []
        
    def timing_decorator(self, operation_name: str):
        """Decorator to monitor function execution time"""
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                start_time = time.time()
                result = await func(*args, **kwargs)
                end_time = time.time()
                
                execution_time = end_time - start_time
                self.request_times.append({
                    'operation': operation_name,
                    'time': execution_time,
                    'timestamp': time.time()
                })
                
                if execution_time > 2.0:  # Log slow operations
                    logger.warning(f"Slow operation: {operation_name} took {execution_time:.2f}s")
                    self.slow_queries.append({
                        'operation': operation_name,
                        'time': execution_time,
                        'args': str(args)[:100] if args else None
                    })
                
                return result
            return wrapper
        return decorator

class DatabaseOptimizer:
    """Database query optimizations"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        
    async def create_indexes(self):
        """Create database indexes for better performance"""
        try:
            # Users collection indexes
            await self.db.users.create_index("email", unique=True)
            await self.db.users.create_index("role")
            await self.db.users.create_index("learning_level")
            await self.db.users.create_index("subscription_expires")
            
            # Workouts collection indexes  
            await self.db.logical_workouts.create_index("difficulty")
            await self.db.logical_workouts.create_index("learning_level")
            await self.db.logical_workouts.create_index("age_group")
            await self.db.logical_workouts.create_index("workout_type")
            await self.db.logical_workouts.create_index("is_active")
            
            # Workout attempts indexes
            await self.db.workout_attempts.create_index("student_id")
            await self.db.workout_attempts.create_index("workout_id")
            await self.db.workout_attempts.create_index([("student_id", 1), ("created_at", -1)])
            
            # Courses collection indexes
            await self.db.courses.create_index("learning_level")
            await self.db.courses.create_index("is_published")
            await self.db.courses.create_index("is_premium")
            
            # Achievements indexes
            await self.db.user_achievements.create_index("user_id")
            await self.db.user_achievements.create_index([("user_id", 1), ("earned_at", -1)])
            
            # Payment transactions indexes
            await self.db.payment_transactions.create_index("user_id")
            await self.db.payment_transactions.create_index("session_id", unique=True)
            await self.db.payment_transactions.create_index("payment_status")
            
            # Activity logs indexes
            await self.db.activity_logs.create_index("user_id")
            await self.db.activity_logs.create_index([("timestamp", -1)])
            await self.db.activity_logs.create_index("activity_type")
            
            logger.info("Database indexes created successfully")
            
        except Exception as e:
            logger.error(f"Failed to create indexes: {e}")

class CacheManager:
    """Simple in-memory caching for frequently accessed data"""
    
    def __init__(self):
        self.cache = {}
        self.cache_timestamps = {}
        self.cache_ttl = 300  # 5 minutes TTL
        
    def get(self, key: str):
        """Get cached value"""
        if key in self.cache:
            if time.time() - self.cache_timestamps[key] < self.cache_ttl:
                return self.cache[key]
            else:
                # Expired
                del self.cache[key]
                del self.cache_timestamps[key]
        return None
        
    def set(self, key: str, value: Any):
        """Set cached value"""
        self.cache[key] = value
        self.cache_timestamps[key] = time.time()
        
    def clear_expired(self):
        """Clear expired cache entries"""
        current_time = time.time()
        expired_keys = [
            key for key, timestamp in self.cache_timestamps.items()
            if current_time - timestamp >= self.cache_ttl
        ]
        for key in expired_keys:
            del self.cache[key]
            del self.cache_timestamps[key]

# Global instances
performance_monitor = PerformanceMonitor()
cache_manager = CacheManager()

async def optimize_user_queries(db: AsyncIOMotorDatabase):
    """Optimize common user queries"""
    # Create compound indexes for common query patterns
    try:
        # User authentication queries
        await db.users.create_index([("email", 1), ("is_active", 1)])
        
        # Student progress queries
        await db.workout_attempts.create_index([
            ("student_id", 1), 
            ("is_correct", 1), 
            ("created_at", -1)
        ])
        
        # Subscription status queries
        await db.users.create_index([
            ("subscription_type", 1), 
            ("subscription_expires", 1)
        ])
        
        logger.info("User query optimizations applied")
        
    except Exception as e:
        logger.error(f"Failed to optimize user queries: {e}")

def cached_response(cache_key_func):
    """Decorator for caching API responses"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = cache_key_func(*args, **kwargs)
            
            # Check cache
            cached_result = cache_manager.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            cache_manager.set(cache_key, result)
            
            return result
        return wrapper
    return decorator

async def cleanup_old_data(db: AsyncIOMotorDatabase):
    """Clean up old unnecessary data"""
    try:
        # Delete old activity logs (older than 90 days)
        cutoff_date = time.time() - (90 * 24 * 60 * 60)  # 90 days ago
        
        result = await db.activity_logs.delete_many({
            "timestamp": {"$lt": cutoff_date}
        })
        
        logger.info(f"Cleaned up {result.deleted_count} old activity logs")
        
        # Delete failed workout attempts older than 30 days
        cutoff_date_30 = time.time() - (30 * 24 * 60 * 60)  # 30 days ago
        
        result = await db.workout_attempts.delete_many({
            "created_at": {"$lt": cutoff_date_30},
            "is_correct": False,
            "score": {"$lt": 50}  # Only delete poor attempts
        })
        
        logger.info(f"Cleaned up {result.deleted_count} old failed attempts")
        
    except Exception as e:
        logger.error(f"Failed to clean up old data: {e}")

class RequestRateLimiter:
    """Simple rate limiting for API endpoints"""
    
    def __init__(self):
        self.requests = {}
        self.window_size = 60  # 1 minute window
        self.max_requests = 100  # Max requests per window
        
    def is_allowed(self, client_ip: str) -> bool:
        """Check if request is allowed for this IP"""
        current_time = time.time()
        
        if client_ip not in self.requests:
            self.requests[client_ip] = []
        
        # Clean old requests
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if current_time - req_time < self.window_size
        ]
        
        # Check limit
        if len(self.requests[client_ip]) >= self.max_requests:
            return False
        
        # Add current request
        self.requests[client_ip].append(current_time)
        return True

# Global rate limiter
rate_limiter = RequestRateLimiter()