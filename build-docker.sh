#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

RELEASE_VERSION=$(cat release-version.txt)
docker build -t decentage/iep-peerexplorer-ui:${RELEASE_VERSION} .

docker rm --force iep-peerexplorer-ui-extract 2>/dev/null

CONTAINER_ID=$(docker create --rm --name iep-peerexplorer-ui-extract decentage/iep-peerexplorer-ui:${RELEASE_VERSION})
mkdir -p ./build

# Copy the compiled package from the container to the host
docker cp ${CONTAINER_ID}:/build/iep-peerexplorer-ui.zip ./build

docker rm iep-peerexplorer-ui-extract