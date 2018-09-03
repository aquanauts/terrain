import logging
import os
import asyncio
import pythonista
from pythonista import Service

def sample_heartbeat_task():
    logging.debug("heartbeat")

def main():
    service = pythonista.Service()
    tasks = []
    tasks.append(pythonista.interval_timer(5, sample_heartbeat_task))

    loop = asyncio.get_event_loop()
    loop.run_until_complete(service.start(tasks))

if __name__ == '__main__':
    main()
