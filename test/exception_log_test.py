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


def test_reads_from_a_file():
    with mock.patch('builtins.open', mock.mock_open()) as mock_fn:
        log = ExceptionLog()
        log.read()
        mock_fn.assert_called_with("exceptions.txt", "r")

def test_reads_entry_from_a_file():
    with mock.patch('builtins.open', mock.mock_open()) as mock_fn:
        mock_fn.return_value.readlines.return_value = ['{"line":1}', '{"line":2}']
        log = ExceptionLog()
        assert log.read_entry(entry_id=0) == {"line": 1}
        mock_fn.assert_called_with("exceptions.txt", "r")

def test_reads_correct_content():
    with mock.patch('builtins.open', mock.mock_open()) as mock_fn:
        log = ExceptionLog()
        log.write("something")
        log.write("something else")
        mock_fn.return_value.read.return_value = "something\nsomething_else\n"
        assert log.read() == "something\nsomething_else\n"
        # https://stackoverflow.com/questions/18191275/using-pythons-mock-patch-object-to-change-the-return-value-of-a-method-called-w
