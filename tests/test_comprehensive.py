#!/usr/bin/env python3
"""
Comprehensive Testing Suite for TEC Future-Ready Learning Platform
Tests all major functionality while user is at lunch
"""
import pytest
import asyncio
import httpx
import sys
import os

# Add backend to path for imports
sys.path.append('/app/backend')

from fastapi.testclient import TestClient
from server import app

class TestTECPlatform:
    """Comprehensive test suite for TEC platform"""
    
    def setup_method(self):
        """Setup test client"""
        self.client = TestClient(app)
        self.base_url = "http://localhost:8001/api"
        
        # Test user credentials
        self.admin_credentials = {
            "email": "admin@tecaikids.com",
            "password": "admin123"
        }
        
        self.student_credentials = {
            "email": "student@tecaikids.com", 
            "password": "student123"
        }
    
    def test_api_health_check(self):
        """Test basic API connectivity"""
        response = self.client.get("/api/")
        assert response.status_code == 200
        data = response.json()
        assert "TEC Future-Ready Learning Platform" in data["message"]
        assert "42 Years of Educational Excellence" in data["legacy"]
        print("✅ API Health Check: PASSED")
    
    def test_user_authentication_flow(self):
        """Test complete user authentication system"""
        # Test student login
        response = self.client.post("/api/login", json=self.student_credentials)
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        
        student_token = data["access_token"]
        
        # Test admin login
        response = self.client.post("/api/login", json=self.admin_credentials)
        assert response.status_code == 200
        
        admin_token = response.json()["access_token"]
        
        # Test protected endpoint access
        headers = {"Authorization": f"Bearer {student_token}"}
        response = self.client.get("/api/achievements/user", headers=headers)
        assert response.status_code == 200
        
        print("✅ User Authentication: PASSED")
        return student_token, admin_token
    
    def test_subscription_system(self):
        """Test subscription and payment system"""
        # Test getting subscription packages
        response = self.client.get("/api/subscription/packages")
        assert response.status_code == 200
        
        packages = response.json()
        assert "foundation_monthly" in packages
        assert "development_monthly" in packages
        assert "mastery_monthly" in packages
        
        # Verify age group standardization (5-8, 9-12, 13-16)
        foundation = packages["foundation_monthly"]
        assert "5-8" in foundation["age_group"]
        
        development = packages["development_monthly"]
        assert "9-12" in development["age_group"]
        
        mastery = packages["mastery_monthly"]
        assert "13-16" in development["age_group"]
        
        print("✅ Subscription System: PASSED")
    
    def test_achievements_system(self):
        """Test achievement system functionality"""
        student_token, _ = self.test_user_authentication_flow()
        headers = {"Authorization": f"Bearer {student_token}"}
        
        # Test getting all achievements
        response = self.client.get("/api/achievements", headers=headers)
        assert response.status_code == 200
        
        achievements = response.json()
        assert len(achievements) >= 10  # Should have all achievements
        
        # Verify achievement structure
        first_achievement = achievements[0]
        required_fields = ["id", "title", "description", "icon", "points", "achievement_type"]
        for field in required_fields:
            assert field in first_achievement
        
        # Test user achievements
        response = self.client.get("/api/achievements/user", headers=headers)
        assert response.status_code == 200
        
        print("✅ Achievements System: PASSED")
    
    def test_workouts_system(self):
        """Test logical thinking workouts"""
        student_token, _ = self.test_user_authentication_flow()
        headers = {"Authorization": f"Bearer {student_token}"}
        
        # Test getting workouts
        response = self.client.get("/api/workouts", headers=headers)
        assert response.status_code == 200
        
        workouts = response.json()
        assert len(workouts) >= 10  # Should have enhanced workouts
        
        # Verify workout structure
        if workouts:
            workout = workouts[0]
            required_fields = ["id", "title", "description", "difficulty", "learning_level"]
            for field in required_fields:
                assert field in workout
        
        print("✅ Workouts System: PASSED")
    
    def test_quiz_system(self):
        """Test interactive quiz system"""
        student_token, _ = self.test_user_authentication_flow()
        headers = {"Authorization": f"Bearer {student_token}"}
        
        # Test getting quizzes
        response = self.client.get("/api/quizzes", headers=headers)
        assert response.status_code == 200
        
        quizzes = response.json()
        assert isinstance(quizzes, list)
        
        print("✅ Quiz System: PASSED")
    
    def test_enrollment_system(self):
        """Test NINA enrollment integration"""
        # Test enrollment programs
        response = self.client.get("/api/enrollment/programs")
        assert response.status_code == 200
        
        data = response.json()
        assert "programs" in data
        programs = data["programs"]
        
        # Should have 3 programs now (standardized age groups)
        assert len(programs) == 3
        
        # Verify age group standardization
        age_ranges = [prog["age_range"] for prog in programs]
        expected_ranges = ["5-8 years", "9-12 years", "13-16 years"]
        
        for expected in expected_ranges:
            assert any(expected in age_range for age_range in age_ranges)
        
        # Test enrollment submission
        enrollment_data = {
            "childName": "Test Child",
            "parentName": "Test Parent",
            "email": "test@example.com",
            "phone": "0712345678",
            "childAge": "8",
            "selectedProgram": "foundation_monthly",
            "parentMessage": "Test enrollment"
        }
        
        response = self.client.post("/api/enrollment/submit", json=enrollment_data)
        assert response.status_code == 200
        
        result = response.json()
        assert result["success"] == True
        
        print("✅ Enrollment System: PASSED")
    
    def test_courses_system(self):
        """Test course management system"""
        student_token, _ = self.test_user_authentication_flow()
        headers = {"Authorization": f"Bearer {student_token}"}
        
        # Test getting courses
        response = self.client.get("/api/courses", headers=headers)
        assert response.status_code == 200
        
        courses = response.json()
        assert isinstance(courses, list)
        assert len(courses) >= 7  # Should have enhanced courses
        
        print("✅ Courses System: PASSED")
    
    def test_progress_tracking(self):
        """Test comprehensive progress tracking"""
        student_token, _ = self.test_user_authentication_flow()
        headers = {"Authorization": f"Bearer {student_token}"}
        
        # Test comprehensive progress
        response = self.client.get("/api/progress/comprehensive", headers=headers)
        assert response.status_code == 200
        
        progress = response.json()
        required_sections = ["workout_progress", "quiz_performance", "achievements", "overall_stats"]
        for section in required_sections:
            assert section in progress
        
        print("✅ Progress Tracking: PASSED")
    
    def test_security_validations(self):
        """Test security measures"""
        # Test invalid login attempts
        invalid_credentials = {
            "email": "invalid@test.com",
            "password": "wrongpassword"
        }
        
        response = self.client.post("/api/login", json=invalid_credentials)
        assert response.status_code == 401
        
        # Test malformed requests
        response = self.client.post("/api/login", json={"invalid": "data"})
        assert response.status_code == 422  # Validation error
        
        print("✅ Security Validations: PASSED")
    
    def test_age_group_consistency(self):
        """Test age group standardization across platform"""
        # Test subscription packages
        response = self.client.get("/api/subscription/packages")
        subscription_ages = []
        
        if response.status_code == 200:
            packages = response.json()
            for package in packages.values():
                subscription_ages.append(package["age_group"])
        
        # Test enrollment programs  
        response = self.client.get("/api/enrollment/programs")
        enrollment_ages = []
        
        if response.status_code == 200:
            data = response.json()
            for program in data["programs"]:
                enrollment_ages.append(program["age_range"])
        
        # Verify consistency (should all use 5-8, 9-12, 13-16)
        expected_ages = ["5-8", "9-12", "13-16"]
        
        for age_group in subscription_ages:
            assert any(expected in age_group for expected in expected_ages)
        
        for age_range in enrollment_ages:
            assert any(expected in age_range for expected in expected_ages)
        
        print("✅ Age Group Consistency: PASSED")

