#!/bin/sh

if [ "$1" = "staging" ]; then
  mv /app/index.html /app/index-prd.html
  mv /app/index-stg.html /app/index.html
fi
