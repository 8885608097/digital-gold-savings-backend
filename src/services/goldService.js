// src/services/goldService.js

const axios = require("axios");
const GoldRate = require("../models/GoldRate");

let cachedRate = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

/**
 * Fetch gold rate from external API
 */
async function fetchFromAPI() {
  try {
    const API_URL = process.env.GOLD_RATE_API;
    const API_KEY = process.env.GOLD_RATE_API_KEY;

    const res = await axios.get(API_URL, {
      headers: { "x-access-token": API_KEY },
    });

    const price = res.data.price; // expected INR per gram
    if (!price) throw new Error("Invalid API response");

    const newRate = await GoldRate.create({
      source: "API_PROVIDER",
      ratePerGram: price,
      timestamp: new Date(),
    });

    return newRate;
  } catch (err) {
    console.error("❌ Error fetching gold rate:", err.message);
    return null;
  }
}

/**
 * Return latest gold rate (cache + DB fallback)
 */
async function getGoldRate() {
  const now = Date.now();

  // cached value
  if (cachedRate && now - lastFetchTime < CACHE_DURATION) {
    return cachedRate;
  }

  // fresh API fetch
  const apiRate = await fetchFromAPI();
  if (apiRate) {
    cachedRate = apiRate;
    lastFetchTime = now;
    return apiRate;
  }

  // DB fallback
  console.warn("⚠️ Using fallback DB gold rate");
  const lastRate = await GoldRate.findOne().sort({ timestamp: -1 });
  if (!lastRate) throw new Error("No gold rate available!");

  cachedRate = lastRate;
  lastFetchTime = now;
  return lastRate;
}

module.exports = {
  getGoldRate,
  fetchFromAPI,
};
