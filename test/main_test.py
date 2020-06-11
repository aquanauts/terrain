import pytest

from terrain import create_app

@pytest.fixture(name='webapp')
def webapp_fixture():
    return create_app()


async def test_webapp_has_a_fail_route_for_testing_errors(aiohttp_client, webapp):
    client = await aiohttp_client(webapp)
    resp = await client.get('/fail')
    assert resp.status == 500
    text = await resp.text()
    assert "500 Internal Server Error" in text


async def test_webapp_serves_static_content(aiohttp_client, webapp):
    client = await aiohttp_client(webapp)
    resp = await client.get('/index.html')
    assert resp.status == 200
    text = await resp.text()
    assert "Terrain" in text
