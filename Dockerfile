FROM node:24-alpine

RUN apk add --no-cache git

WORKDIR /code
RUN git clone https://github.com/hyoo-ru/mam.git && cd mam && npm install

RUN mkdir -p mam/bog/wiki
COPY . mam/bog/wiki
RUN cd mam/bog/wiki && git init -b dev && git remote add origin https://github.com/b-on-g/wiki.git && git add -A && git config user.email "ci" && git config user.name "ci" && git config pull.rebase true && git commit -m "local" && git fetch origin dev && git branch --set-upstream-to=origin/dev dev

RUN cd mam && npm start bog/wiki/app

WORKDIR /code/mam

# http://localhost:9081/bog/wiki/app/-/test.html
