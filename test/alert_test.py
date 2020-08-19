import asyncio
#import socket
import pytest
import asynctest
from terrain import alert
from terrain.alert import Level

EVENT_HOST = "localhost"


@pytest.fixture(name='mock_session')
def mock_session_fixture(mocker):
    # https://asynctest.readthedocs.io/en/latest/asynctest.mock.html
    mock_session = mocker.patch("aiohttp.ClientSession").return_value
    mock_session.post = asynctest.mock.CoroutineMock()
    mock_session.close = asynctest.mock.CoroutineMock()
    mock_session.post.return_value = asynctest.mock.CoroutineMock()
    mock_session.post.return_value.text = asynctest.mock.CoroutineMock()
    return mock_session

@pytest.fixture(name='alerts')
def alerts_fixture():
    return alert.Alerts()


async def test_sends_alerts_to_pagerduty(mock_session, alerts):
    await alerts.send_alert(source="Test", level=alert.Level.ERROR, summary="failwhale!", routing_key="test")
    expected_payload = {
        "routing_key": "test",
        "event_action": "trigger",
        "payload": {"summary": "Test: failwhale!", "source": "Test", "severity": Level.ERROR.value.lower(),},
    }
    mock_session.post.assert_called_with("https://events.pagerduty.com/v2/enqueue", json=expected_payload)


async def test_do_something_if_an_error_cannot_be_sent(mock_session, alerts):
    with asynctest.mock.patch.object(asyncio.get_event_loop(), "stop") as mock_stop:
        await alerts.send_alert("Test", alert.Level.ERROR, "failwhale!")
        mock_session.post.return_value.status = 400
        mock_stop.assert_called()


async def test_do_something_if_an_error_occurs_while_handling_an_error(mock_session, alerts):
    mock_session.post.side_effect = Exception()
    with asynctest.mock.patch.object(asyncio.get_event_loop(), "stop") as mock_stop:
        await alerts.send_alert("Test", alert.Level.ERROR, "bad things")
        mock_stop.assert_called()


async def test_closes_client_on_send(mock_session, alerts):
    await alerts.send_alert("Test", alert.Level.ERROR, "failwhale!")
    mock_session.close.assert_awaited()


async def xtest_just_logs_alerts_with_local_routing_key(mocker, mock_session):
    mocker.patch("socket.gethostname", return_value="localhost")
    alerts = alert.Alerts()
    await alerts.send_alert("source", Level.INFO, "Summary Winbow")
    mock_session.post.assert_not_awaited()
