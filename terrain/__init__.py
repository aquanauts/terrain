import json
from aiohttp import web
from terrain.exception_log import ExceptionLog


class Terrain:
    def __init__(self, exception_log):
        self.exception_log = exception_log

    async def fail_route(self, _):
        raise Exception("Raised test exception")

    async def post_error(self, req):
        # req is the aiohttp request object
        # https://docs.aiohttp.org/en/stable/web_reference.html#aiohttp.web.BaseRequest
        content = await req.content.read()
        decoded_content = content.decode()

        # validate that the content is really JSON
        json.loads(decoded_content)

        self.exception_log.write(decoded_content)

        return web.Response(text="Attempted to append error information to the log.")

def create_app(exception_log):
    app = web.Application()
    app.terrain_service = Terrain(exception_log)
    app.add_routes([web.get('/fail', app.terrain_service.fail_route),
                    web.static('/', "web"),
                    web.post('/error', app.terrain_service.post_error)
                    ])
    return app

def main():
    # This code is not tested
    exception_log = ExceptionLog()
    app = create_app(exception_log)
    web.run_app(app)
