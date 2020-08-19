import json
import pathlib
import asyncio
import logging
from jsmin import jsmin
from aiohttp import web
from terrain import alert
from terrain.exception_log import ExceptionLog
from terrain.session_id_store import SessionIDStore
from terrain.alert import Level
from terrain.pager_duty_key_store import PagerDutyKeyStore
from terrain.pager_duty_key_store import obfuscate_keys
#from classifier.tag import isTerrain

class Terrain:
    def __init__(self, exception_log, session_id_store, pager_duty_key_store, alerts):
        self.exception_log = exception_log
        self.session_id_store = session_id_store
        self.pager_duty_key_store = pager_duty_key_store
        self.alerts = alerts

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
        #TODO refactor
        #if "errorStack" in content_dict:
        #    print(content_dict["errorStack"])
        #    error_stack = content_dict["errorStack"]
        #else:
        #    error_stack = ''
        #if isTerrain(error_stack): # TODO add routing key
        #    await self.alerts.send_alert(source="Terrain", level=Level.ERROR, summary=error_stack)
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

    async def post_pager_duty_key(self, req):
        content = await req.content.read()
        decoded_content = content.decode()
        self.pager_duty_key_store.add_key(json.loads(decoded_content))
        return web.Response(text="Successfully added pager duty key")

    async def get_pager_duty_keys(self, _):
        all_keys = self.pager_duty_key_store.all_keys()
        return web.json_response(data=obfuscate_keys(all_keys))

    async def delete_pager_duty_key(self, req):
        self.pager_duty_key_store.delete_key(req.query["keyname"])
        return web.Response(text="Successfully removed a pager duty key.")

    async def root_index(self, _):
        return web.FileResponse("web/index.html")

    async def generate_library(self, _):
        with open('web/t.js', 'r') as library_file:
            content = library_file.read()
        new_id = self.session_id_store.generate_new_id()
        library_with_id = content.replace('"replace with actual session id"', str(new_id), 1)
        minified_library_with_id = jsmin(library_with_id, quote_chars="'\"`")
        return web.Response(body=minified_library_with_id, content_type='application/javascript')
 #       return web.Response(body=library_with_id, content_type='application/javascript')

async def on_prepare(_, response):
    response.headers['cache-control'] = 'no-cache'

async def set_exception_handler(alerts):
    asyncio.get_running_loop().set_exception_handler(create_exception_handler(alerts))

def create_exception_handler(alerts):
    def handle_exception(_, context):
        formatted_context_exception = "N/A"
        if "exception" in context:
            context_exception = context["exception"]
            formatted_context_exception = f"{type(context_exception).__name__}({context_exception})"

        exception_message = f"Caught exception {formatted_context_exception}. Message: {context['message']}"
        logging.exception(exception_message)
        return asyncio.ensure_future(alerts.send_alert("Terrain", Level.ERROR, exception_message))

    return handle_exception

def create_app(exception_log=None, session_id_store=None, pager_duty_key_store=None):
    if exception_log is None:
        exception_log = ExceptionLog(pathlib.Path("data/exceptions.txt"))
    if session_id_store is None:
        session_id_store = SessionIDStore()
    if pager_duty_key_store is None:
        pager_duty_key_store = PagerDutyKeyStore(pathlib.Path("data/pager_duty_key_store.txt"))
    app = web.Application()
    app.on_response_prepare.append(on_prepare)
    alerts = alert.Alerts()
    asyncio.ensure_future(set_exception_handler(alerts))
    app.terrain_service = Terrain(exception_log, session_id_store, pager_duty_key_store, alerts)
    app.add_routes([web.get('/', app.terrain_service.root_index),
                    web.get('/fail', app.terrain_service.fail_route),
                    web.post('/receive_error', app.terrain_service.post_error),
                    web.get('/show_errors', app.terrain_service.get_exception_log),
                    web.get('/t.js', app.terrain_service.generate_library),
                    web.get('/get_error', app.terrain_service.get_error),
                    web.get('/get_session', app.terrain_service.get_session),
                    web.get('/pager-duty-keys', app.terrain_service.get_pager_duty_keys),
                    web.post('/pager-duty-keys', app.terrain_service.post_pager_duty_key),
                    web.delete('/pager-duty-keys', app.terrain_service.delete_pager_duty_key),
                    web.static('/', "web"), # This must be the last route
                    ])
    return app
