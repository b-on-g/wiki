FROM node:24-alpine

RUN apk add --no-cache git

WORKDIR /code
RUN git clone https://github.com/hyoo-ru/mam.git && cd mam && npm install

RUN mkdir -p mam/bog/wiki
COPY . mam/bog/wiki
RUN cd mam/bog/wiki && git clone https://github.com/b-on-g/wiki.git /tmp/wiki-git && cp -rf /tmp/wiki-git/.git . && rm -rf /tmp/wiki-git && git checkout -f dev

RUN cd mam && git config --global pull.rebase true && npm start bog/wiki/app

WORKDIR /code/mam

# http://localhost:9081/bog/wiki/app/-/test.html
