const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const clientUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(clientUrl);
client.get = util.promisify(client.get);
client.hget = util.promisify(client.hget);
client.set = util.promisify(client.set);
client.hset = util.promisify(client.hset);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  console.log('hash key',this.hashKey);
  return this;
}

mongoose.Query.prototype.exec = async function () {

  // If a query is not cached yet
  if(!this.useCache) {
    const result = await exec.apply(this, arguments);
    console.log('data from db with no cache', result.length)
    return result;
  }

  // Create a unique and consistent key for a query 
  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));

  // Try to get the cached data from Redis by the combintaion of a hash key and a unique key
  // If it is then return the result, previously converted into array fo models instead of array of JSON objects
  const cachedData = await client.hget(this.hashKey, key).catch(err => console.log(err));
  if(cachedData) {
    const doc = JSON.parse(cachedData);
    console.log('cachedData',doc.length, this.hashKey)

    return Array.isArray(doc) 
      ? doc.map(el => new this.model(el))
      : new this.model(doc);
  }

  // If there is no cached data in Redis for given keys, then execute query to the DB
  const result = await exec.apply(this, arguments);

  // And set the data to the Redis to store it for the future
  console.log('data from db', result)
  client.hset(this.hashKey, key, JSON.stringify(result));
  return result;
}

module.exports = {
  clearHash(hashKey) {
    JSON.stringify(client.del(hashKey));
  }
}