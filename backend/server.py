from fastapi import FastAPI, APIRouter, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from enum import Enum
import os
import uuid
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Tutorly API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure CORS
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

# Enums
class UserRole(str, Enum):
    STUDENT = "student"
    TUTOR = "tutor"

class RequestStatus(str, Enum):
    ACTIVE = "active"
    MATCHED = "matched"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class BidStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COUNTER_OFFERED = "counter_offered"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    RELEASED = "released"
    REFUNDED = "refunded"

# Helper functions
def prepare_for_mongo(data: dict) -> dict:
    """Prepare data for MongoDB storage"""
    if isinstance(data.get('created_at'), datetime):
        data['created_at'] = data['created_at'].isoformat()
    if isinstance(data.get('updated_at'), datetime):
        data['updated_at'] = data['updated_at'].isoformat()
    if isinstance(data.get('session_date'), datetime):
        data['session_date'] = data['session_date'].isoformat()
    return data

def parse_from_mongo(item: dict) -> dict:
    """Parse data from MongoDB"""
    if isinstance(item.get('created_at'), str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    if isinstance(item.get('updated_at'), str):
        item['updated_at'] = datetime.fromisoformat(item['updated_at'])
    if isinstance(item.get('session_date'), str):
        item['session_date'] = datetime.fromisoformat(item['session_date'])
    return item

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    current_role: UserRole = UserRole.STUDENT
    phone: Optional[str] = None
    bio: Optional[str] = None
    subjects: List[str] = []
    wallet_balance: float = 0.0
    ratings: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None

class TutoringRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    subject: str
    topic: str
    description: str
    duration_hours: int
    preferred_price: float
    max_price: float
    session_date: datetime
    location: str  # "online" or specific location
    urgency: str  # "low", "medium", "high"
    status: RequestStatus = RequestStatus.ACTIVE
    matched_tutor_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RequestCreate(BaseModel):
    subject: str
    topic: str
    description: str
    duration_hours: int
    preferred_price: float
    max_price: float
    session_date: datetime
    location: str
    urgency: str = "medium"

class Bid(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    request_id: str
    tutor_id: str
    offered_price: float
    message: str
    estimated_duration: int
    status: BidStatus = BidStatus.PENDING
    counter_offers: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BidCreate(BaseModel):
    request_id: str
    offered_price: float
    message: str
    estimated_duration: int

class Payment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    request_id: str
    student_id: str
    tutor_id: str
    amount: float
    commission: float
    tutor_earnings: float
    status: PaymentStatus = PaymentStatus.PENDING
    payment_method: str = "e_wallet"
    transaction_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    request_id: str
    reviewer_id: str
    reviewee_id: str
    rating: int  # 1-5
    comment: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# API Routes

@api_router.get("/")
async def root():
    return {"message": "Tutorly API is running!"}

# User routes
@api_router.post("/users", response_model=User)
async def create_user(user_data: UserCreate):
    user_dict = user_data.dict()
    user_obj = User(**user_dict)
    prepared_data = prepare_for_mongo(user_obj.dict())
    await db.users.insert_one(prepared_data)
    return user_obj

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    parsed_user = parse_from_mongo(user)
    return User(**parsed_user)

@api_router.put("/users/{user_id}", response_model=User)
async def update_user(user_id: str, updates: dict):
    updates["updated_at"] = datetime.now(timezone.utc)
    prepared_updates = prepare_for_mongo(updates)
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": prepared_updates}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await db.users.find_one({"id": user_id})
    parsed_user = parse_from_mongo(updated_user)
    return User(**parsed_user)

# Request routes
@api_router.post("/requests", response_model=TutoringRequest)
async def create_request(request_data: RequestCreate, student_id: str):
    request_dict = request_data.dict()
    request_dict["student_id"] = student_id
    request_obj = TutoringRequest(**request_dict)
    prepared_data = prepare_for_mongo(request_obj.dict())
    await db.requests.insert_one(prepared_data)
    return request_obj

@api_router.get("/requests", response_model=List[TutoringRequest])
async def get_requests(
    status: Optional[RequestStatus] = None,
    subject: Optional[str] = None,
    student_id: Optional[str] = None,
    limit: int = 50
):
    query = {}
    if status:
        query["status"] = status
    if subject:
        query["subject"] = {"$regex": subject, "$options": "i"}
    if student_id:
        query["student_id"] = student_id
    
    requests = await db.requests.find(query).limit(limit).to_list(limit)
    parsed_requests = [parse_from_mongo(req) for req in requests]
    return [TutoringRequest(**req) for req in parsed_requests]

@api_router.get("/requests/{request_id}", response_model=TutoringRequest)
async def get_request(request_id: str):
    request = await db.requests.find_one({"id": request_id})
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    parsed_request = parse_from_mongo(request)
    return TutoringRequest(**parsed_request)

@api_router.put("/requests/{request_id}", response_model=TutoringRequest)
async def update_request(request_id: str, updates: dict):
    updates["updated_at"] = datetime.now(timezone.utc)
    prepared_updates = prepare_for_mongo(updates)
    
    result = await db.requests.update_one(
        {"id": request_id},
        {"$set": prepared_updates}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    
    updated_request = await db.requests.find_one({"id": request_id})
    parsed_request = parse_from_mongo(updated_request)
    return TutoringRequest(**parsed_request)

# Bid routes
@api_router.post("/bids", response_model=Bid)
async def create_bid(bid_data: BidCreate, tutor_id: str):
    # Check if request exists and is active
    request = await db.requests.find_one({"id": bid_data.request_id})
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    if request["status"] != RequestStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Request is not active")
    
    # Check if tutor already has a bid on this request
    existing_bid = await db.bids.find_one({
        "request_id": bid_data.request_id,
        "tutor_id": tutor_id
    })
    if existing_bid:
        raise HTTPException(status_code=400, detail="Bid already exists for this request")
    
    bid_dict = bid_data.dict()
    bid_dict["tutor_id"] = tutor_id
    bid_obj = Bid(**bid_dict)
    prepared_data = prepare_for_mongo(bid_obj.dict())
    await db.bids.insert_one(prepared_data)
    return bid_obj

@api_router.get("/bids", response_model=List[Bid])
async def get_bids(
    request_id: Optional[str] = None,
    tutor_id: Optional[str] = None,
    status: Optional[BidStatus] = None,
    limit: int = 50
):
    query = {}
    if request_id:
        query["request_id"] = request_id
    if tutor_id:
        query["tutor_id"] = tutor_id
    if status:
        query["status"] = status
    
    bids = await db.bids.find(query).limit(limit).to_list(limit)
    parsed_bids = [parse_from_mongo(bid) for bid in bids]
    return [Bid(**bid) for bid in parsed_bids]

@api_router.put("/bids/{bid_id}", response_model=Bid)
async def update_bid(bid_id: str, updates: dict):
    updates["updated_at"] = datetime.now(timezone.utc)
    prepared_updates = prepare_for_mongo(updates)
    
    result = await db.bids.update_one(
        {"id": bid_id},
        {"$set": prepared_updates}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Bid not found")
    
    updated_bid = await db.bids.find_one({"id": bid_id})
    parsed_bid = parse_from_mongo(updated_bid)
    return Bid(**parsed_bid)

@api_router.post("/bids/{bid_id}/accept")
async def accept_bid(bid_id: str, student_id: str):
    # Get the bid
    bid = await db.bids.find_one({"id": bid_id})
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    
    # Get the request and verify ownership
    request = await db.requests.find_one({"id": bid["request_id"]})
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    if request["student_id"] != student_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update bid status
    await db.bids.update_one(
        {"id": bid_id},
        {"$set": {"status": BidStatus.ACCEPTED, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Update request status and match tutor
    await db.requests.update_one(
        {"id": bid["request_id"]},
        {"$set": {
            "status": RequestStatus.MATCHED,
            "matched_tutor_id": bid["tutor_id"],
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Reject all other bids for this request
    await db.bids.update_many(
        {"request_id": bid["request_id"], "id": {"$ne": bid_id}},
        {"$set": {"status": BidStatus.REJECTED, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Create payment record
    commission_rate = 0.15  # 15% commission
    amount = bid["offered_price"]
    commission = amount * commission_rate
    tutor_earnings = amount - commission
    
    payment = Payment(
        request_id=bid["request_id"],
        student_id=student_id,
        tutor_id=bid["tutor_id"],
        amount=amount,
        commission=commission,
        tutor_earnings=tutor_earnings
    )
    
    prepared_payment = prepare_for_mongo(payment.dict())
    await db.payments.insert_one(prepared_payment)
    
    return {"message": "Bid accepted successfully", "payment_id": payment.id}

# Payment routes
@api_router.get("/payments", response_model=List[Payment])
async def get_payments(
    student_id: Optional[str] = None,
    tutor_id: Optional[str] = None,
    status: Optional[PaymentStatus] = None,
    limit: int = 50
):
    query = {}
    if student_id:
        query["student_id"] = student_id
    if tutor_id:
        query["tutor_id"] = tutor_id
    if status:
        query["status"] = status
    
    payments = await db.payments.find(query).limit(limit).to_list(limit)
    parsed_payments = [parse_from_mongo(payment) for payment in payments]
    return [Payment(**payment) for payment in parsed_payments]

@api_router.post("/payments/{payment_id}/process")
async def process_payment(payment_id: str):
    # Mock payment processing
    result = await db.payments.update_one(
        {"id": payment_id},
        {"$set": {
            "status": PaymentStatus.PAID,
            "transaction_id": f"txn_{uuid.uuid4().hex[:8]}",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    return {"message": "Payment processed successfully"}

@api_router.post("/payments/{payment_id}/release")
async def release_payment(payment_id: str):
    # Release payment to tutor after session completion
    payment = await db.payments.find_one({"id": payment_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    if payment["status"] != PaymentStatus.PAID:
        raise HTTPException(status_code=400, detail="Payment not in paid status")
    
    # Update payment status
    await db.payments.update_one(
        {"id": payment_id},
        {"$set": {
            "status": PaymentStatus.RELEASED,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Update tutor wallet balance
    await db.users.update_one(
        {"id": payment["tutor_id"]},
        {"$inc": {"wallet_balance": payment["tutor_earnings"]}}
    )
    
    return {"message": "Payment released to tutor"}

# Review routes
@api_router.post("/reviews", response_model=Review)
async def create_review(review_data: dict):
    review_obj = Review(**review_data)
    prepared_data = prepare_for_mongo(review_obj.dict())
    await db.reviews.insert_one(prepared_data)
    return review_obj

@api_router.get("/reviews", response_model=List[Review])
async def get_reviews(
    reviewee_id: Optional[str] = None,
    limit: int = 50
):
    query = {}
    if reviewee_id:
        query["reviewee_id"] = reviewee_id
    
    reviews = await db.reviews.find(query).limit(limit).to_list(limit)
    parsed_reviews = [parse_from_mongo(review) for review in reviews]
    return [Review(**review) for review in parsed_reviews]

# Include the router in the main app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)