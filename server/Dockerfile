FROM python:3.7.4-alpine

RUN apk update && apk add build-base py-pip python-dev \
    libffi-dev openssl-dev gcc libc-dev make

RUN apk add jpeg-dev zlib-dev

ENV LIBRARY_PATH=/lib:/usr/lib

WORKDIR /usr/src/app

COPY ./requirements.txt /usr/src/app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /usr/src/app