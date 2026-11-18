#!/bin/sh
set -e
RESOLVER=$(awk 'BEGIN{ORS=" "} $1=="nameserver" { ip=$2; sub(/%.*/, "", ip); if (ip ~ /:/ && ip !~ /^\[/) ip="[" ip "]"; if (ip != "") print ip }' /etc/resolv.conf)
if [ -z "$RESOLVER" ]; then
  RESOLVER="127.0.0.11 8.8.8.8"
fi
echo "resolver $RESOLVER valid=30s ipv6=off;" > /etc/nginx/conf.d/resolver.conf
