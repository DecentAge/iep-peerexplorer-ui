#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

docker build -t decentage/iep-peerexplorer-ui:latest .
docker container rm -f iep-peerexplorer-ui-extract
docker container create --name iep-peerexplorer-ui-extract decentage/iep-peerexplorer-ui:latest  
docker container cp iep-peerexplorer-ui-extract:/build .  
docker container rm -f iep-peerexplorer-ui-extract