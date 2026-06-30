import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  googleApiKey: process.env.GOOGLE_API_KEY || "",
  googleModel: process.env.GOOGLE_MODEL || "gemini-1.5-flash",
};

if (!env.googleApiKey) {
  throw new Error("GOOGLE_API_KEY is missing in .env");
}
