import json
from asynctest import mock
import pytest
import jsbeautifier
from terrain.app import create_app
from terrain import app
from terrain.pager_duty_key_store import obfuscate_keys
from terrain import alert
from terrain.alert import Level

# pylint: disable=W0703

@pytest.fixture(name='exception_log')
def exception_log_fixture():
    return mock.Mock()

@pytest.fixture(name='session_id_store')
def session_id_store_fixture():
    return mock.Mock()

@pytest.fixture(name='pager_duty_key_store')
def pager_duty_key_store_fixture():
    return mock.Mock()

@pytest.fixture(name='webapp')
def webapp_fixture(exception_log, session_id_store, pager_duty_key_store):
    return create_app(exception_log, session_id_store, pager_duty_key_store)

@pytest.fixture(name='mock_session')
def mock_session_fixture(mocker):
    # https://asynctest.readthedocs.io/en/latest/asynctest.mock.html
    mock_session = mocker.patch("aiohttp.ClientSession").return_value
    mock_session.post = mock.CoroutineMock()
    mock_session.close = mock.CoroutineMock()
    mock_session.post.return_value = mock.CoroutineMock()
    mock_session.post.return_value.text = mock.CoroutineMock()
    return mock_session


@pytest.fixture(name='mock_alerts')
def mock_alerts_fixture(mocker):
    mock_alerts = mock.MagicMock(spec=alert.Alerts)
    mocker.patch("terrain.alert.Alerts", return_value=mock_alerts)
    return mock_alerts

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

async def test_webapp_serves_log_content_and_returns_http_200(aiohttp_client, webapp, exception_log):
    client = await aiohttp_client(webapp)
    exception_data = json.dumps({"message" : "message"})
    exception_log.read.return_value = exception_data
    resp = await client.get('/show_errors')
    assert resp.status == 200
    text = await resp.text()
    assert text == exception_data

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
    assert "window.__terrainSessionID = 42;" in jsbeautifier.beautify(body)


async def test_webapp_has_a_fail_route_for_testing_errors(aiohttp_client, webapp):
    client = await aiohttp_client(webapp)
    resp = await client.get('/fail')
    assert resp.status == 500
    text = await resp.text()
    assert "500 Internal Server Error" in text

async def test_webapp_writes_pager_duty_keys_to_the_log(aiohttp_client, webapp, pager_duty_key_store):
    client = await aiohttp_client(webapp)
    key_data = {
        "host": "somehostname",
        "key": "314"
    }

    await client.post('/pager-duty-keys', data=json.dumps(key_data))
    pager_duty_key_store.add_key.assert_called_with(key_data)

async def test_webapp_records_pager_duty_keys_and_returns_http_200(aiohttp_client, webapp):
    client = await aiohttp_client(webapp)
    key_data = {
        "host": "somehostname",
        "key": "314"
    }
    # TODO Change to use `pager-duty-key` resource
    resp = await client.post('/pager-duty-keys', data=json.dumps(key_data))
    assert resp.status == 200
    text = await resp.text()
    assert text == "Successfully added pager duty key"

async def test_webapp_serves_pager_duty_key_log_content_and_returns_http_200(aiohttp_client,\
        webapp, pager_duty_key_store):
    client = await aiohttp_client(webapp)
    key_data = [{
        "host": "somehostname",
        "key": "3141592"
    }]
    pager_duty_key_store.all_keys.return_value = key_data
    resp = await client.get('/pager-duty-keys')
    assert resp.status == 200
    text = await resp.text()
    assert text == json.dumps(obfuscate_keys(key_data))


async def test_webapp_deletes_pager_duty_key_log_content_and_returns_http_200(aiohttp_client, webapp,\
        pager_duty_key_store):
    client = await aiohttp_client(webapp)
    key_data = [{"name": "key_1", "host": "somehostname", "key": "314"},\
            {"name": "key_2", "host": "someotherhostname", "key": "227"}]
    pager_duty_key_store.all_keys.return_value = key_data

    resp = await client.delete('/pager-duty-keys?keyname=key_2')
    assert resp.status == 200
    pager_duty_key_store.delete_key.assert_called_with('key_2')
    text = await resp.text()
    assert text == "Successfully removed a pager duty key."


async def test_webapp_serves_static_content(aiohttp_client, webapp):
    client = await aiohttp_client(webapp)
    resp = await client.get('/index.html')
    assert resp.status == 200
    text = await resp.text()
    assert "Terrain" in text

async def test_webapp_exception_handler_sends_pager_duty_alerts(mock_alerts):
    handler = app.create_exception_handler(mock_alerts)
    try:
        raise Exception("Woah!")
    except Exception as ex:
        await handler(None, {"message": "Something bad", "exception": ex})
        mock_alerts.send_alert.assert_awaited_with(
            "Terrain", Level.ERROR, "Caught exception Exception(Woah!). Message: Something bad",
        )

async def test_webapp_exception_handler_sends_pager_duty_alerts_when_no_exception_in_context(mock_alerts):
    handler = app.create_exception_handler(mock_alerts)
    await handler(None, {"message": "Something bad"})
    mock_alerts.send_alert.assert_awaited_with(
        "Terrain", Level.ERROR, "Caught exception N/A. Message: Something bad",
    )
