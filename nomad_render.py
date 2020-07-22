import argparse
from string import Template

parser = argparse.ArgumentParser(description="Nomad config generator")
parser.add_argument("template", action="store")
parser.add_argument("--version", action="store", dest="version", required=True)

args = parser.parse_args()

with open(args.template) as f:
    template = Template(f.read())
    print(template.substitute(args.__dict__))
