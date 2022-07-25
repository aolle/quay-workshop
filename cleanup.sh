#!/bin/bash

docker rmi $(docker images -f "dangling=true" -q) -f 2>/dev/null
docker rmi quay-workshop 2>/dev/null

