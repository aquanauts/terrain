from unittest import mock
from terrain.session_id_store import SessionIDStore

def test_handles_empty_session_id_store_file():
    with mock.patch('builtins.open', mock.mock_open()) as mock_fn:
        mock_fn.return_value.read.return_value = ""
        session_id_store = SessionIDStore()
        assert session_id_store.read_current_id() == 0
        mock_fn.assert_called_with("session_id_store.txt", "r+")

def test_reads_current_session_id():
    with mock.patch('builtins.open', mock.mock_open()) as mock_fn:
        mock_fn.return_value.read.return_value = "1"
        session_id_store = SessionIDStore()
        assert session_id_store.read_current_id() == 1
        mock_fn.assert_called_with("session_id_store.txt", "r+")

def test_generates_and_updates_new_session_id():
    with mock.patch('builtins.open', mock.mock_open()) as mock_fn:
        mock_fn.return_value.read.return_value = "41"
        session_id_store = SessionIDStore()
        assert session_id_store.generate_new_id() == 42
        mock_fn.assert_called_with("session_id_store.txt", "w")
        #assert session_id_store.read_current_id() == 42 TODO does this break because of mocking?
