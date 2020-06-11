from aiohttp import web

async def fail_route(_):
    raise Exception("Raised test exception")

def create_app():
    app = web.Application()
    app.add_routes([web.get('/fail', fail_route),
                    web.static('/', "web")])
    return app

def main():
    # This code is not tested
    app = create_app()
    web.run_app(app)
