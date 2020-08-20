import json

class ExceptionLog:

    def __init__(self, file_path=None):
        self.file_path = file_path
        self.file_path.touch(exist_ok=True)

    def write(self, content):
        with self.file_path.open(mode="a") as exceptions:
            exceptions.write(content + "\n")

    def read(self):
        return self.file_path.read_text()

    def read_entry(self, entry_id):
        all_entries = self.readlines()
        return json.loads(all_entries[entry_id])

    def find_session(self, session_id):
        session_entries = []
        all_entries = self.readlines()
        for idx, entry in enumerate(all_entries):
            dict_entry = json.loads(entry)
            dict_entry["id"] = idx
            if ("session" in dict_entry) and \
                (dict_entry["session"] == session_id or \
                dict_entry["session"] == int(session_id)):# should just be string
                session_entries.append(dict_entry)  # current log had some ints erroneously
        return session_entries

    def readlines(self):
        lines = self.read().split("\n")
        if lines[-1] == "":
            return lines[0:-1]
        return lines

    def get_length(self):
        return len(self.readlines())
