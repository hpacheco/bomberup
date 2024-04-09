FROM ubuntu:22.04
RUN apt update && apt install -yq build-essential git curl
RUN curl -sSL https://get.haskellstack.org/ | sh
RUN curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | sh
ENV PATH="/root/.ghcup/bin:$PATH"
RUN curl -L -o elm.gz https://github.com/elm/compiler/releases/download/0.19.1/binary-for-linux-64-bit.gz
RUN gunzip elm.gz && chmod +x elm && mv elm /usr/local/bin/
RUN git clone http://github.com/hpacheco/bomberup
WORKDIR /bomberup
RUN cabal install bomberup
ENV PATH="/root/.cabal/bin:$PATH"
RUN apt install -yq rsync python3-pip python3.10-gdbm && pip install elm-doc
CMD ["bomberup"]
