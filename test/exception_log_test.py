from unittest import mock
import pathlib
import pytest
from terrain.exception_log import ExceptionLog

@pytest.fixture(name="mock_path")
def mock_path_fixture():
    mock_path = mock.MagicMock(spec=pathlib.Path)
    mock_path.open = mock.mock_open()
    return mock_path


@pytest.fixture(name='exception_log')
def exception_log_fixture(mock_path):
    return ExceptionLog(mock_path)


def test_touches_file_on_creation(mock_path):
    ExceptionLog(mock_path)
    mock_path.touch.assert_called_with(exist_ok=True)


def test_opens_the_file_in_append_mode(exception_log, mock_path):
    exception_log.write('something')
    mock_path.open.assert_called_with(mode='a')


def test_writes_records_with_newlines(exception_log, mock_path):
    exception_log.write('something')
    mock_path.open.return_value.write.assert_called_with('something\n')


def test_reads_from_a_file(exception_log, mock_path):
    mock_path.read_text.return_value = "content"
    assert exception_log.read() == "content"


def test_reads_entry_from_a_file(exception_log, mock_path):
    mock_path.read_text.return_value = "zero\none\ntwo\n"
    assert exception_log.read_entry(1) == "one"


def test_reads_session_entries_from_a_file(exception_log, mock_path):
    # key must be identical to actual key used
    mock_path.read_text.return_value = '{"session":11}\n{"session":7}\n{"session":7}\n'
    assert exception_log.find_session(session_id=7) == [{"session": 7, "id": 1}, {"session": 7, "id": 2}]