def run_comprehensive_tests():
    """Run all comprehensive tests"""
    print("\n🚀 Starting Comprehensive TEC Platform Testing...")
    print("=" * 60)
    
    try:
        # Initialize test suite
        test_suite = TestTECPlatform()
        test_suite.setup_method()
        
        # Run all tests
        test_methods = [
            test_suite.test_api_health_check,
            test_suite.test_user_authentication_flow,
            test_suite.test_subscription_system,
            test_suite.test_achievements_system,
            test_suite.test_workouts_system,
            test_suite.test_quiz_system,
            test_suite.test_enrollment_system,
            test_suite.test_courses_system,
            test_suite.test_progress_tracking,
            test_suite.test_security_validations,
            test_suite.test_age_group_consistency
        ]
        
        passed_tests = 0
        failed_tests = 0
        
        for test_method in test_methods:
            try:
                test_method()
                passed_tests += 1
            except Exception as e:
                print(f"❌ {test_method.__name__}: FAILED - {str(e)}")
                failed_tests += 1
        
        print("=" * 60)
        print(f"📊 Test Results Summary:")
        print(f"   ✅ Passed: {passed_tests}")
        print(f"   ❌ Failed: {failed_tests}")
        print(f"   📈 Success Rate: {(passed_tests/(passed_tests+failed_tests)*100):.1f}%")
        
        if failed_tests == 0:
            print("\n🎉 ALL TESTS PASSED! TEC Platform is fully functional! 🎉")
        else:
            print(f"\n⚠️ {failed_tests} tests need attention")
        
        return passed_tests, failed_tests
        
    except Exception as e:
        print(f"💥 Testing suite failed to initialize: {e}")
        return 0, 1

if __name__ == "__main__":
    run_comprehensive_tests()