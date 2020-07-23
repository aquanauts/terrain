import os.path

class SessionIDStore:
    def __init__(self):
        self.current_id = self.read_current_id()

    def read_current_id(self) -> int:
        if os.path.isfile('session_id_store.txt') is not True:
            open('session_id_store.txt', 'w')
        with open('session_id_store.txt', 'r+') as session_id_file:
            current_id = session_id_file.read()
            if current_id == "":
                session_id_file.write("0")
                current_id = "0"
        return int(current_id)

    def generate_new_id(self) -> int:
        self.current_id += 1
        with open('session_id_store.txt', 'w') as session_id_file:
            # Write current id
            session_id_file.write(str(self.current_id))
        return self.current_id
