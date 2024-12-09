import pytest
from app import *

# Test backend is online
def test_patientDashFunc():
    response = app.test_client().post('/patientDashboardData', json={
        "patientId" : 1
    })
    assert response.status_code == 200
    assert b"journalEntry" in response.data
    assert b"exercise" in response.data
    assert b"height" in response.data
    assert b"sleep" in response.data
    assert b"stress" in response.data
    assert b"water" in response.data
    assert b"weight" in response.data
    assert b"energy" in response.data
    assert b"calories" in response.data