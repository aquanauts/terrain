
class ExceptionLog:
    def write(self, content):
        with open("exceptions.txt", "a") as exceptions:
            exceptions.write(content + "\n")
