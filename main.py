import pythonista
from pythonista import Service

tasks = []

def sample_heartbeat_task():
    print("heartbeat") # Print plays a lot better with iPython prompt than logging

if __name__ == '__main__':
    service = pythonista.Service()
    service.add(pythonista.interval_timer(5, sample_heartbeat_task))
    service.start()
