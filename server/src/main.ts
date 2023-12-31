import express from "express";
import { createClient } from "redis";

const BASE_URL = process.env.BASE_URL || "http://localhost";
const PORT = process.env.PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");

const app = express();

const redisClient = createClient({
	url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});
redisClient.connect();

app.use(express.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization",
	);
	next();
});

app.get("/:hash", async (req, res) => {
	const hash = req.params.hash;
	const redisResponse = await getData(hash);
	if (redisResponse.success) {
		if (typeof redisResponse.value === "string")
			res.status(302).location(redisResponse.value).send();
	} else {
		res.status(404).send({
			success: false,
			message: "Value not found in Redis",
		});
	}
});

app.post("/", async (req, res) => {
	const longUrl = req.body.url;
	const urlRegex =
		/^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

	if (!urlRegex.test(longUrl)) {
		res.status(400).send({
			error: "Bad Request",
			details: "The provided URL is not valid",
		});
		return;
	}

	const hash = hashUrl(longUrl);

	try {
		const redisResponse = await setData(longUrl, hash);

		if (redisResponse.success) {
			const response = {
				key: redisResponse.value,
				"long-url": longUrl,
				"short-url": `${BASE_URL}/${hash}`,
			};
			res.status(200).send(response);
		} else {
			res.status(500).send({
				error: "Failed to save to Redis",
				details: redisResponse.message,
			});
		}
	} catch (error: any) {
		console.error(`Error processing request: ${error}`);
		res.status(500).send({
			error: "Internal Server Error",
			details: error.message,
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

function hashUrl(url: string) {
	let hash = 0;

	for (let i = 0; i < url.length; i++) {
		const char = url.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & 0xffff;
	}
	return hash.toString(36);
}

async function setData(longUrl: string, hash: string) {
	try {
		const existingValue = await redisClient.get(longUrl);
		if (existingValue) {
			return {
				success: true,
				message: "URL already exists in Redis",
				value: existingValue,
			};
		}

		await redisClient.set(hash, longUrl);

		return { success: true, message: "URL saved to Redis successfully" };
	} catch (error) {
		console.error("Error saving URL to Redis:", error);
		return { success: false, message: "Failed to save URL to Redis" };
	}
}

async function getData(hash: string) {
	try {
		const existingValue = await redisClient.get(hash);

		if (!existingValue) {
			return { success: false, message: "Value not found in Redis" };
		}
		return {
			success: true,
			message: "Key found in Redis",
			value: existingValue,
		};
	} catch (error) {
		console.error("Error retrieving value from Redis:", error);
		throw new Error("Failed to retrieve value from Redis");
	}
}
