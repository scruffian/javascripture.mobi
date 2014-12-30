#!/bin/bash

timestamp=$(date +%s)

perl -pi -e "s/version: ([0-9]+).([0-9]+).([0-9]+)/version: \1.\2.$timestamp/g" javascripture.appcache

echo 'cache cleared'