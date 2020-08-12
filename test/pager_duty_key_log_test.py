from unittest import mock
import json
import pathlib
import pytest
from terrain.pager_duty_key_log import PagerDutyKeyLog

@pytest.fixture(name="mock_path")
def mock_path_fixture():
    mock_path = mock.MagicMock(spec=pathlib.Path)
    mock_path.open = mock.mock_open()
    return mock_path


@pytest.fixture(name='pager_duty_key_log')
def exception_log_fixture(mock_path):
    return PagerDutyKeyLog(mock_path)


def test_touches_file_on_creation(mock_path):
    PagerDutyKeyLog(mock_path)
    mock_path.touch.assert_called_with(exist_ok=True)


def test_opens_the_file_in_append_mode(pager_duty_key_log, mock_path):
    pager_duty_key_log.write('something')
    mock_path.open.assert_called_with(mode='a')


def test_writes_records_with_newlines(pager_duty_key_log, mock_path):
    pager_duty_key_log.write('something')
    mock_path.open.return_value.write.assert_called_with('something\n')


def test_reads_from_a_file(pager_duty_key_log, mock_path):
    mock_path.read_text.return_value = "content"
    assert pager_duty_key_log.read() == "content"

def test_reads_lines_from_a_file(pager_duty_key_log, mock_path):
    mock_path.read_text.return_value = '{"host":"somehostname", "key":"000"}\n{"host":"anotherhostname", "key":"111"}\n'
    assert pager_duty_key_log.readlines() == ['{"host":"somehostname", "key":"000"}', \
            '{"host":"anotherhostname", "key":"111"}']

def test_deletes_lines_from_a_file(pager_duty_key_log, mock_path):
    mock_path.read_text.return_value = '{"host":"somehostname", "key":"000"}\n{"host":"anotherhostname", "key":"111"}\n'
    assert pager_duty_key_log.delete_key(1) == ['{"host":"somehostname", "key":"000"}']
    mock_path.open.return_value.write.assert_called_with('{"host":"somehostname", "key":"000"}\n')
