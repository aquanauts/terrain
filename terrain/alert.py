import logging
import asyncio
from enum import Enum
import aiohttp


class Level(Enum):
    WARNING = "warning"
    ERROR = "error"
    INFO = "info"

class Alerts:
    async def send_alert(self, source, level, summary, routing_key=""):
        try:
            session = aiohttp.ClientSession()
            payload = {
                "routing_key": routing_key,
                "event_action": "trigger",
                "payload": {"summary": f"{source}: {summary}", "source": source, "severity": level.value,},
            }

            response = await session.post("https://events.pagerduty.com/v2/enqueue", json=payload)
            text = await response.text()
            if response.status != 202:
                logging.error("Failed to sent alert! Stopping.")
                logging.error("Status: %s", response.status)
                logging.error("Response: %s", text)
                logging.error("Payload: %s", str(payload))
                asyncio.get_event_loop().stop()
            await session.close()
            logging.info(
                "Sent alert (%s,%s,%s)", source, level, summary,
            )
        # pylint: disable=W0703
        except Exception:
            logging.exception("Error occured while reporting an error.")
            asyncio.get_event_loop().stop()
