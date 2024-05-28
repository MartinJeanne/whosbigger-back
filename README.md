# Redis
docker run -d --name whosbigger-db --net="whosbigger" -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME="root" -e MONGO_INITDB_ROOT_PASSWORD="root" -e MONGO_INITDB_DATABASE="choices" mongo:7


# Back
docker build -t whosbigger-back .
docker run -d --net="whosbigger" -p 3001:3001 --name whosbigger-back whosbigger-back
