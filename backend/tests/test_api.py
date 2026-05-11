from fastapi.testclient import TestClient
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app import auth, models


app.dependency_overrides[auth.get_current_user] = lambda: models.User(id=1, email="admin@test.com", role="admin")

client = TestClient(app)

def test_candidates_api_response():
    response = client.get("/api/candidates/")
    
    assert response.status_code == 200
    
    data = response.json()
    
    assert "items" in data
    assert "total" in data
    
    print(f"\n API Test Passed! Found {data['total']} candidates in the database.")
    
def test_register_user():
    test_email = f"testuser_{os.urandom(4).hex()}@example.com"
    payload = {
        "email": test_email,
        "password": "testpassword123",
        "role": "reviewer"
    }
    response = client.post("/api/register", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_email
    assert "id" in data
    print(f"\n Registration Test Passed! User {test_email} created successfully.")
