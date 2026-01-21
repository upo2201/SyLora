import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("Fetching models from:", URL.replace(API_KEY, "HIDDEN_KEY"));

try {
  const response = await fetch(URL);
  const data = await response.json();

  if (data.models) {
    console.log("Available Models:");
    data.models.forEach(m => console.log(`- ${m.name}`));
  } else {
    console.log("No models found or error:", JSON.stringify(data, null, 2));
  }
} catch (error) {
  console.error("Fetch failed:", error);
}
