#!/bin/bash

podman run -it --rm -h quay-workshop  --name quay-workshop \
    -p 8080:8080 \
    quay-workshop
