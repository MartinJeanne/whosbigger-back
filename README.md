# Redis
docker run -d --name whosbigger-redis --net="whosbigger" -p 6379:6379 -v /local-data/:/data -e REDIS_ARGS="--save 20 1" redis/redis-stack:latest

# Back
docker build -t whosbigger-back .
docker run -d --net="whosbigger" -p 3001:3001 --name whosbigger-back whosbigger-back
