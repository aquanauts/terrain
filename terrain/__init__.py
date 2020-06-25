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

    async def get_exception_log(self, _):
        # TODO does it need to self-update? How does one serve the HTML/CSS/JS to display
        # the table after also updating the error log content
        return web.Response(text=self.exception_log.read())

def create_app(exception_log):
    app = web.Application()
    app.terrain_service = Terrain(exception_log)
    app.add_routes([web.get('/fail', app.terrain_service.fail_route),
                    web.post('/receive_error', app.terrain_service.post_error),
                    web.get('/show_errors', app.terrain_service.get_exception_log),
                    web.static('/', "web"), # This must be the last route
                    ])
    return app

def main():
    # This code is not tested
    exception_log = ExceptionLog()
    app = create_app(exception_log)
    web.run_app(app)
