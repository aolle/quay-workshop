#!/bin/bash

podman rmi $(podman images -f "dangling=true" -q) -f 2>/dev/null
podman rmi quay-workshop 2>/dev/null

