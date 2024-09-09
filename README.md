# MongoDB

## Info
The backend of a website that challenges you to find the biggest city between two choices.

## Run
Example db:
```bash
docker run -d --name whosbigger-db --net="whosbigger" -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME="root" -e MONGO_INITDB_ROOT_PASSWORD="root" -e MONGO_INITDB_DATABASE="choices" mongo:7
```
Connection string:
```bash
MONGO_URL=mongodb://root:root@127.0.0.1:27017/choices?authSource=admin
```

# Build & Run with Docker
```bash
docker build -t whosbigger-back .
```

```bash
docker run -d --net="whosbigger" -p 3001:3001 --name whosbigger-back whosbigger-back
```
