#!/bin/bash

inkscape -z -e assets/apple-touch-icon.png -w 57 -h 57 assets/javascripture.svg
inkscape -z -e assets/apple-touch-icon-57x57-precomposed.png -w 57 -h 57 assets/javascripture.svg
inkscape -z -e assets/apple-touch-icon-72x72-precomposed.png -w 72 -h 72 assets/javascripture.svg
inkscape -z -e assets/apple-touch-icon-76x76-precomposed.png -w 76 -h 76 assets/javascripture.svg
inkscape -z -e assets/apple-touch-icon-114x114-precomposed.png -w 114 -h 114 assets/javascripture.svg
inkscape -z -e assets/apple-touch-icon-120x120-precomposed.png -w 120 -h 120 assets/javascripture.svg
inkscape -z -e assets/apple-touch-icon-144x144-precomposed.png -w 144 -h 144 assets/javascripture.svg
inkscape -z -e assets/apple-touch-icon-152x152-precomposed.png -w 152 -h 152 assets/javascripture.svg
inkscape -z -e assets/apple-touch-icon-180x180-precomposed.png -w 180 -h 180 assets/javascripture.svg

inkscape -z -e assets/touch-icon-128x128.png -w 128 -h 128 assets/javascripture.svg
inkscape -z -e assets/touch-icon-192x192.png -w 192 -h 192 assets/javascripture.svg

echo 'icons created'