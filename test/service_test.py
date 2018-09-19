import asynctest
import asyncio
import logging
from pythonista import Service

class ServiceTest(asynctest.TestCase):

    # gather propagates the first failing task up to the future
    # Unclear if remaining tasks continue

    def setUp(self):
        self.service = Service(self.loop)

    async def test_error_handling(self):
        async def bomb():
            raise Exception("boom!")
        await self.service.add(bomb())

    async def test_add_coroutine(self):
        future = self.loop.create_future()
        async def coro():
            future.set_result("done")

        await self.service.add(coro())
        assert future.result() == "done"
