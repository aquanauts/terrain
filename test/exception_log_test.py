from unittest import mock
from terrain.exception_log import ExceptionLog

def test_writes_to_a_file():
    with mock.patch('builtins.open', mock.mock_open()) as mock_fn:
        log = ExceptionLog()
        log.write("something")
        mock_fn.assert_called_with("exceptions.txt", "a")


def test_writes_actual_content():
    with mock.patch('builtins.open', mock.mock_open()) as mock_fn:
        log = ExceptionLog()
        log.write("something")
        handle = mock_fn()
        handle.write.assert_called_once_with("something\n")
