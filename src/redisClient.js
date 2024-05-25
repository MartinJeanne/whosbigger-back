const { createClient } = require('redis');
const expirationTime = 86400; // 24h

const createRedisClient = async () => {
  const client = await createClient({ url: process.env.REDIS_URL })
    .on('error', err => {
      console.error('Redis Client Error', err)
      throw Error('Redis Client Error', err)
    })
    .connect();
  return client;
};

exports.getJSON = async function (key) {
  const client = await createRedisClient();

  const keyStr = String(key);
  const value = await client.json.get(keyStr);
  await client.disconnect();

  return value;
}

exports.saveJSON = async function (key, value) {
  const client = await createRedisClient();

  const keyStr = String(key);
  await client.json.set(keyStr, '.', value);
  await client.expire(keyStr, expirationTime);
  await client.disconnect();
}

exports.getSTR = async function (key) {
  const client = await createRedisClient();

  const keyStr = String(key);
  const value = await client.get(keyStr);
  await client.disconnect();

  return value;

}


exports.saveSTR = async function (key, value) {
  const client = await createRedisClient();

  const keyStr = String(key);
  await client.set(keyStr, value);
  await client.expire(keyStr, expirationTime);
  await client.disconnect();
}
