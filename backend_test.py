import requests
import sys
import json
from datetime import datetime, timezone
from typing import Dict, Any

class TutorlyAPITester:
    def __init__(self, base_url="https://tutorbid-app.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_resources = {
            'users': [],
            'requests': [],
            'bids': [],
            'payments': []
        }

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Dict[Any, Any] = None, params: Dict[str, Any] = None) -> tuple:
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, params=params)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_create_user(self):
        """Test user creation"""
        user_data = {
            "name": "Test Student",
            "email": "student@test.com",
            "avatar": "https://example.com/avatar.jpg",
            "phone": "+1234567890",
            "bio": "Test student bio"
        }
        
        success, response = self.run_test("Create User", "POST", "users", 200, data=user_data)
        if success and 'id' in response:
            self.created_resources['users'].append(response['id'])
            return response['id']
        return None

    def test_get_user(self, user_id: str):
        """Test getting user by ID"""
        success, response = self.run_test("Get User", "GET", f"users/{user_id}", 200)
        return success

    def test_update_user(self, user_id: str):
        """Test updating user"""
        update_data = {
            "current_role": "tutor",
            "subjects": ["Mathematics", "Physics"]
        }
        success, response = self.run_test("Update User", "PUT", f"users/{user_id}", 200, data=update_data)
        return success

    def test_create_request(self, student_id: str):
        """Test creating tutoring request"""
        request_data = {
            "subject": "Mathematics",
            "topic": "Calculus",
            "description": "Need help with derivatives and integrals",
            "duration_hours": 2,
            "preferred_price": 100000,
            "max_price": 150000,
            "session_date": "2024-12-20T10:00:00Z",
            "location": "online",
            "urgency": "medium"
        }
        
        success, response = self.run_test(
            "Create Request", "POST", "requests", 200, 
            data=request_data, params={"student_id": student_id}
        )
        if success and 'id' in response:
            self.created_resources['requests'].append(response['id'])
            return response['id']
        return None

    def test_get_requests(self):
        """Test getting all requests"""
        success, response = self.run_test("Get All Requests", "GET", "requests", 200)
        return success

    def test_get_request_by_id(self, request_id: str):
        """Test getting request by ID"""
        success, response = self.run_test("Get Request by ID", "GET", f"requests/{request_id}", 200)
        return success

    def test_create_bid(self, request_id: str, tutor_id: str):
        """Test creating bid"""
        bid_data = {
            "request_id": request_id,
            "offered_price": 120000,
            "message": "I can help you with calculus. I have 5 years of experience.",
            "estimated_duration": 2
        }
        
        success, response = self.run_test(
            "Create Bid", "POST", "bids", 200,
            data=bid_data, params={"tutor_id": tutor_id}
        )
        if success and 'id' in response:
            self.created_resources['bids'].append(response['id'])
            return response['id']
        return None

    def test_get_bids(self, request_id: str = None):
        """Test getting bids"""
        params = {"request_id": request_id} if request_id else None
        success, response = self.run_test("Get Bids", "GET", "bids", 200, params=params)
        return success

    def test_accept_bid(self, bid_id: str, student_id: str):
        """Test accepting a bid"""
        success, response = self.run_test(
            "Accept Bid", "POST", f"bids/{bid_id}/accept", 200,
            params={"student_id": student_id}
        )
        return success

    def test_get_payments(self, student_id: str = None):
        """Test getting payments"""
        params = {"student_id": student_id} if student_id else None
        success, response = self.run_test("Get Payments", "GET", "payments", 200, params=params)
        return success

    def test_create_review(self, request_id: str, reviewer_id: str, reviewee_id: str):
        """Test creating review"""
        review_data = {
            "request_id": request_id,
            "reviewer_id": reviewer_id,
            "reviewee_id": reviewee_id,
            "rating": 5,
            "comment": "Excellent tutoring session!"
        }
        
        success, response = self.run_test("Create Review", "POST", "reviews", 200, data=review_data)
        return success

    def test_get_reviews(self, reviewee_id: str = None):
        """Test getting reviews"""
        params = {"reviewee_id": reviewee_id} if reviewee_id else None
        success, response = self.run_test("Get Reviews", "GET", "reviews", 200, params=params)
        return success

def main():
    print("🚀 Starting Tutorly API Tests")
    print("=" * 50)
    
    tester = TutorlyAPITester()
    
    # Test 1: Root endpoint
    tester.test_root_endpoint()
    
    # Test 2: User management
    print("\n📝 Testing User Management")
    student_id = tester.test_create_user()
    if not student_id:
        print("❌ User creation failed, stopping tests")
        return 1
    
    tester.test_get_user(student_id)
    tester.test_update_user(student_id)
    
    # Create a tutor user
    tutor_data = {
        "name": "Test Tutor",
        "email": "tutor@test.com",
        "avatar": "https://example.com/tutor.jpg",
        "phone": "+1234567891",
        "bio": "Experienced math tutor"
    }
    
    success, tutor_response = tester.run_test("Create Tutor User", "POST", "users", 200, data=tutor_data)
    tutor_id = tutor_response.get('id') if success else None
    if tutor_id:
        tester.created_resources['users'].append(tutor_id)
    
    # Test 3: Request management
    print("\n📚 Testing Request Management")
    request_id = tester.test_create_request(student_id)
    if not request_id:
        print("❌ Request creation failed, stopping tests")
        return 1
    
    tester.test_get_requests()
    tester.test_get_request_by_id(request_id)
    
    # Test 4: Bidding system
    if tutor_id:
        print("\n💰 Testing Bidding System")
        bid_id = tester.test_create_bid(request_id, tutor_id)
        if bid_id:
            tester.test_get_bids(request_id)
            tester.test_accept_bid(bid_id, student_id)
    
    # Test 5: Payment system
    print("\n💳 Testing Payment System")
    tester.test_get_payments(student_id)
    
    # Test 6: Review system
    if tutor_id:
        print("\n⭐ Testing Review System")
        tester.test_create_review(request_id, student_id, tutor_id)
        tester.test_get_reviews(tutor_id)
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())