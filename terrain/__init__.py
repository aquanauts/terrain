from aiohttp import web
from terrain import app

def main():
    # This code is not tested
    webapp = app.create_app()
    web.run_app(webapp)
