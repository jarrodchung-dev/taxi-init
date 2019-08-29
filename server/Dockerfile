FROM python:3.7.4-alpine

RUN apk update && apk add gcc musl-dev python3-dev libffi-dev openssl-dev
RUN apk add build-base py-pip jpeg-dev zlib-dev

ENV LIBRARY_PATH=/lib:/usr/lib

WORKDIR /usr/src/app

COPY ./requirements.txt /usr/src/app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /usr/src/app

WORKDIR /usr/src/app/taxi

RUN python manage.py collectstatic --noinput