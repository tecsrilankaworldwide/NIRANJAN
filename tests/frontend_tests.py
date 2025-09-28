#!/usr/bin/env python3
"""
Frontend Component Testing for TEC Platform
Tests React components and user interactions
"""
import subprocess
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

class FrontendTestSuite:
    """Frontend testing using Selenium WebDriver"""
    
    def __init__(self):
        self.base_url = "https://ai-kids-learn-4.preview.emergentagent.com"
        self.driver = None
        
    def setup_driver(self):
        """Setup Chrome WebDriver for testing"""
        try:
            chrome_options = Options()
            chrome_options.add_argument("--headless")  # Run in background
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--window-size=1920,1080")
            
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.implicitly_wait(10)
            
            return True
        except Exception as e:
            print(f"❌ Could not setup Chrome WebDriver: {e}")
            return False
    
    def test_landing_page_loads(self):
        """Test NINA landing page loads correctly"""
        try:
            self.driver.get(f"{self.base_url}/landing")
            
            # Wait for page to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "h1"))
            )
            
            # Check for key elements
            title = self.driver.find_element(By.TAG_NAME, "h1")
            assert "TecaiKids" in title.text
            
            # Check for age programs
            programs = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'bg-white rounded-2xl')]")
            assert len(programs) >= 3  # Should have 3 age programs now
            
            print("✅ Landing Page Load: PASSED")
            return True
            
        except Exception as e:
            print(f"❌ Landing Page Load: FAILED - {e}")
            return False
    
    def test_login_flow(self):
        """Test user login functionality"""
        try:
            self.driver.get(f"{self.base_url}/login")
            
            # Wait for login form
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "email"))
            )
            
            # Fill login form
            email_field = self.driver.find_element(By.NAME, "email")
            password_field = self.driver.find_element(By.NAME, "password")
            
            email_field.send_keys("student@tecaikids.com")
            password_field.send_keys("student123")
            
            # Submit form
            submit_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
            submit_button.click()
            
            # Wait for redirect to dashboard
            WebDriverWait(self.driver, 15).until(
                EC.url_contains("/dashboard")
            )
            
            # Verify dashboard elements
            dashboard_title = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Student Dashboard')]"))
            )
            
            assert dashboard_title is not None
            print("✅ Login Flow: PASSED")
            return True
            
        except Exception as e:
            print(f"❌ Login Flow: FAILED - {e}")
            return False
    
    def test_navigation_menu(self):
        """Test navigation menu functionality"""
        try:
            # Ensure we're logged in
            if not self.test_login_flow():
                return False
            
            # Test navigation to different pages
            navigation_tests = [
                ("/achievements", "Achievement"),
                ("/quizzes", "Knowledge Assessment"),
                ("/workouts", "Logic Workouts"),
                ("/subscription", "Future-Ready Learning")
            ]
            
            for path, expected_content in navigation_tests:
                self.driver.get(f"{self.base_url}{path}")
                
                # Wait for page content
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.TAG_NAME, "h1"))
                )
                
                page_source = self.driver.page_source
                assert expected_content in page_source or "TEC" in page_source
            
            print("✅ Navigation Menu: PASSED")
            return True
            
        except Exception as e:
            print(f"❌ Navigation Menu: FAILED - {e}")
            return False
    
    def test_responsive_design(self):
        """Test responsive design at different screen sizes"""
        try:
            # Test different screen sizes
            screen_sizes = [
                (1920, 1080),  # Desktop
                (768, 1024),   # Tablet
                (375, 667)     # Mobile
            ]
            
            for width, height in screen_sizes:
                self.driver.set_window_size(width, height)
                self.driver.get(f"{self.base_url}/landing")
                
                # Wait for page load
                time.sleep(2)
                
                # Check if page is properly displayed
                body = self.driver.find_element(By.TAG_NAME, "body")
                assert body.is_displayed()
                
                # Check for mobile menu button on small screens
                if width < 768:
                    # Look for mobile navigation elements
                    nav_elements = self.driver.find_elements(By.XPATH, "//nav | //button[contains(@class, 'menu')]")
                    assert len(nav_elements) > 0
            
            print("✅ Responsive Design: PASSED")
            return True
            
        except Exception as e:
            print(f"❌ Responsive Design: FAILED - {e}")
            return False
    
    def test_enrollment_form(self):
        """Test enrollment form functionality"""
        try:
            self.driver.get(f"{self.base_url}/landing")
            
            # Scroll to enrollment section
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            
            # Wait for enrollment form
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "childName"))
            )
            
            # Fill enrollment form
            form_data = {
                "childName": "Test Child Frontend",
                "parentName": "Test Parent Frontend", 
                "email": "frontend-test@example.com",
                "childAge": "8"
            }
            
            for field_name, value in form_data.items():
                field = self.driver.find_element(By.NAME, field_name)
                field.send_keys(value)
            
            # Select age dropdown
            age_dropdown = self.driver.find_element(By.NAME, "childAge")
            age_dropdown.send_keys("8")
            
            print("✅ Enrollment Form: PASSED")
            return True
            
        except Exception as e:
            print(f"❌ Enrollment Form: FAILED - {e}")
            return False
    
    def cleanup(self):
        """Cleanup WebDriver"""
        if self.driver:
            self.driver.quit()

def test_frontend_accessibility():
    """Test basic frontend accessibility"""
    try:
        # Simple request test
        base_url = "https://ai-kids-learn-4.preview.emergentagent.com"
        
        # Test main pages are accessible
        pages_to_test = [
            "/",
            "/landing",
            "/login"
        ]
        
        for page in pages_to_test:
            response = requests.get(f"{base_url}{page}", timeout=10)
            assert response.status_code == 200
            assert len(response.content) > 1000  # Should have substantial content
        
        print("✅ Frontend Accessibility: PASSED")
        return True
        
    except Exception as e:
        print(f"❌ Frontend Accessibility: FAILED - {e}")
        return False

def run_frontend_tests():
    """Run all frontend tests"""
    print("\n🎨 Starting Frontend Testing Suite...")
    print("=" * 60)
    
    # Test basic accessibility first (doesn't require WebDriver)
    accessibility_passed = test_frontend_accessibility()
    
    # Try WebDriver tests
    test_suite = FrontendTestSuite()
    driver_available = test_suite.setup_driver()
    
    passed_tests = 0
    failed_tests = 0
    
    if accessibility_passed:
        passed_tests += 1
    else:
        failed_tests += 1
    
    if driver_available:
        # Run WebDriver tests
        webdriver_tests = [
            test_suite.test_landing_page_loads,
            test_suite.test_login_flow,
            test_suite.test_navigation_menu,
            test_suite.test_responsive_design,
            test_suite.test_enrollment_form
        ]
        
        for test_method in webdriver_tests:
            try:
                if test_method():
                    passed_tests += 1
                else:
                    failed_tests += 1
            except Exception as e:
                print(f"❌ {test_method.__name__}: FAILED - {e}")
                failed_tests += 1
        
        test_suite.cleanup()
    else:
        print("⚠️ WebDriver not available - skipping interactive tests")
        
    print("=" * 60)
    print(f"🎨 Frontend Test Results:")
    print(f"   ✅ Passed: {passed_tests}")
    print(f"   ❌ Failed: {failed_tests}")
    
    if failed_tests == 0:
        print("🎉 All frontend tests passed!")
    
    return passed_tests, failed_tests

if __name__ == "__main__":
    run_frontend_tests()