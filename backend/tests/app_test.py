import pytest
from app import *

# Test backend is online
def test_defaultFunc():
    response = app.test_client().get('/')
    assert response.status_code == 200
    assert b"Backend is alive" in response.data

# Test DB connection exists
def test_endpointNumberOneFunc():
    response = app.test_client().post('/endpointOne', json={})
    assert response.status_code == 200
    assert b"someSQLdata" in response.data


def test_navbarDataFunc():
    response = app.test_client().post('/navbarData', json={
        "fakeUserID": 1,
        "userType": "Therapist"
    })
    assert response.status_code == 200
    assert b'"userName":"Vinson Ipsgrave"' in response.data
    assert b'"userType":"Therapist"' in response.data
    assert b'"userType":"Patient"' not in response.data
    assert b'"isActive":1' in response.data

    response = app.test_client().post('/navbarData', json={
        "fakeUserID": 1,
        "userType": "Patient"
    })
    assert response.status_code == 200
    assert b'"userName":"Orton Zavattieri"' in response.data
    assert b'"userType":"Patient"' in response.data
    assert b'"userType":"Therapist"' not in response.data

    response = app.test_client().post('/navbarData', json={
        "fakeUserID": -1,
        "userType": "Patient"
    })
    assert response.status_code == 404
    assert b'User not found' in response.data