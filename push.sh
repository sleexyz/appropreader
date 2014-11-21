#!/bin/sh

cd build
s3cmd sync . s3://appropreader.sean.lee.mx/ --delete-removed
