import "dotenv/config";
import { SportradarClient } from "../dist/index.js";

const apiKey = process.env.SPORTRADAR_API_KEY;
const baseUrl = process.env.SPORTRADAR_BASE_URL;
const accessLevel = process.env.SPORTRADAR_ACCESS_LEVEL;

if (!apiKey) {
  throw new Error("Missing SPORTRADAR_API_KEY. Add it to .env.");
}

const client = new SportradarClient({ apiKey, baseUrl, accessLevel });

console.log("Live smoke test configured.");
console.log("Base URL:", baseUrl ?? "https://api.sportradar.com");
console.log("Access level:", accessLevel ?? "trial");
console.log("API key loaded:", `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`);
console.log("Ready to call NCAA endpoints.");
