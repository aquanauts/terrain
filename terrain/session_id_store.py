import os.path

#TODO separate a filestore class
#class SessionIDStore(FileStore):
class SessionIDStore:
    def __init__(self):
        self.session_file = "data/session_id_store.txt"
        #self.file_store = FileStore(self.session_file)
        self.current_id = self.read_current_id()

    def read_current_id(self) -> int:
        if os.path.isfile(self.session_file) is not True:
            open(self.session_file, 'w')
        with open(self.session_file, 'r+') as session_id_file:
            current_id = session_id_file.read()
            if current_id == "":
                session_id_file.write("0")
                current_id = "0"
        return int(current_id)

    def generate_new_id(self) -> int:
        self.current_id += 1
        with open(self.session_file, 'w') as session_id_file:
            # Write current id
            session_id_file.write(str(self.current_id))
        return self.current_id
