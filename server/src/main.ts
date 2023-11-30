import express from "express";
import { createClient } from "redis";

const BASE_URL = "http://localhost/";
const PORT = 3000;
const app = express();

const redisClient = createClient();
redisClient.connect();

app.use(express.json());

app.get("/:hash", async (req, res) => {
	const hash = req.params.hash;
	const redisResponse = await retrieveFromRedis(hash);
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
	const hash = hashUrl(longUrl);

	try {
		const redisResponse = await saveToRedis(longUrl, hash);

		if (redisResponse.success) {
			const response = {
				key: redisResponse.value,
				"long-url": longUrl,
				"short-url": `${BASE_URL}${hash}`,
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
	console.log("Server running on port 3000");
});

function hashUrl(url: string) {
	let hash = 0;

	for (let i = 0; i < url.length; i++) {
		const char = url.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		// Make sure the hash fits within 16 bits
		hash = hash & 0xffff;
	}

	// Map the hash to a string of letters and numbers
	return hash.toString(36);
}

async function saveToRedis(longUrl: string, hash: string) {
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

async function retrieveFromRedis(hash: string) {
	try {
		const existingValue = await redisClient.get(hash);

		if (existingValue === null) {
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
