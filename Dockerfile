FROM ubuntu:bionic

RUN apt-get update \
    && apt-get -y install make wget python3 \
    && rm -rf /var/lib/apt/lists/*

ADD . /root/terrain

WORKDIR /root/terrain

RUN make test

CMD "./run"
