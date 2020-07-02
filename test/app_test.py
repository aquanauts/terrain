from unittest import mock
import json
import pytest

from terrain.app import create_app

@pytest.fixture(name='exception_log')
def exception_log_fixture():
    return mock.Mock()

@pytest.fixture(name='webapp')
def webapp_fixture(exception_log):
    return create_app(exception_log)


async def test_webapp_serves_log_content_and_returns_http_200(aiohttp_client, webapp, exception_log):
    client = await aiohttp_client(webapp)
    exception_data = json.dumps({"message" : "message"})
    exception_log.read.return_value = exception_data
    resp = await client.get('/show_errors')
    assert resp.status == 200
    text = await resp.text()
    assert text == exception_data

async def test_webapp_serves_index_html_at_root_path(aiohttp_client, webapp):
    client = await aiohttp_client(webapp)
    resp = await client.get('/')
    assert resp.status == 200
    html = await resp.text()
    assert "Terrain" in html

async def test_webapp_writes_exceptions_to_the_log(aiohttp_client, webapp, exception_log):
    client = await aiohttp_client(webapp)
    exception_data = {"message": "message"}
    await client.post('/receive_error', data=json.dumps(exception_data))
    exception_log.write.assert_called_with(json.dumps(exception_data))


async def test_webapp_records_exceptions_and_returns_http_200(aiohttp_client, webapp):
    client = await aiohttp_client(webapp)
    exception_data = {
        "message": "message",
        "url": "http://localhost",
        "lineNo": 42,
        "colNo": 80,
        "error": {}
    }
    resp = await client.post('/receive_error', data=json.dumps(exception_data))
    assert resp.status == 200
    text = await resp.text()
    assert text == "Attempted to append error information to the log."

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
