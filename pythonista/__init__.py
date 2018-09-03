import asyncio
import logging
import os

async def interval_timer(seconds, method, *args):
    while True:
        method(*args)
        await asyncio.sleep(seconds)

class Service:
    async def start(self, tasks):
        log_level = os.getenv('LOG_LEVEL', 'INFO')
        logging.basicConfig(level=log_level, format='%(levelname)s - %(message)s')
        logging.info(f"Starting {len(tasks)} tasks with PID {os.getpid()}")
        return await asyncio.gather(*tasks)
