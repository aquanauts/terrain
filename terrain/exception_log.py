import json

class ExceptionLog:


    def write(self, content):
        with open("exceptions.txt", "a") as exceptions:
            exceptions.write(content + "\n")


    def read(self):
        with open("exceptions.txt", "r") as exceptions:
            content = exceptions.read()
        return content

    def read_entry(self, entry_id):
        with open("exceptions.txt", "r") as exceptions:
            all_entries = exceptions.readlines()
            entry = json.loads(all_entries[entry_id])
        return entry

    def find_session(self, session_id):
        with open("exceptions.txt", "r") as exceptions:
            session_entries = []
            all_entries = exceptions.readlines()
            for idx, entry in enumerate(all_entries):
                dict_entry = json.loads(entry)
                dict_entry["id"] = idx
                if ("session" in dict_entry) and \
                    (dict_entry["session"] == session_id or \
                    dict_entry["session"] == int(session_id)):# should just be string
                    session_entries.append(dict_entry)  # current log had some ints erroneously
            return session_entries

    def readlines(self):
        with open("exceptions.txt", "r") as exceptions:
            content = exceptions.readlines()
        return content
