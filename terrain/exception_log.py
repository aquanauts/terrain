
class ExceptionLog:


    def write(self, content):
        with open("exceptions.txt", "a") as exceptions:
            exceptions.write(content + "\n")


    def read(self):
        with open("exceptions.txt", "r") as exceptions:
            content = exceptions.read()
        return content


    def readlines(self):
        with open("exceptions.txt", "r") as exceptions:
            content = exceptions.readlines()
        return content
