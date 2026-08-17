#!/bin/bash
NAME=$(docker ps --format '{{.Names}}' | grep ellrcj5)
echo "Container: $NAME"
echo "---LOGS---"
docker logs "$NAME" 2>&1 | tail -20
echo "---MOUNTS---"
docker inspect "$NAME" --format '{{json .Mounts}}'
echo ""
echo "---DATA---"
docker exec "$NAME" ls -la /app/data/ 2>&1
echo "---USER---"
docker exec "$NAME" whoami 2>&1
