#!/bin/sh

if [ "$1" = "staging" ]; then
  mv ./index.html ./index-prd.html
  mv /app/index-stg.html /app/index.html
fi
