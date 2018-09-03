import asynctest
from asynctest.mock import CoroutineMock
import asyncio
import logging
from pythonista import Service

class ServiceTest(asynctest.TestCase):

    async def test_start(self):
        mock = CoroutineMock()
        service = Service()
        await service.start([mock()])
