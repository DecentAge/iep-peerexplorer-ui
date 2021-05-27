#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

RELEASE_VERSION=$(cat release-version.txt)
docker build -t decentage/iep-peerexplorer-ui:${RELEASE_VERSION} .

CID=$(docker create decentage/iep-peerexplorer-ui:${RELEASE_VERSION})
mkdir -p ./build
docker cp ${CID}:/build/iep-peerexplorer-ui.zip ./build

#docker container rm -f iep-peerexplorer-ui-extract
#docker container create --name iep-peerexplorer-ui-extract decentage/iep-peerexplorer-ui:${RELEASE_VERSION}  
#docker container cp iep-peerexplorer-ui-extract:/build .  
#docker container rm -f iep-peerexplorer-ui-extract