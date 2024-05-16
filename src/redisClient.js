const { createClient } = require('redis');
const expirationTime = 86400; // 24h

exports.saveJSON = async function (key, value) {
  const client = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

  const keyStr = String(key);
  await client.json.set(keyStr, '.', value);
  await client.expire(keyStr, expirationTime);

  await client.disconnect();
}

exports.getJSON = async function (key) {
  const client = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

  const keyStr = String(key);
  const value = await client.json.get(keyStr);
  await client.disconnect();

  return value;
}