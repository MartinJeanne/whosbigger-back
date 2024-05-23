# Redis
docker run -d --net="whosbigger" -p 6379:6379 --name whosbigger-redis -it redis/redis-stack-server:7.2.0-v10

# Back
docker build -t whosbigger-back .
docker run -d --net="whosbigger" -p 3001:3001 --name whosbigger-back whosbigger-back
