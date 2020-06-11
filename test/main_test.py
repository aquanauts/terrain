import io

from terrain import main

def test_main_wants_arguments():
    output = io.StringIO()
    args = ["main.py"]
    main(args, output)
    assert output.getvalue() == "I came here for an argument!\n"


def test_main_prints_arguments():
    output = io.StringIO()
    args = ["main.py", "foo", "bar"]
    main(args, output)
    assert output.getvalue() == f"Saw args {args}\n"
