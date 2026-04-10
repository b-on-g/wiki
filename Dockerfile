FROM node:20-alpine

RUN apk add --no-cache git

WORKDIR /code
RUN mkdir -p /code/bog/wiki
COPY . /code/bog/wiki

RUN npm exec mam bog/wiki/app

EXPOSE 9080

# http://localhost:9081/bog/wiki/app/-/test.html
