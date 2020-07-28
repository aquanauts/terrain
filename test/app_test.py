from unittest import mock
import json
import pytest
#import jsbeautifier
from terrain.app import create_app

@pytest.fixture(name='exception_log')
def exception_log_fixture():
    return mock.Mock()

@pytest.fixture(name='session_id_store')
def session_id_store_fixture():
    return mock.Mock()

@pytest.fixture(name='webapp')
def webapp_fixture(exception_log, session_id_store):
    return create_app(exception_log, session_id_store)

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

async def test_adds_cache_control_header(aiohttp_client, webapp):
    client = await aiohttp_client(webapp)
    resp = await client.get('/')
    assert "no-cache" in resp.headers['cache-control']

async def test_library_is_application_javascript_content_type(aiohttp_client, webapp):
    client = await aiohttp_client(webapp)
    resp = await client.get('/t.js')
    assert "application/javascript" in resp.headers['content-type']

async def test_webapp_writes_exceptions_to_the_log(aiohttp_client, webapp, exception_log):
    client = await aiohttp_client(webapp)
    exception_data = {"message": "message"}
    await client.post('/receive_error', data=json.dumps(exception_data))
    exception_log.write.assert_called_with(json.dumps(exception_data))

async def test_webapp_can_read_an_error_by_its_row_number(aiohttp_client, webapp, exception_log):
    expected_info = {"exceptionInfo": "stuff goes here"}
    exception_log.read_entry.return_value = expected_info
    client = await aiohttp_client(webapp)
    resp = await client.get('/get_error?id=42')
    assert resp.status == 200
    exception_log.read_entry.assert_called_with(42)
    body = await resp.text()
    assert json.loads(body) == expected_info

async def test_webapp_can_find_errors_by_session_id(aiohttp_client, webapp, exception_log):
    exception_log.find_session.return_value = [{"session": "stuff"}]
    client = await aiohttp_client(webapp)
    resp = await client.get('/get_session?sessionID=7')
    assert resp.status == 200
    exception_log.find_session.assert_called_with('7')
    body = await resp.text()
    assert json.loads(body) == [{"session": "stuff"}]

async def test_webapp_generates_library_with_session_id(aiohttp_client, webapp, session_id_store):
    client = await aiohttp_client(webapp)
    session_id_store.generate_new_id.return_value = 42
    resp = await client.get('/t.js')
    assert resp.status == 200
    session_id_store.generate_new_id.assert_called()
    body = await resp.text()
    assert "window.__terrainSessionID = 42;" in body

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
