#!/usr/bin/env python3
"""
TEC Future-Ready Learning Platform - Comprehensive Backend API Testing
Testing all endpoints for the complete educational platform
"""

import requests
import sys
import json
from datetime import datetime
import time

class TecPlatformTester:
    def __init__(self, base_url="https://edtech-platform-6.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details="", endpoint=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "endpoint": endpoint,
            "timestamp": datetime.now().isoformat()
        })

    def test_api_health(self):
        """Test basic API health"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log_test("API Health Check", True, f"Platform: {data.get('message', 'Unknown')}", "/")
                return True
            else:
                self.log_test("API Health Check", False, f"Status: {response.status_code}", "/")
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}", "/")
            return False

    def test_user_registration(self):
        """Test user registration"""
        try:
            # Test student registration
            test_email = f"test_student_{int(time.time())}@tecaikids.com"
            registration_data = {
                "email": test_email,
                "password": "TestPass123!",
                "full_name": "Test Student",
                "role": "student",
                "age_group": "9-12"
            }
            
            response = requests.post(f"{self.api_url}/register", json=registration_data, timeout=10)
            
            if response.status_code == 200:
                user_data = response.json()
                self.user_id = user_data.get('id')
                self.log_test("User Registration", True, f"User ID: {self.user_id}", "/register")
                return True
            else:
                self.log_test("User Registration", False, f"Status: {response.status_code}, Response: {response.text}", "/register")
                return False
                
        except Exception as e:
            self.log_test("User Registration", False, f"Error: {str(e)}", "/register")
            return False

    def test_user_login(self):
        """Test user login with test credentials"""
        try:
            # Try with provided test credentials
            login_data = {
                "email": "student@tecaikids.com",
                "password": "student123"
            }
            
            response = requests.post(f"{self.api_url}/login", json=login_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('access_token')
                user = data.get('user', {})
                self.user_id = user.get('id')
                self.log_test("User Login", True, f"Token received, User: {user.get('full_name')}", "/login")
                return True
            else:
                self.log_test("User Login", False, f"Status: {response.status_code}, Response: {response.text}", "/login")
                return False
                
        except Exception as e:
            self.log_test("User Login", False, f"Error: {str(e)}", "/login")
            return False

    def test_authenticated_endpoints(self):
        """Test endpoints requiring authentication"""
        if not self.token:
            self.log_test("Authentication Required", False, "No token available", "")
            return False

        headers = {'Authorization': f'Bearer {self.token}'}
        
        # Test user profile
        try:
            response = requests.get(f"{self.api_url}/me", headers=headers, timeout=10)
            if response.status_code == 200:
                user_data = response.json()
                self.log_test("Get User Profile", True, f"User: {user_data.get('full_name')}", "/me")
            else:
                self.log_test("Get User Profile", False, f"Status: {response.status_code}", "/me")
        except Exception as e:
            self.log_test("Get User Profile", False, f"Error: {str(e)}", "/me")

        # Test learning framework
        try:
            response = requests.get(f"{self.api_url}/learning-framework", timeout=10)
            if response.status_code == 200:
                framework = response.json()
                levels = list(framework.keys())
                self.log_test("Learning Framework", True, f"Levels: {levels}", "/learning-framework")
            else:
                self.log_test("Learning Framework", False, f"Status: {response.status_code}", "/learning-framework")
        except Exception as e:
            self.log_test("Learning Framework", False, f"Error: {str(e)}", "/learning-framework")

        # Test learning path
        try:
            response = requests.get(f"{self.api_url}/learning-path", headers=headers, timeout=10)
            if response.status_code == 200:
                path_data = response.json()
                self.log_test("Learning Path", True, f"Level: {path_data.get('learning_level')}", "/learning-path")
            else:
                self.log_test("Learning Path", False, f"Status: {response.status_code}", "/learning-path")
        except Exception as e:
            self.log_test("Learning Path", False, f"Error: {str(e)}", "/learning-path")

    def test_courses_system(self):
        """Test courses and content system"""
        try:
            response = requests.get(f"{self.api_url}/courses", timeout=10)
            if response.status_code == 200:
                courses = response.json()
                self.log_test("Get Courses", True, f"Found {len(courses)} courses", "/courses")
            else:
                self.log_test("Get Courses", False, f"Status: {response.status_code}", "/courses")
        except Exception as e:
            self.log_test("Get Courses", False, f"Error: {str(e)}", "/courses")

    def test_workouts_system(self):
        """Test logical thinking workouts system"""
        if not self.token:
            return

        headers = {'Authorization': f'Bearer {self.token}'}
        
        # Test get workouts
        try:
            response = requests.get(f"{self.api_url}/workouts", headers=headers, timeout=10)
            if response.status_code == 200:
                workouts = response.json()
                self.log_test("Get Workouts", True, f"Found {len(workouts)} workouts", "/workouts")
                
                # Test workout progress
                progress_response = requests.get(f"{self.api_url}/workouts/progress", headers=headers, timeout=10)
                if progress_response.status_code == 200:
                    progress = progress_response.json()
                    self.log_test("Workout Progress", True, f"Total attempts: {progress.get('total_attempts', 0)}", "/workouts/progress")
                else:
                    self.log_test("Workout Progress", False, f"Status: {progress_response.status_code}", "/workouts/progress")
                    
            else:
                self.log_test("Get Workouts", False, f"Status: {response.status_code}", "/workouts")
        except Exception as e:
            self.log_test("Get Workouts", False, f"Error: {str(e)}", "/workouts")

    def test_quiz_system(self):
        """Test quiz system"""
        if not self.token:
            return

        headers = {'Authorization': f'Bearer {self.token}'}
        
        try:
            response = requests.get(f"{self.api_url}/quizzes", headers=headers, timeout=10)
            if response.status_code == 200:
                quizzes = response.json()
                self.log_test("Get Quizzes", True, f"Found {len(quizzes)} quizzes", "/quizzes")
            else:
                self.log_test("Get Quizzes", False, f"Status: {response.status_code}", "/quizzes")
        except Exception as e:
            self.log_test("Get Quizzes", False, f"Error: {str(e)}", "/quizzes")

    def test_achievement_system(self):
        """Test achievement system"""
        if not self.token:
            return

        headers = {'Authorization': f'Bearer {self.token}'}
        
        # Test get all achievements
        try:
            response = requests.get(f"{self.api_url}/achievements", timeout=10)
            if response.status_code == 200:
                achievements = response.json()
                self.log_test("Get All Achievements", True, f"Found {len(achievements)} achievements", "/achievements")
            else:
                self.log_test("Get All Achievements", False, f"Status: {response.status_code}", "/achievements")
        except Exception as e:
            self.log_test("Get All Achievements", False, f"Error: {str(e)}", "/achievements")

        # Test user achievements
        try:
            response = requests.get(f"{self.api_url}/achievements/user", headers=headers, timeout=10)
            if response.status_code == 200:
                user_achievements = response.json()
                self.log_test("Get User Achievements", True, f"User has {len(user_achievements)} achievements", "/achievements/user")
            else:
                self.log_test("Get User Achievements", False, f"Status: {response.status_code}", "/achievements/user")
        except Exception as e:
            self.log_test("Get User Achievements", False, f"Error: {str(e)}", "/achievements/user")

    def test_subscription_system(self):
        """Test subscription and payment system"""
        try:
            # Test subscription plans
            response = requests.get(f"{self.api_url}/subscription/plans", timeout=10)
            if response.status_code == 200:
                plans = response.json()
                plan_count = sum(len(level_plans) for level_plans in plans.values())
                self.log_test("Subscription Plans", True, f"Found {plan_count} subscription plans", "/subscription/plans")
            else:
                self.log_test("Subscription Plans", False, f"Status: {response.status_code}", "/subscription/plans")
        except Exception as e:
            self.log_test("Subscription Plans", False, f"Error: {str(e)}", "/subscription/plans")

        # Test subscription packages
        try:
            response = requests.get(f"{self.api_url}/subscription/packages", timeout=10)
            if response.status_code == 200:
                packages = response.json()
                self.log_test("Subscription Packages", True, f"Found {len(packages)} packages", "/subscription/packages")
            else:
                self.log_test("Subscription Packages", False, f"Status: {response.status_code}", "/subscription/packages")
        except Exception as e:
            self.log_test("Subscription Packages", False, f"Error: {str(e)}", "/subscription/packages")

    def test_enrollment_system(self):
        """Test NINA enrollment integration"""
        try:
            # Test enrollment programs
            response = requests.get(f"{self.api_url}/enrollment/programs", timeout=10)
            if response.status_code == 200:
                programs = response.json()
                program_list = programs.get('programs', [])
                self.log_test("Enrollment Programs", True, f"Found {len(program_list)} programs", "/enrollment/programs")
            else:
                self.log_test("Enrollment Programs", False, f"Status: {response.status_code}", "/enrollment/programs")
        except Exception as e:
            self.log_test("Enrollment Programs", False, f"Error: {str(e)}", "/enrollment/programs")

        # Test enrollment submission (with test data)
        try:
            test_enrollment = {
                "childName": "Test Child",
                "parentName": "Test Parent",
                "email": f"test_parent_{int(time.time())}@example.com",
                "phone": "+94771234567",
                "childAge": "10",
                "selectedProgram": "development_monthly",
                "parentMessage": "Test enrollment from API testing"
            }
            
            response = requests.post(f"{self.api_url}/enrollment/submit", json=test_enrollment, timeout=10)
            if response.status_code == 200:
                result = response.json()
                self.log_test("Enrollment Submission", True, f"Status: {result.get('status')}", "/enrollment/submit")
            else:
                self.log_test("Enrollment Submission", False, f"Status: {response.status_code}", "/enrollment/submit")
        except Exception as e:
            self.log_test("Enrollment Submission", False, f"Error: {str(e)}", "/enrollment/submit")

    def test_comprehensive_progress(self):
        """Test comprehensive progress tracking"""
        if not self.token:
            return

        headers = {'Authorization': f'Bearer {self.token}'}
        
        try:
            response = requests.get(f"{self.api_url}/progress/comprehensive", headers=headers, timeout=10)
            if response.status_code == 200:
                progress = response.json()
                self.log_test("Comprehensive Progress", True, f"Overall stats available", "/progress/comprehensive")
            else:
                self.log_test("Comprehensive Progress", False, f"Status: {response.status_code}", "/progress/comprehensive")
        except Exception as e:
            self.log_test("Comprehensive Progress", False, f"Error: {str(e)}", "/progress/comprehensive")

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting TEC Platform Comprehensive Backend Testing")
        print("=" * 60)
        
        # Core system tests
        if not self.test_api_health():
            print("❌ API is not accessible. Stopping tests.")
            return False
            
        # Authentication tests
        self.test_user_login()
        self.test_authenticated_endpoints()
        
        # Content system tests
        self.test_courses_system()
        self.test_workouts_system()
        self.test_quiz_system()
        self.test_achievement_system()
        
        # Business system tests
        self.test_subscription_system()
        self.test_enrollment_system()
        
        # Analytics tests
        self.test_comprehensive_progress()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"📈 Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        # Detailed results
        print("\n📋 DETAILED RESULTS:")
        for result in self.test_results:
            status = "✅" if result['success'] else "❌"
            print(f"{status} {result['test']} - {result['endpoint']}")
            if not result['success'] and result['details']:
                print(f"   └─ {result['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main testing function"""
    print("🎯 TEC Future-Ready Learning Platform - Backend API Testing")
    print("🏢 TEC Sri Lanka Worldwide (Pvt.) Ltd - 42 Years of Excellence")
    print("🌐 Testing Platform: https://edtech-platform-6.preview.emergentagent.com")
    print()
    
    tester = TecPlatformTester()
    success = tester.run_all_tests()
    
    print("\n🎉 Testing Complete!")
    if success:
        print("✅ All systems operational - Platform ready for deployment!")
        return 0
    else:
        print("⚠️  Some issues detected - Review failed tests above")
        return 1

if __name__ == "__main__":
    sys.exit(main())