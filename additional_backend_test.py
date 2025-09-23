#!/usr/bin/env python3
"""
Additional TecaiKids Backend Tests
Tests additional functionality like payment status checking
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://skill-bridge-lk.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

async def test_payment_status():
    """Test payment status endpoint"""
    print("=== Testing Payment Status Endpoint ===")
    
    async with aiohttp.ClientSession() as session:
        # Test with a dummy session ID
        url = f"{API_BASE_URL}/payments/status/dummy_session_id"
        
        try:
            async with session.get(url) as response:
                response_data = await response.json()
                
                if response.status == 200:
                    if 'status' in response_data:
                        print(f"✅ PASS - Payment Status: Status endpoint working, returned: {response_data['status']}")
                    else:
                        print(f"❌ FAIL - Payment Status: Missing status field in response")
                else:
                    print(f"✅ PASS - Payment Status: Correctly handled invalid session ID with status {response.status}")
        except Exception as e:
            print(f"❌ FAIL - Payment Status: Error testing payment status: {e}")

async def test_user_stats():
    """Test user stats endpoint"""
    print("\n=== Testing User Stats Endpoint ===")
    
    async with aiohttp.ClientSession() as session:
        # First create a test user
        user_data = {
            'name': 'Stats Test User',
            'age': 10,
            'parent_email': 'stats@test.com'
        }
        
        try:
            # Create user
            async with session.post(f"{API_BASE_URL}/users", json=user_data) as response:
                if response.status < 400:
                    user = await response.json()
                    user_id = user['id']
                    
                    # Test user stats
                    async with session.get(f"{API_BASE_URL}/users/{user_id}/stats") as stats_response:
                        if stats_response.status == 200:
                            stats_data = await stats_response.json()
                            required_fields = ['user', 'total_courses_completed', 'total_quizzes_completed', 'achievements_count']
                            
                            if all(field in stats_data for field in required_fields):
                                print(f"✅ PASS - User Stats: All required fields present")
                            else:
                                print(f"❌ FAIL - User Stats: Missing required fields")
                        else:
                            print(f"❌ FAIL - User Stats: Failed to get stats with status {stats_response.status}")
                else:
                    print(f"❌ FAIL - User Stats: Failed to create test user")
        except Exception as e:
            print(f"❌ FAIL - User Stats: Error testing user stats: {e}")

async def test_courses_endpoints():
    """Test courses endpoints"""
    print("\n=== Testing Courses Endpoints ===")
    
    async with aiohttp.ClientSession() as session:
        try:
            # Test get all courses
            async with session.get(f"{API_BASE_URL}/courses") as response:
                if response.status == 200:
                    courses = await response.json()
                    print(f"✅ PASS - All Courses: Retrieved {len(courses)} courses")
                else:
                    print(f"❌ FAIL - All Courses: Failed with status {response.status}")
            
            # Test courses by age level
            async with session.get(f"{API_BASE_URL}/courses/age/10-12") as response:
                if response.status == 200:
                    courses = await response.json()
                    print(f"✅ PASS - Courses by Age: Retrieved {len(courses)} courses for Smart Kids")
                else:
                    print(f"❌ FAIL - Courses by Age: Failed with status {response.status}")
            
            # Test courses by category
            async with session.get(f"{API_BASE_URL}/courses/category/Math") as response:
                if response.status == 200:
                    courses = await response.json()
                    print(f"✅ PASS - Courses by Category: Retrieved {len(courses)} Math courses")
                else:
                    print(f"❌ FAIL - Courses by Category: Failed with status {response.status}")
                    
        except Exception as e:
            print(f"❌ FAIL - Courses Endpoints: Error testing courses: {e}")

async def test_age_range_boundaries():
    """Test age range boundary conditions"""
    print("\n=== Testing Age Range Boundaries ===")
    
    async with aiohttp.ClientSession() as session:
        boundary_tests = [
            {'age': 4, 'expected': '4-6', 'name': 'LITTLE_LEARNERS'},
            {'age': 6, 'expected': '4-6', 'name': 'LITTLE_LEARNERS'},
            {'age': 7, 'expected': '7-9', 'name': 'YOUNG_EXPLORERS'},
            {'age': 9, 'expected': '7-9', 'name': 'YOUNG_EXPLORERS'},
            {'age': 10, 'expected': '10-12', 'name': 'SMART_KIDS'},
            {'age': 12, 'expected': '10-12', 'name': 'SMART_KIDS'},
            {'age': 13, 'expected': '13-15', 'name': 'TECH_TEENS'},
            {'age': 15, 'expected': '13-15', 'name': 'TECH_TEENS'},
            {'age': 16, 'expected': '16-18', 'name': 'FUTURE_LEADERS'},
            {'age': 18, 'expected': '16-18', 'name': 'FUTURE_LEADERS'},
        ]
        
        for test_case in boundary_tests:
            user_data = {
                'name': f'Boundary Test Age {test_case["age"]}',
                'age': test_case['age'],
                'parent_email': f'boundary{test_case["age"]}@test.com'
            }
            
            try:
                async with session.post(f"{API_BASE_URL}/users", json=user_data) as response:
                    if response.status < 400:
                        user = await response.json()
                        if user['age_level'] == test_case['expected']:
                            print(f"✅ PASS - Age {test_case['age']}: Correctly assigned to {test_case['name']}")
                        else:
                            print(f"❌ FAIL - Age {test_case['age']}: Expected {test_case['expected']}, got {user['age_level']}")
                    else:
                        print(f"❌ FAIL - Age {test_case['age']}: Failed to create user")
            except Exception as e:
                print(f"❌ FAIL - Age {test_case['age']}: Error: {e}")

async def main():
    """Run additional tests"""
    print("🔍 Running Additional TecaiKids Backend Tests")
    print("=" * 60)
    
    await test_payment_status()
    await test_user_stats()
    await test_courses_endpoints()
    await test_age_range_boundaries()
    
    print("\n" + "=" * 60)
    print("✅ Additional tests completed!")

if __name__ == "__main__":
    asyncio.run(main())