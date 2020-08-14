import json
from unittest import mock
import pathlib
import pytest
from terrain.pager_duty_key_store import PagerDutyKeyStore
from terrain.pager_duty_key_store import obfuscate_keys

@pytest.fixture(name="key_data")
def key_data_fixture():
    return [{"name": "key 1", "host":"somehostname", "key":"aaa000"},
            {"name": "key 2", "host":"anotherhostname", "key":"bbb111"}]

@pytest.fixture(name="mock_path")
def mock_path_fixture():
    mock_path = mock.MagicMock(spec=pathlib.Path)
    mock_path.open = mock.mock_open()
    mock_path.read_text.return_value = ''
    return mock_path


@pytest.fixture(name='pager_duty_key_store')
def exception_log_fixture(mock_path):
    return PagerDutyKeyStore(mock_path)


def test_touches_file_on_creation(mock_path):
    PagerDutyKeyStore(mock_path)
    mock_path.touch.assert_called_with(exist_ok=True)


def test_opens_the_file_in_append_mode(pager_duty_key_store, mock_path, key_data):
    pager_duty_key_store.add_key(key_data[0])
    mock_path.open.assert_called_with(mode='w')


def test_adds_new_keys(pager_duty_key_store, mock_path, key_data):
    pager_duty_key_store.add_key(key_data[0])
    mock_path.open.return_value.write.assert_called_with(json.dumps(key_data[:-1]))


def test_reads_all_records(pager_duty_key_store, mock_path):
    mock_path.read_text.return_value = '[{"foo":"bar"}]'
    assert pager_duty_key_store.all_keys() == [{"foo":"bar"}]


def test_can_delete_a_record_by_id(pager_duty_key_store, mock_path, key_data):
    mock_path.read_text.return_value = json.dumps(key_data)
    pager_duty_key_store.delete_key("key 2")
    mock_path.open.return_value.write.assert_called_with(json.dumps(key_data[:-1]))

def test_can_obfuscate_keys(key_data):
    assert obfuscate_keys(key_data) == [
        {"name": "key 1", "host":"somehostname", "key":"**a000"},
        {"name": "key 2", "host":"anotherhostname", "key":"**b111"}]
