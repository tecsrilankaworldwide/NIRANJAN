# Security Enhancements for TEC Platform
import hashlib
import secrets
import re
from typing import Optional, List
import logging
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

logger = logging.getLogger(__name__)

class SecurityValidator:
    """Enhanced security validation for user inputs and operations"""
    
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
    def validate_email(self, email: str) -> bool:
        """Enhanced email validation"""
        if not email or len(email) > 254:
            return False
            
        # Basic email regex
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return False
            
        # Check for suspicious patterns
        suspicious_patterns = [
            r'\.{2,}',  # Multiple consecutive dots
            r'^\.|\.$',  # Starts or ends with dot
            r'@.*@',  # Multiple @ symbols
        ]
        
        for pattern in suspicious_patterns:
            if re.search(pattern, email):
                return False
                
        return True
    
    def validate_password_strength(self, password: str) -> tuple[bool, List[str]]:
        """Comprehensive password strength validation"""
        issues = []
        
        if len(password) < 8:
            issues.append("Password must be at least 8 characters long")
            
        if len(password) > 128:
            issues.append("Password must be less than 128 characters")
            
        if not re.search(r'[a-z]', password):
            issues.append("Password must contain at least one lowercase letter")
            
        if not re.search(r'[A-Z]', password):
            issues.append("Password must contain at least one uppercase letter")
            
        if not re.search(r'\d', password):
            issues.append("Password must contain at least one number")
            
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            issues.append("Password must contain at least one special character")
            
        # Check for common weak patterns
        weak_patterns = [
            r'123456',
            r'password',
            r'qwerty',
            r'admin',
            r'(.)\1{3,}',  # Repeated characters
        ]
        
        for pattern in weak_patterns:
            if re.search(pattern, password, re.IGNORECASE):
                issues.append("Password contains common weak patterns")
                break
                
        return len(issues) == 0, issues
    
    def sanitize_input(self, input_str: str) -> str:
        """Sanitize user input to prevent injection attacks"""
        if not input_str:
            return ""
            
        # Remove potentially dangerous characters
        sanitized = re.sub(r'[<>"\']', '', input_str)
        
        # Limit length
        sanitized = sanitized[:1000]
        
        # Remove excessive whitespace
        sanitized = re.sub(r'\s+', ' ', sanitized).strip()
        
        return sanitized
    
    def validate_age_input(self, age_input: str) -> bool:
        """Validate age input"""
        try:
            age = int(age_input)
            return 4 <= age <= 18  # Valid age range for TEC platform
        except ValueError:
            return False
    
    def validate_phone_number(self, phone: str) -> bool:
        """Validate Sri Lankan phone number format"""
        if not phone:
            return True  # Phone is optional
            
        # Clean phone number
        clean_phone = re.sub(r'[^\d+]', '', phone)
        
        # Sri Lankan phone patterns
        patterns = [
            r'^\+94[17]\d{8}$',  # +94 7XXXXXXXX or +94 1XXXXXXXX
            r'^0[17]\d{8}$',     # 07XXXXXXXX or 01XXXXXXXX
            r'^[17]\d{8}$',      # 7XXXXXXXX or 1XXXXXXXX
        ]
        
        for pattern in patterns:
            if re.match(pattern, clean_phone):
                return True
                
        return False

