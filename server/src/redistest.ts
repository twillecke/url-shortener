async function test() {
	const redis = require("redis");
	const redisClient = redis.createClient(6379, "127.0.0.1");
	redisClient.connect();

	const result = await redisClient.get("name");
    console.log(result);
}

test();