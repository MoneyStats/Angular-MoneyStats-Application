#!/bin/sh

if [ "$1" = "staging" ]; then
  mv ./src/index.html ./src/index-prd.html
  mv ./src/index-stg.html ./src/index.html
fi
