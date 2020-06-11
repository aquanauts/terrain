
def main(args, stdout):
    if len(args) == 1:
        stdout.write("I came here for an argument!\n")
    else:
        stdout.write(f"Saw args {args}\n")
