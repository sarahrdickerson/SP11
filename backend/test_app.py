import pytest

from app import app

@pytest.fixture
def client():
    app = app()
    app.app.config['TESTING'] = True

def test_init():
    """Test the initial / """

    rv = client.get('/api/generate')
    print(rv)
    assert b'Generating music' in rv.message
