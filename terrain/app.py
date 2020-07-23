import json
from aiohttp import web
from terrain.exception_log import ExceptionLog
from terrain.session_id_store import SessionIDStore

class Terrain:
    def __init__(self, exception_log, session_id_store):
        self.exception_log = exception_log
        self.session_id_store = session_id_store

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

    async def get_error(self, req):
        record = self.exception_log.read_entry(int(req.query['id']))
        return web.json_response(data=record)

    async def get_session(self, req):
        session_records = self.exception_log.find_session(req.query['sessionID'])
        return web.json_response(data=session_records)

    async def get_exception_log(self, _):
        # TODO does it need to self-update? How does one serve the HTML/CSS/JS to display
        # the table after also updating the error log content
        return web.Response(text=self.exception_log.read())

    async def root_index(self, _):
        return web.FileResponse("web/index.html")

    async def generate_library(self, _):
        with open('web/t.js', 'r') as library_file:
            content = library_file.read()
        new_id = self.session_id_store.generate_new_id()
        library_with_id = content.replace('"replace with actual session id"', str(new_id), 1)
        # TODO Don't write this to disk, just return a web.Response
        # with the correct content-type: application/json
        return web.Response(body=library_with_id, content_type='application/javascript')

async def on_prepare(_, response):
    response.headers['cache-control'] = 'no-cache'

def create_app(exception_log=ExceptionLog(), session_id_store=SessionIDStore()):
    app = web.Application()
    app.on_response_prepare.append(on_prepare)
    app.terrain_service = Terrain(exception_log, session_id_store)
    app.add_routes([web.get('/', app.terrain_service.root_index),
                    web.get('/fail', app.terrain_service.fail_route),
                    web.post('/receive_error', app.terrain_service.post_error),
                    web.get('/show_errors', app.terrain_service.get_exception_log),
                    web.get('/t.js', app.terrain_service.generate_library),
                    web.get('/get_error', app.terrain_service.get_error),
                    web.get('/get_session', app.terrain_service.get_session),
                    web.static('/', "web"), # This must be the last route
                    ])
    return app
