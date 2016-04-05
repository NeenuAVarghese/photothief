#!/bin/bash

gitrepo="/opt/git/photothief"

http=$(ps aux 2>/dev/null | grep p8000 | grep -i screen | awk '{print $2}')
node=$(ps aux 2>/dev/null | grep n8000 | grep -i screen | awk '{print $2}')
json=$(ps aux 2>/dev/null | grep j3000 | grep -i screen | awk '{print $2}')
checkrepo=$(git config --get "remote.origin.url" 2>/dev/null | grep -o photothief)

[ -z "$json" ] || kill $json
[ -z "$http" ] || kill $http
[ -z "$node" ] || kill $node

if [ "$1" = "-k" -o "$1" = "--kill" ]; then
  echo "[photothief is terminating]"
  exit 0
elif [ ! -z "$1" ]; then
  echo -e "USAGE:  $0"
  echo -e "\t$0 --kill"
fi

if [ -z "$checkrepo" ]; then
  cd "$gitrepo" || echo "ERROR: Invalid directory $gitrepo"
  [ "$checkrepo" = "photothief" ] || echo "Wrong git repo, try again"
fi

#screen -dmSL p8000 python -m http.server
screen -dmS n8000 node server/ptserver.js
screen -dmS j3000 json-server jsondb/db.json