class SessionManager:
    """Secure session management"""
    
    def __init__(self, secret_key: str):
        self.secret_key = secret_key
        self.active_sessions = {}
        self.blacklisted_tokens = set()
        
    def create_secure_token(self, user_data: dict, expires_delta: timedelta = None) -> str:
        """Create secure JWT token with additional security"""
        if expires_delta is None:
            expires_delta = timedelta(hours=24)
            
        # Add security claims
        payload = {
            **user_data,
            "exp": datetime.utcnow() + expires_delta,
            "iat": datetime.utcnow(),
            "jti": secrets.token_hex(16),  # Unique token ID
            "aud": "tecaikids.com",  # Audience
            "iss": "TEC Platform"  # Issuer
        }
        
        token = jwt.encode(payload, self.secret_key, algorithm="HS256")
        
        # Store session
        self.active_sessions[payload["jti"]] = {
            "user_id": user_data.get("sub"),
            "created_at": datetime.utcnow(),
            "last_used": datetime.utcnow()
        }
        
        return token
    
    def verify_token(self, token: str) -> Optional[dict]:
        """Verify JWT token with additional security checks"""
        try:
            # Check if token is blacklisted
            if token in self.blacklisted_tokens:
                return None
                
            # Decode token
            payload = jwt.decode(
                token, 
                self.secret_key, 
                algorithms=["HS256"],
                audience="tecaikids.com",
                issuer="TEC Platform"
            )
            
            # Check if session exists
            jti = payload.get("jti")
            if jti not in self.active_sessions:
                return None
                
            # Update last used time
            self.active_sessions[jti]["last_used"] = datetime.utcnow()
            
            return payload
            
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {e}")
            return None
    
    def revoke_token(self, token: str):
        """Revoke/blacklist a token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=["HS256"])
            jti = payload.get("jti")
            
            # Add to blacklist
            self.blacklisted_tokens.add(token)
            
            # Remove from active sessions
            if jti in self.active_sessions:
                del self.active_sessions[jti]
                
        except jwt.InvalidTokenError:
            pass  # Token already invalid
    
    def cleanup_expired_sessions(self):
        """Clean up expired sessions"""
        current_time = datetime.utcnow()
        expired_sessions = []
        
        for jti, session in self.active_sessions.items():
            # Remove sessions inactive for more than 7 days
            if (current_time - session["last_used"]).days > 7:
                expired_sessions.append(jti)
        
        for jti in expired_sessions:
            del self.active_sessions[jti]
        
        logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")

class AuditLogger:
    """Security audit logging"""
    
    def __init__(self, db):
        self.db = db
        
    async def log_security_event(self, event_type: str, user_id: str = None, 
                                 ip_address: str = None, details: dict = None):
        """Log security-related events"""
        try:
            security_log = {
                "id": secrets.token_hex(16),
                "event_type": event_type,
                "user_id": user_id,
                "ip_address": ip_address,
                "details": details or {},
                "timestamp": datetime.utcnow(),
                "severity": self._get_severity(event_type)
            }
            
            await self.db.security_logs.insert_one(security_log)
            
            # Log critical events to application logs too
            if security_log["severity"] == "critical":
                logger.critical(f"Security Event: {event_type} - User: {user_id} - IP: {ip_address}")
                
        except Exception as e:
            logger.error(f"Failed to log security event: {e}")
    
    def _get_severity(self, event_type: str) -> str:
        """Determine event severity"""
        critical_events = [
            "multiple_failed_login_attempts",
            "suspicious_payment_activity", 
            "unauthorized_admin_access",
            "data_breach_attempt"
        ]
        
        high_events = [
            "failed_login_attempt",
            "password_reset_request",
            "account_lockout",
            "suspicious_api_usage"
        ]
        
        if event_type in critical_events:
            return "critical"
        elif event_type in high_events:
            return "high"
        else:
            return "medium"

class DataEncryption:
    """Additional data encryption utilities"""
    
    @staticmethod
    def hash_sensitive_data(data: str) -> str:
        """Hash sensitive data that doesn't need to be reversed"""
        return hashlib.sha256(data.encode()).hexdigest()
    
    @staticmethod
    def generate_csrf_token() -> str:
        """Generate CSRF token"""
        return secrets.token_hex(32)
    
    @staticmethod
    def constant_time_compare(a: str, b: str) -> bool:
        """Constant time string comparison to prevent timing attacks"""
        return secrets.compare_digest(a.encode(), b.encode())

# Security middleware functions
def get_client_ip(request) -> str:
    """Extract client IP address safely"""
    # Check for forwarded IP (behind proxy)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    # Check for real IP (some proxies)
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fall back to direct client
    return getattr(request.client, 'host', 'unknown')

def detect_suspicious_activity(request_history: List[dict]) -> bool:
    """Detect patterns that might indicate suspicious activity"""
    if len(request_history) < 10:
        return False
    
    # Check for rapid requests (more than 10 requests in 1 minute)
    recent_requests = [
        req for req in request_history 
        if (datetime.utcnow() - req["timestamp"]).seconds < 60
    ]
    
    if len(recent_requests) > 10:
        return True
    
    # Check for failed login attempts
    failed_logins = [
        req for req in request_history
        if req.get("endpoint") == "login" and not req.get("success", True)
    ]
    
    if len(failed_logins) >= 5:
        return True
    
    return False

# Global security instances
security_validator = SecurityValidator()
audit_logger = None  # Will be initialized with database