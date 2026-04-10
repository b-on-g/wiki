FROM node:20-alpine

RUN apk add --no-cache git

WORKDIR /mam
# RUN git init && git commit --allow-empty -m "init"
RUN mkdir -p /mam/bog/wiki
COPY . /mam/bog/wiki

RUN npx mam bog/wiki/app

EXPOSE 9080

# http://localhost:9081/bog/wiki/app/-/test.html
