FROM node:24-alpine

RUN apk add --no-cache git

WORKDIR /code
RUN git clone https://github.com/hyoo-ru/mam.git && cd mam && npm install

RUN mkdir -p mam/bog/wiki
COPY . mam/bog/wiki

RUN cd mam && npm start bog/wiki/app

WORKDIR /code/mam

# http://localhost:9081/bog/wiki/app/-/test.html
