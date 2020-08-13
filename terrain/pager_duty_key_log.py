import json

class PagerDutyKeyLog:

    def __init__(self, file_path=None):
        self.file_path = file_path
        self.file_path.touch(exist_ok=True)

    def write(self, content):
        with self.file_path.open(mode="a") as key_log:
            key_log.write(content + "\n")

    def read(self):
        return self.file_path.read_text()

    def readlines(self):
        lines = self.read().split("\n")
        if lines[-1] == "":
            return lines[0:-1]
        return lines

    def delete_key(self, num):
        lines = self.readlines()
        lines.pop(int(num))
        with self.file_path.open(mode="w") as key_log:
            for line in lines:
                key_log.write(line + "\n")
        return lines
