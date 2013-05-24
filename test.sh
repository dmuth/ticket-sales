#!/bin/bash
#
# This script is for testing out our ticket processing webserver.
#

#
# Errors are fatal
#
set -e

#
# This is slightly unsafe, but useful for testing.
#
killall node || true

echo "Waiting for webserver to start..."
node ./main.js &
sleep 1

curl localhost:3000
curl localhost:3000/seat/check/orchestra/a/3
curl localhost:3000/seat/lock/orchestra/a/3
curl localhost:3000/seat/claim/orchestra/a/3
curl localhost:3000/seat/unlock/orchestra/a/3
curl localhost:3000/seat/num_available

echo "Waiting for webserver to shut down..."
kill %1
sleep 3
echo "All done!"

