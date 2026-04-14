FROM node:24-alpine

RUN apk add --no-cache git

WORKDIR /code
RUN git clone https://github.com/hyoo-ru/mam.git && cd mam && npm install

# 1) Pull all deps and build from git
RUN cd mam && npm start bog/wiki/app

# 2) Overwrite wiki with local files, rebuild without pulling
COPY . mam/bog/wiki
ENV MAM_PULL_DISABLED=1
RUN cd mam && npm start bog/wiki/app

WORKDIR /code/mam

# http://localhost:9081/bog/wiki/app/-/test.html
