import asyncio
from threading import Thread
import logging
import os

async def interval_timer(seconds, method, *args):
    while asyncio.Task.current_task() and not asyncio.Task.current_task().cancelled():
        # TODO measure elapsed time here
        method(*args)
        await asyncio.sleep(seconds)

class Service:
    def __init__(self, loop=None):
        self.loop = loop or asyncio.get_event_loop()

    def add(self, coro):
        return self.loop.create_task(coro)

    def stop(self):
        for task in asyncio.Task.all_tasks():
            task.cancel()
        self.loop.stop()

    def _begin_loop(self):
        self.loop.run_forever()

    def __del__(self):
        self.loop.stop()

    def start(self):
        try:
            __IPYTHON__
            self.is_ipython = True
        except NameError:
            self.is_ipython = False
        if self.is_ipython:
            t = Thread(target=self._begin_loop)
            t.start()
        else:
            self._begin_loop()
