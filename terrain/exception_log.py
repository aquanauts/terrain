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

    def readlines(self):
        with open("exceptions.txt", "r") as exceptions:
            content = exceptions.readlines()
        return content
