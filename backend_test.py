#!/usr/bin/env python3
"""
TecaiKids Unified Backend Testing Suite
Tests the unified backend implementation for ages 4-18
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime
from typing import Dict, Any, List

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://skill-bridge-lk.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

class TecaiKidsBackendTester:
    def __init__(self):
        self.session = None
        self.test_results = []
        self.test_users = []
        
    async def setup(self):
        """Setup test session"""
        self.session = aiohttp.ClientSession()
        
    async def teardown(self):
        """Cleanup test session"""
        if self.session:
            await self.session.close()
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None) -> Dict[str, Any]:
        """Make HTTP request to API"""
        url = f"{API_BASE_URL}{endpoint}"
        
        try:
            if method.upper() == 'GET':
                async with self.session.get(url, params=params) as response:
                    response_data = await response.json()
                    return {
                        'status_code': response.status,
                        'data': response_data,
                        'success': response.status < 400
                    }
            elif method.upper() == 'POST':
                headers = {'Content-Type': 'application/json'}
                async with self.session.post(url, json=data, headers=headers, params=params) as response:
                    response_data = await response.json()
                    return {
                        'status_code': response.status,
                        'data': response_data,
                        'success': response.status < 400
                    }
        except Exception as e:
            return {
                'status_code': 500,
                'data': {'error': str(e)},
                'success': False
            }
    
    def log_test_result(self, test_name: str, success: bool, details: str = "", data: Any = None):
        """Log test result"""
        result = {
            'test_name': test_name,
            'success': success,
            'details': details,
            'timestamp': datetime.now().isoformat(),
            'data': data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}: {details}")
    
    async def test_api_health(self):
        """Test basic API health check"""
        print("\n=== Testing API Health ===")
        
        response = await self.make_request('GET', '/')
        
        if response['success']:
            data = response['data']
            expected_fields = ['message', 'version', 'platform']
            has_all_fields = all(field in data for field in expected_fields)
            
            if has_all_fields and 'Unified' in data.get('platform', ''):
                self.log_test_result(
                    "API Health Check", 
                    True, 
                    f"API is running - Version: {data.get('version')}, Platform: {data.get('platform')}"
                )
            else:
                self.log_test_result(
                    "API Health Check", 
                    False, 
                    f"API response missing expected fields or not unified platform: {data}"
                )
        else:
            self.log_test_result(
                "API Health Check", 
                False, 
                f"API health check failed: {response['data']}"
            )
    
    async def test_unified_user_management(self):
        """Test unified user management with age level assignment"""
        print("\n=== Testing Unified User Management ===")
        
        # Test cases for different age ranges
        test_cases = [
            {'age': 5, 'expected_level': '4-6', 'level_name': 'LITTLE_LEARNERS'},
            {'age': 8, 'expected_level': '7-9', 'level_name': 'YOUNG_EXPLORERS'},
            {'age': 11, 'expected_level': '10-12', 'level_name': 'SMART_KIDS'},
            {'age': 14, 'expected_level': '13-15', 'level_name': 'TECH_TEENS'},
            {'age': 17, 'expected_level': '16-18', 'level_name': 'FUTURE_LEADERS'},
        ]
        
        for i, test_case in enumerate(test_cases):
            user_data = {
                'name': f'Test Student {i+1}',
                'age': test_case['age'],
                'parent_email': f'parent{i+1}@test.com',
                'student_email': f'student{i+1}@test.com',
                'school': 'Test School',
                'grade': test_case['age'] - 3,
                'interests': ['Math', 'Science'],
                'career_goals': ['Engineer']
            }
            
            # Create user
            response = await self.make_request('POST', '/users', user_data)
            
            if response['success']:
                user = response['data']
                self.test_users.append(user['id'])
                
                # Verify age level assignment
                if user['age_level'] == test_case['expected_level']:
                    self.log_test_result(
                        f"User Creation - Age {test_case['age']}", 
                        True, 
                        f"Correctly assigned to {test_case['level_name']} ({test_case['expected_level']})"
                    )
                else:
                    self.log_test_result(
                        f"User Creation - Age {test_case['age']}", 
                        False, 
                        f"Expected {test_case['expected_level']}, got {user['age_level']}"
                    )
                
                # Test user retrieval
                get_response = await self.make_request('GET', f'/users/{user["id"]}')
                if get_response['success']:
                    self.log_test_result(
                        f"User Retrieval - Age {test_case['age']}", 
                        True, 
                        f"Successfully retrieved user {user['id']}"
                    )
                else:
                    self.log_test_result(
                        f"User Retrieval - Age {test_case['age']}", 
                        False, 
                        f"Failed to retrieve user: {get_response['data']}"
                    )
            else:
                self.log_test_result(
                    f"User Creation - Age {test_case['age']}", 
                    False, 
                    f"Failed to create user: {response['data']}"
                )
        
        # Test invalid age
        invalid_user_data = {
            'name': 'Invalid Age User',
            'age': 25,  # Outside supported range
            'parent_email': 'invalid@test.com'
        }
        
        response = await self.make_request('POST', '/users', invalid_user_data)
        if not response['success']:
            self.log_test_result(
                "Invalid Age Handling", 
                True, 
                "Correctly rejected user with age outside 4-18 range"
            )
        else:
            self.log_test_result(
                "Invalid Age Handling", 
                False, 
                "Should have rejected user with invalid age"
            )
    
    async def test_payment_integration(self):
        """Test payment integration endpoints"""
        print("\n=== Testing Payment Integration ===")
        
        # Test pricing endpoint
        response = await self.make_request('GET', '/pricing')
        
        if response['success']:
            pricing_data = response['data']
            if 'pricing_plans' in pricing_data:
                plans = pricing_data['pricing_plans']
                expected_levels = ['4-6', '7-9', '10-12', '13-15', '16-18']
                
                if all(level in plans for level in expected_levels):
                    self.log_test_result(
                        "Pricing Plans Retrieval", 
                        True, 
                        f"All 5 age levels have pricing plans: {list(plans.keys())}"
                    )
                else:
                    self.log_test_result(
                        "Pricing Plans Retrieval", 
                        False, 
                        f"Missing pricing plans. Found: {list(plans.keys())}, Expected: {expected_levels}"
                    )
            else:
                self.log_test_result(
                    "Pricing Plans Retrieval", 
                    False, 
                    f"No pricing_plans in response: {pricing_data}"
                )
        else:
            self.log_test_result(
                "Pricing Plans Retrieval", 
                False, 
                f"Failed to get pricing: {response['data']}"
            )
        
        # Test individual pricing plan
        response = await self.make_request('GET', '/pricing/10-12')
        if response['success']:
            plan = response['data']
            required_fields = ['age_level', 'monthly_price', 'quarterly_price', 'features']
            if all(field in plan for field in required_fields):
                self.log_test_result(
                    "Individual Pricing Plan", 
                    True, 
                    f"Smart Kids pricing plan retrieved with all required fields"
                )
            else:
                self.log_test_result(
                    "Individual Pricing Plan", 
                    False, 
                    f"Missing required fields in pricing plan: {plan}"
                )
        else:
            self.log_test_result(
                "Individual Pricing Plan", 
                False, 
                f"Failed to get individual pricing plan: {response['data']}"
            )
        
        # Test Stripe payment creation (if we have test users)
        if self.test_users:
            payment_request = {
                'user_id': self.test_users[0],
                'age_level': '10-12',
                'subscription_type': 'quarterly',
                'payment_method': 'stripe',
                'delivery_address': '123 Test Street, Colombo, Sri Lanka'
            }
            
            response = await self.make_request('POST', '/payments/stripe', payment_request)
            if response['success']:
                payment_data = response['data']
                if 'payment_url' in payment_data and 'transaction_id' in payment_data:
                    self.log_test_result(
                        "Stripe Payment Creation", 
                        True, 
                        f"Stripe payment session created successfully"
                    )
                else:
                    self.log_test_result(
                        "Stripe Payment Creation", 
                        False, 
                        f"Missing payment_url or transaction_id in response: {payment_data}"
                    )
            else:
                self.log_test_result(
                    "Stripe Payment Creation", 
                    False, 
                    f"Failed to create Stripe payment: {response['data']}"
                )
        
        # Test Bank Transfer payment creation
        if self.test_users:
            payment_request = {
                'user_id': self.test_users[0],
                'age_level': '7-9',
                'subscription_type': 'monthly',
                'payment_method': 'bank_transfer',
                'delivery_address': '456 Test Avenue, Kandy, Sri Lanka'
            }
            
            response = await self.make_request('POST', '/payments/bank-transfer', payment_request)
            if response['success']:
                payment_data = response['data']
                if 'bank_details' in payment_data and 'transaction_id' in payment_data:
                    bank_details = payment_data['bank_details']
                    required_bank_fields = ['bank_name', 'reference', 'amount']
                    if all(field in bank_details for field in required_bank_fields):
                        self.log_test_result(
                            "Bank Transfer Payment Creation", 
                            True, 
                            f"Bank transfer payment created with reference: {bank_details['reference']}"
                        )
                    else:
                        self.log_test_result(
                            "Bank Transfer Payment Creation", 
                            False, 
                            f"Missing required bank details: {bank_details}"
                        )
                else:
                    self.log_test_result(
                        "Bank Transfer Payment Creation", 
                        False, 
                        f"Missing bank_details or transaction_id: {payment_data}"
                    )
            else:
                self.log_test_result(
                    "Bank Transfer Payment Creation", 
                    False, 
                    f"Failed to create bank transfer payment: {response['data']}"
                )
    
    async def test_unified_content_management(self):
        """Test unified content management endpoints"""
        print("\n=== Testing Unified Content Management ===")
        
        # Test age levels endpoint
        response = await self.make_request('GET', '/age-levels')
        
        if response['success']:
            age_levels_data = response['data']
            if 'age_levels' in age_levels_data:
                age_levels = age_levels_data['age_levels']
                expected_count = 5
                
                if len(age_levels) == expected_count:
                    # Check if all required fields are present
                    required_fields = ['value', 'label', 'description', 'icon', 'skills']
                    all_valid = True
                    
                    for level in age_levels:
                        if not all(field in level for field in required_fields):
                            all_valid = False
                            break
                    
                    if all_valid:
                        self.log_test_result(
                            "Age Levels Endpoint", 
                            True, 
                            f"All 5 unified age levels returned with complete information"
                        )
                    else:
                        self.log_test_result(
                            "Age Levels Endpoint", 
                            False, 
                            f"Age levels missing required fields"
                        )
                else:
                    self.log_test_result(
                        "Age Levels Endpoint", 
                        False, 
                        f"Expected 5 age levels, got {len(age_levels)}"
                    )
            else:
                self.log_test_result(
                    "Age Levels Endpoint", 
                    False, 
                    f"No age_levels in response: {age_levels_data}"
                )
        else:
            self.log_test_result(
                "Age Levels Endpoint", 
                False, 
                f"Failed to get age levels: {response['data']}"
            )
        
        # Test categories endpoint
        response = await self.make_request('GET', '/categories')
        
        if response['success']:
            categories_data = response['data']
            if 'categories' in categories_data:
                categories = categories_data['categories']
                category_values = [cat['value'] for cat in categories]
                
                # Check for logical thinking and algorithmic thinking
                required_categories = ['Logical Thinking', 'Algorithmic Thinking']
                has_required = all(cat in category_values for cat in required_categories)
                
                if has_required:
                    self.log_test_result(
                        "Categories Endpoint", 
                        True, 
                        f"Categories include Logical Thinking and Algorithmic Thinking. Total: {len(categories)}"
                    )
                else:
                    self.log_test_result(
                        "Categories Endpoint", 
                        False, 
                        f"Missing required categories. Found: {category_values}"
                    )
            else:
                self.log_test_result(
                    "Categories Endpoint", 
                    False, 
                    f"No categories in response: {categories_data}"
                )
        else:
            self.log_test_result(
                "Categories Endpoint", 
                False, 
                f"Failed to get categories: {response['data']}"
            )
        
        # Test payment methods endpoint
        response = await self.make_request('GET', '/payment-methods')
        
        if response['success']:
            payment_methods_data = response['data']
            if 'payment_methods' in payment_methods_data:
                payment_methods = payment_methods_data['payment_methods']
                method_values = [method['value'] for method in payment_methods]
                
                expected_methods = ['stripe', 'bank_transfer', 'ezcash']
                has_expected = all(method in method_values for method in expected_methods)
                
                if has_expected:
                    self.log_test_result(
                        "Payment Methods Endpoint", 
                        True, 
                        f"All expected payment methods available: {method_values}"
                    )
                else:
                    self.log_test_result(
                        "Payment Methods Endpoint", 
                        False, 
                        f"Missing expected payment methods. Found: {method_values}"
                    )
            else:
                self.log_test_result(
                    "Payment Methods Endpoint", 
                    False, 
                    f"No payment_methods in response: {payment_methods_data}"
                )
        else:
            self.log_test_result(
                "Payment Methods Endpoint", 
                False, 
                f"Failed to get payment methods: {response['data']}"
            )
    
    async def test_user_dashboard(self):
        """Test unified dashboard endpoint"""
        print("\n=== Testing User Dashboard ===")
        
        if not self.test_users:
            self.log_test_result(
                "User Dashboard Test", 
                False, 
                "No test users available for dashboard testing"
            )
            return
        
        # Test dashboard for first test user
        user_id = self.test_users[0]
        response = await self.make_request('GET', f'/users/{user_id}/dashboard')
        
        if response['success']:
            dashboard_data = response['data']
            required_sections = ['user', 'stats', 'content', 'age_level_info']
            
            has_all_sections = all(section in dashboard_data for section in required_sections)
            
            if has_all_sections:
                # Check age level info
                age_level_info = dashboard_data['age_level_info']
                required_age_info = ['current_level', 'level_name', 'level_description', 'skills_focus']
                
                if all(field in age_level_info for field in required_age_info):
                    self.log_test_result(
                        "User Dashboard", 
                        True, 
                        f"Dashboard returned comprehensive data for user {user_id}"
                    )
                else:
                    self.log_test_result(
                        "User Dashboard", 
                        False, 
                        f"Age level info missing required fields: {age_level_info}"
                    )
            else:
                self.log_test_result(
                    "User Dashboard", 
                    False, 
                    f"Dashboard missing required sections. Found: {list(dashboard_data.keys())}"
                )
        else:
            self.log_test_result(
                "User Dashboard", 
                False, 
                f"Failed to get dashboard data: {response['data']}"
            )
    
    async def test_error_handling(self):
        """Test error handling for invalid inputs"""
        print("\n=== Testing Error Handling ===")
        
        # Test invalid age level in pricing
        response = await self.make_request('GET', '/pricing/invalid-age')
        if not response['success']:
            self.log_test_result(
                "Invalid Age Level - Pricing", 
                True, 
                "Correctly rejected invalid age level in pricing endpoint"
            )
        else:
            self.log_test_result(
                "Invalid Age Level - Pricing", 
                False, 
                "Should have rejected invalid age level"
            )
        
        # Test invalid user ID in dashboard
        response = await self.make_request('GET', '/users/invalid-user-id/dashboard')
        if not response['success']:
            self.log_test_result(
                "Invalid User ID - Dashboard", 
                True, 
                "Correctly rejected invalid user ID in dashboard endpoint"
            )
        else:
            self.log_test_result(
                "Invalid User ID - Dashboard", 
                False, 
                "Should have rejected invalid user ID"
            )
        
        # Test invalid payment request
        if self.test_users:
            invalid_payment_request = {
                'user_id': self.test_users[0],
                'age_level': 'invalid-level',  # Invalid age level
                'subscription_type': 'quarterly',
                'payment_method': 'stripe'
            }
            
            response = await self.make_request('POST', '/payments/stripe', invalid_payment_request)
            if not response['success']:
                self.log_test_result(
                    "Invalid Payment Request", 
                    True, 
                    "Correctly rejected payment request with invalid age level"
                )
            else:
                self.log_test_result(
                    "Invalid Payment Request", 
                    False, 
                    "Should have rejected payment request with invalid age level"
                )
    
    async def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting TecaiKids Unified Backend Tests")
        print(f"📍 Testing API at: {API_BASE_URL}")
        print("=" * 60)
        
        await self.setup()
        
        try:
            # Run all test suites
            await self.test_api_health()
            await self.test_unified_user_management()
            await self.test_payment_integration()
            await self.test_unified_content_management()
            await self.test_user_dashboard()
            await self.test_error_handling()
            
        finally:
            await self.teardown()
        
        # Print summary
        self.print_test_summary()
    
    def print_test_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  ❌ {result['test_name']}: {result['details']}")
        
        print("\n" + "=" * 60)
        
        return passed_tests, failed_tests

async def main():
    """Main test runner"""
    tester = TecaiKidsBackendTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())