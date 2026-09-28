// ========================================================
// TravelMate Minimal Node.js Backend Server
// Frontend -> Backend -> JSON Database
// Groq AI Integration (openai/gpt-oss-120b)
// ========================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');
const ENV_FILE = path.join(__dirname, '.env');
const STATIC_DIR = __dirname;

// Load .env variables server-side securely
function loadEnv() {
  const envCandidates = [
    ENV_FILE,
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '..', '.env')
  ];
  for (const envPath of envCandidates) {
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim();
          let val = trimmed.slice(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          // Do not overwrite keys already set in the environment
          if (key && process.env[key] === undefined) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}
loadEnv();


// Initial Database Seed Data
const initialDB = {
  trips: [
    {
      id: "trip-kyoto",
      destination: "Kyoto, Japan",
      dates: { departure: "2026-10-12", return: "2026-10-15", durationDays: 4 },
      budget: { amount: 2500, currency: "USD ($)", currencySymbol: "$" },
      travellers: { type: "Couple/Pair", count: 2 },
      preferences: { travelStyle: "Cultural & Historic", accommodation: "Gion Komachi Ryokan & Spa", pace: "Balanced" }
    }
  ],
  itinerary: [
    {
      id: "trip-kyoto-day-1",
      tripId: "trip-kyoto",
      day: 1,
      city: "Kyoto, Central & Arashiyama",
      hotel: "Gion Komachi Ryokan & Spa",
      activities: {
        morning: { title: "Check-in & Welcome Matcha Ceremony", time: "09:30 AM - 11:30 AM", desc: "Drop bags at cozy wooden ryokan. Savor warm wagashi sweets.", tip: "Slip into floral yukata robes!" },
        afternoon: { title: "Arashiyama Bamboo Grove & Tenryu-ji", time: "01:00 PM - 04:30 PM", desc: "Wander through emerald bamboo stalks.", tip: "Grab soft-serve matcha ice cream." },
        evening: { title: "Gion Lantern Walk & Kamo River Ramen", time: "06:30 PM - 09:00 PM", desc: "Walk along stone-paved canal illuminated by paper lanterns.", tip: "Sit tatami-style for steaming ramen." }
      }
    },
    {
      id: "trip-kyoto-day-2",
      tripId: "trip-kyoto",
      day: 2,
      city: "Kyoto, Southern Higashiyama",
      hotel: "Gion Komachi Ryokan & Spa",
      activities: {
        morning: { title: "Early Morning at Fushimi Inari Taisha", time: "07:30 AM - 10:30 AM", desc: "Hike through thousands of scarlet Torii gates.", tip: "Take quiet mountain path for city views." },
        afternoon: { title: "Kiyomizu-dera & Sannenzaka Slopes", time: "01:00 PM - 04:00 PM", desc: "Marvel at the wooden temple stage.", tip: "Browse craft shops selling ceramics." },
        evening: { title: "Pontocho Alley Foodie Crawl", time: "06:00 PM - 08:30 PM", desc: "Duck into cozy izakayas for charcoal yakitori.", tip: "Book river-facing terrace seating." }
      }
    },
    {
      id: "trip-kyoto-day-3",
      tripId: "trip-kyoto",
      day: 3,
      city: "Kyoto, Northern Higashiyama",
      hotel: "Gion Komachi Ryokan & Spa",
      activities: {
        morning: { title: "Kinkaku-ji (The Golden Pavilion)", time: "09:00 AM - 11:30 AM", desc: "Admire pavilion covered in gold leaf.", tip: "Buy an omikuji fortune slip." },
        afternoon: { title: "Stroll the Philosopher's Path", time: "01:30 PM - 04:30 PM", desc: "Tranquil stone path along canal with cherry trees.", tip: "Stop for chilled udon noodles." },
        evening: { title: "Cozy Ryokan Kaiseki Feast & Onsen", time: "07:00 PM - 09:30 PM", desc: "Multi-course seasonal dinner served in your room.", tip: "Perfect calm night to journal." }
      }
    },
    {
      id: "trip-kyoto-day-4",
      tripId: "trip-kyoto",
      day: 4,
      city: "Kyoto, Downtown & Station",
      hotel: "Gion Komachi Ryokan & Spa",
      activities: {
        morning: { title: "Nishiki Market Feast", time: "09:30 AM - 12:00 PM", desc: "Sample dashi tamagoyaki and strawberry daifuku.", tip: "Buy packaged ceremonial matcha." },
        afternoon: { title: "Kyoto Botanical Gardens Stroll", time: "01:30 PM - 04:00 PM", desc: "Relax on wide green lawns with bento box.", tip: "Gentle unwind before transit." },
        evening: { title: "Shinkansen Farewell Bento", time: "06:00 PM - 08:30 PM", desc: "Bullet train ride watching city neon lights fade.", tip: "Paste ticket stubs into scrapbook!" }
      }
    }
  ],
  packing: [
    {
      id: "trip-kyoto-packing",
      tripId: "trip-kyoto",
      items: [
        { id: 1, text: "Passport & copies", cat: "documents", checked: true },
        { id: 2, text: "Flight / Rail e-tickets", cat: "documents", checked: true },
        { id: 3, text: "Travel insurance card", cat: "documents", checked: true },
        { id: 4, text: "Comfortable walking sneakers", cat: "clothes", checked: true },
        { id: 5, text: "Light breeze cardigan & jacket", cat: "clothes", checked: true },
        { id: 6, text: "3x Linen shirts & tee", cat: "clothes", checked: true },
        { id: 7, text: "Cozy socks & sleepwear", cat: "clothes", checked: false },
        { id: 8, text: "Travel mini shampoo & soap", cat: "toiletries", checked: true },
        { id: 9, text: "Sunscreen SPF 50+", cat: "toiletries", checked: true },
        { id: 10, text: "Toothbrush & mint paste", cat: "toiletries", checked: true },
        { id: 11, text: "Universal power adapter plug", cat: "electronics", checked: true },
        { id: 12, text: "Portable power bank 10,000mAh", cat: "electronics", checked: true },
        { id: 13, text: "Camera & memory card", cat: "electronics", checked: false },
        { id: 14, text: "Earphones / AirPods", cat: "electronics", checked: true },
        { id: 15, text: "Hand-held travel journal & pen", cat: "fun", checked: true },
        { id: 16, text: "Matcha KitKats & gummy snacks", cat: "fun", checked: true },
        { id: 17, text: "Cute washi tape & stickers", cat: "fun", checked: true },
        { id: 18, text: "Foldable tote bag for shopping", cat: "fun", checked: false }
      ]
    }
  ],
  budget: [
    {
      id: "trip-kyoto-budget",
      tripId: "trip-kyoto",
      categories: [
        { name: "Accommodation", allocated: 1000, spent: 750, color: "#BAE6FD" },
        { name: "Flights & Transit", allocated: 650, spent: 420, color: "#C6F6D5" },
        { name: "Food & Cafes", allocated: 500, spent: 180, color: "#FFF1B0" },
        { name: "Activities", allocated: 200, spent: 45, color: "#FFCCD5" },
        { name: "Souvenirs", allocated: 150, spent: 25, color: "#E9D5FF" }
      ],
      amounts: { total: 2500, spent: 1420, remaining: 1080 },
      expenses: [
        { title: "Ryokan 2-night deposit", cat: "Accommodation", amount: 450 },
        { title: "Kansai Haruka Express Train", cat: "Flights & Transit", amount: 75 },
        { title: "Gion Kaiseki Tasting Set", cat: "Food & Cafes", amount: 95 },
        { title: "Bamboo Grove Matcha Cones", cat: "Food & Cafes", amount: 12 },
        { title: "Ceramic Sake Cup Souvenir", cat: "Souvenirs", amount: 25 }
      ]
    }
  ]
};

// Database Helpers
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
      return initialDB;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading database:", err);
    return initialDB;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
}

// Request Body Parser Helper
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', err => reject(err));
  });
}

// Fallback generator when AI key is missing or unavailable
function generateFallbackAIPlan(pref) {
  const dur = pref.durationDays || 4;
  const budgetVal = pref.budget || 2000;
  const days = [];

  for (let i = 1; i <= dur; i++) {
    days.push({
      dayNum: i,
      title: `Day ${i}: Wandering & Exploring ${pref.destination}`,
      city: `${pref.destination} Central`,
      hotel: pref.accommodation || "Cozy Boutique Stay",
      slots: {
        morning: {
          title: `Day ${i}: Morning Local Bakery & Iconic Landmark`,
          time: "09:00 AM - 12:00 PM",
          desc: `Stroll through the morning streets of ${pref.destination}. Soak in the ${pref.travelStyle} ambiance.`,
          tip: "Take a morning polaroid and save the cute receipt!"
        },
        afternoon: {
          title: `Day ${i}: Cultural Discovery & Artisan Stalls`,
          time: "01:30 PM - 04:30 PM",
          desc: `Visit local markets, gardens, and scenic spots tailored for ${pref.travelerType}.`,
          tip: "Carry your water bottle and comfortable walking shoes."
        },
        evening: {
          title: `Day ${i}: Fairy-Lit Dinner & Scrapbook Time`,
          time: "06:30 PM - 09:00 PM",
          desc: `Enjoy delicious regional food under warm lanterns. Journal down 3 highlights.`,
          tip: "Write a short sweet note in your travel scrapbook."
        }
      }
    });
  }

  return {
    summary: `A lovely ${dur}-day journey to ${pref.destination} curated for ${pref.travelerType} with a ${pref.travelStyle} vibe!`,
    hotelName: pref.accommodation || "Boutique Hotel",
    days: days,
    packing: [
      { text: "Passport & ID cards", cat: "documents" },
      { text: "Travel tickets & vouchers", cat: "documents" },
      { text: "Weather-appropriate jacket & layers", cat: "clothes" },
      { text: "Comfortable exploration sneakers", cat: "clothes" },
      { text: "Sunscreen & daily skincare", cat: "toiletries" },
      { text: "Universal travel plug adapter", cat: "electronics" },
      { text: "Power bank charger", cat: "electronics" },
      { text: "Handheld camera / polaroid", cat: "electronics" },
      { text: "Scrapbook travel journal & pens", cat: "fun" },
      { text: "Local walking snacks & mints", cat: "fun" }
    ],
    budget: {
      categories: [
        { name: "Accommodation", allocated: Math.round(budgetVal * 0.40), spent: 0, color: "#BAE6FD" },
        { name: "Flights & Transit", allocated: Math.round(budgetVal * 0.25), spent: 0, color: "#C6F6D5" },
        { name: "Food & Cafes", allocated: Math.round(budgetVal * 0.20), spent: 0, color: "#FFF1B0" },
        { name: "Activities", allocated: Math.round(budgetVal * 0.10), spent: 0, color: "#FFCCD5" },
        { name: "Souvenirs", allocated: Math.round(budgetVal * 0.05), spent: 0, color: "#E9D5FF" }
      ]
    }
  };
}

// Call Groq AI API (openai/gpt-oss-120b)
async function callGroqAI(pref) {
  const apiKey = (process.env.XAI_API_KEY || process.env.GROQ_API_KEY || '').trim();

  if (!apiKey || apiKey === '$$$$$' || apiKey.toLowerCase().includes('your_')) {
    throw new Error("Missing XAI_API_KEY: put your Groq key (starts with gsk_) in the project .env file as XAI_API_KEY.");
  }

  const prompt = `You are TravelMate's travel planner.
Generate a structured and realistic day-by-day travel plan based on these user preferences:
- Destination: ${pref.destination}
- Departure Date: ${pref.departureDate}
- Return Date: ${pref.returnDate}
- Duration: ${pref.durationDays} days
- Total Budget: ${pref.currencySymbol || '$'}${pref.budget} (${pref.currency || 'USD'})
- Travelers: ${pref.travelersCount} (${pref.travelerType})
- Travel Style: ${pref.travelStyle}
- Accommodation Preference: ${pref.accommodation}
- Travel Pace: ${pref.pace}

Consider destination climate and seasonal weather during travel dates when suggesting packing items!

Respond ONLY in valid raw JSON with this exact schema:
{
  "summary": "1-2 warm sentences capturing the trip summary",
  "hotelName": "Suggested hotel or stay name",
  "days": [
    {
      "dayNum": 1,
      "title": "Day title",
      "city": "City or neighborhood name",
      "hotel": "Hotel or stay name",
      "slots": {
        "morning": { "title": "Morning activity title", "time": "09:00 AM - 12:00 PM", "desc": "Detailed description of morning activity", "tip": "Helpful insider tip" },
        "afternoon": { "title": "Afternoon activity title", "time": "01:30 PM - 04:30 PM", "desc": "Detailed description of afternoon activity", "tip": "Helpful insider tip" },
        "evening": { "title": "Evening activity title", "time": "06:30 PM - 09:00 PM", "desc": "Detailed description of evening activity", "tip": "Helpful insider tip" }
      }
    }
  ],
  "packing": [
    { "text": "Item name tailored to weather and destination", "cat": "documents|clothes|toiletries|electronics|fun" }
  ],
  "budget": {
    "categories": [
      { "name": "Accommodation", "allocated": 1000, "spent": 0, "color": "#BAE6FD" },
      { "name": "Flights & Transit", "allocated": 600, "spent": 0, "color": "#C6F6D5" },
      { "name": "Food & Cafes", "allocated": 500, "spent": 0, "color": "#FFF1B0" },
      { "name": "Activities", "allocated": 250, "spent": 0, "color": "#FFCCD5" },
      { "name": "Souvenirs", "allocated": 150, "spent": 0, "color": "#E9D5FF" }
    ]
  }
}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: "You are TravelMate, a warm travel planner assistant. Respond ONLY with a valid JSON object matching the requested schema. No markdown formatting, no code fences, just raw JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    let errMsg = `Groq API returned HTTP ${response.status}`;
    try {
      const errObj = JSON.parse(errText);
      if (errObj && errObj.error && errObj.error.message) {
        errMsg = `Groq API: ${errObj.error.message}`;
      }
    } catch (_) {
      errMsg = `Groq API returned HTTP ${response.status}: ${errText}`;
    }
    throw new Error(errMsg);
  }

  const result = await response.json();
  let content = result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content;
  if (!content) {
    throw new Error("No content received from Groq AI response");
  }

  if (typeof content === "string") {
    content = content.trim();
    if (content.startsWith("```")) {
      content = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }
    return JSON.parse(content);
  }
  return content;
}

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// Server Request Handler
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // ================= API ENDPOINTS =================

  if ((pathname === '/api/health' || pathname === '/health') && req.method === 'GET') {
    const hasKey = !!(process.env.XAI_API_KEY || process.env.GROQ_API_KEY);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, groqKeyConfigured: hasKey }));
    return;
  }

  // 1. POST /generate-trip or /api/generate-trip (Groq AI Trip Generation)
  if ((pathname === '/generate-trip' || pathname === '/api/generate-trip') && req.method === 'POST') {
    try {
      const preferences = await parseBody(req);
      let aiResult;
      let usedFallback = false;

      try {
        aiResult = await callGroqAI(preferences);
      } catch (aiErr) {
        if (process.env.ENABLE_MOCK_FALLBACK === 'true') {
          console.warn("Groq AI note, using fallback:", aiErr.message);
          aiResult = generateFallbackAIPlan(preferences);
          usedFallback = true;
        } else {
          // Re-throw API failure to allow frontend error banner and retry handling
          throw aiErr;
        }
      }

      // Construct Trip Object
      const tripId = `trip-${Date.now()}`;
      const trip = {
        id: tripId,
        destination: preferences.destination,
        dates: {
          departure: preferences.departureDate,
          return: preferences.returnDate,
          durationDays: preferences.durationDays
        },
        budget: {
          amount: preferences.budget,
          currency: preferences.currency,
          currencySymbol: preferences.currencySymbol || '$'
        },
        travellers: {
          type: preferences.travelerType,
          count: preferences.travelersCount
        },
        preferences: {
          travelStyle: preferences.travelStyle,
          accommodation: aiResult.hotelName || preferences.accommodation,
          pace: preferences.pace
        }
      };

      // Construct Itinerary Days
      const itinerary = (aiResult.days || []).map((day, idx) => ({
        id: `${tripId}-day-${day.dayNum || idx + 1}`,
        tripId: tripId,
        day: day.dayNum || idx + 1,
        city: day.city || preferences.destination,
        hotel: day.hotel || trip.preferences.accommodation,
        activities: day.slots || {}
      }));

      // Construct Packing Items
      const packing = (aiResult.packing || []).map((p, idx) => ({
        id: Date.now() + idx,
        text: p.text,
        cat: p.cat || 'fun',
        checked: false
      }));

      // Construct Budget
      const budgetCategories = (aiResult.budget && aiResult.budget.categories) || [
        { name: "Accommodation", allocated: Math.round(preferences.budget * 0.40), spent: 0, color: "#BAE6FD" },
        { name: "Flights & Transit", allocated: Math.round(preferences.budget * 0.25), spent: 0, color: "#C6F6D5" },
        { name: "Food & Cafes", allocated: Math.round(preferences.budget * 0.20), spent: 0, color: "#FFF1B0" },
        { name: "Activities", allocated: Math.round(preferences.budget * 0.10), spent: 0, color: "#FFCCD5" },
        { name: "Souvenirs", allocated: Math.round(preferences.budget * 0.05), spent: 0, color: "#E9D5FF" }
      ];

      const budget = {
        id: `${tripId}-budget`,
        tripId: tripId,
        categories: budgetCategories,
        amounts: { total: preferences.budget, spent: 0, remaining: preferences.budget },
        expenses: []
      };

      // Save into Database
      const db = readDB();
      db.trips.unshift(trip);
      itinerary.forEach(it => db.itinerary.push(it));
      db.packing.push({ id: `${tripId}-packing`, tripId, items: packing });
      db.budget.push(budget);
      writeDB(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        tripId: tripId,
        usedFallback: usedFallback,
        summary: aiResult.summary,
        trip: trip,
        itinerary: itinerary,
        packing: packing,
        budget: budget
      }));
    } catch (e) {
      console.error("Trip generation error:", e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: e.message || "Failed to generate trip with Groq AI",
        canRetry: true
      }));
    }
    return;
  }

  // 2. GET /api/trips (List all trips)
  if (pathname === '/api/trips' && req.method === 'GET') {
    const db = readDB();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.trips));
    return;
  }

  // 3. POST /api/trips (Manual create)
  if (pathname === '/api/trips' && req.method === 'POST') {
    try {
      const payload = await parseBody(req);
      const db = readDB();
      const trip = payload.trip;
      const itinerary = payload.itinerary || [];
      const packing = payload.packing || [];
      const budget = payload.budget || { categories: [], amounts: {}, expenses: [] };

      db.trips.unshift(trip);
      itinerary.forEach(it => {
        db.itinerary.push({
          id: `${trip.id}-day-${it.day}`,
          tripId: trip.id,
          day: it.day,
          city: it.city,
          hotel: it.hotel,
          activities: it.activities
        });
      });
      db.packing.push({ id: `${trip.id}-packing`, tripId: trip.id, items: packing });
      db.budget.push({
        id: `${trip.id}-budget`,
        tripId: trip.id,
        categories: budget.categories || [],
        amounts: budget.amounts || { total: trip.budget.amount, spent: 0, remaining: trip.budget.amount },
        expenses: budget.expenses || []
      });

      writeDB(db);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, tripId: trip.id }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // 4. GET /api/trips/:id (Get full trip bundle)
  const tripMatch = pathname.match(/^\/api\/trips\/([^/]+)$/);
  if (tripMatch && req.method === 'GET') {
    const tripId = tripMatch[1];
    const db = readDB();
    const trip = db.trips.find(t => t.id === tripId);

    if (!trip) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Trip not found' }));
      return;
    }

    const itinerary = db.itinerary.filter(it => it.tripId === tripId).sort((a, b) => a.day - b.day);
    const packingRecord = db.packing.find(p => p.tripId === tripId);
    const budgetRecord = db.budget.find(b => b.tripId === tripId);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      trip,
      itinerary,
      packing: packingRecord ? packingRecord.items : [],
      budget: budgetRecord || null
    }));
    return;
  }

  // 5. PUT /api/trips/:id (Edit trip details)
  if (tripMatch && req.method === 'PUT') {
    try {
      const tripId = tripMatch[1];
      const payload = await parseBody(req);
      const db = readDB();
      const index = db.trips.findIndex(t => t.id === tripId);

      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Trip not found' }));
        return;
      }

      db.trips[index] = { ...db.trips[index], ...payload };
      writeDB(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, trip: db.trips[index] }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // 6. DELETE /api/trips/:id (Delete trip)
  if (tripMatch && req.method === 'DELETE') {
    const tripId = tripMatch[1];
    const db = readDB();
    
    db.trips = db.trips.filter(t => t.id !== tripId);
    db.itinerary = db.itinerary.filter(it => it.tripId !== tripId);
    db.packing = db.packing.filter(p => p.tripId !== tripId);
    db.budget = db.budget.filter(b => b.tripId !== tripId);

    writeDB(db);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, deletedId: tripId }));
    return;
  }

  // 7. PUT /api/trips/:id/packing (Update packing items)
  const packingMatch = pathname.match(/^\/api\/trips\/([^/]+)\/packing$/);
  if (packingMatch && req.method === 'PUT') {
    try {
      const tripId = packingMatch[1];
      const { items } = await parseBody(req);
      const db = readDB();
      const pIdx = db.packing.findIndex(p => p.tripId === tripId);

      if (pIdx >= 0) {
        db.packing[pIdx].items = items;
      } else {
        db.packing.push({ id: `${tripId}-packing`, tripId, items });
      }

      writeDB(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // 8. PUT /api/trips/:id/budget (Update budget)
  const budgetMatch = pathname.match(/^\/api\/trips\/([^/]+)\/budget$/);
  if (budgetMatch && req.method === 'PUT') {
    try {
      const tripId = budgetMatch[1];
      const { categories, amounts, expenses } = await parseBody(req);
      const db = readDB();
      const bIdx = db.budget.findIndex(b => b.tripId === tripId);

      if (bIdx >= 0) {
        db.budget[bIdx].categories = categories;
        db.budget[bIdx].amounts = amounts;
        db.budget[bIdx].expenses = expenses;
      } else {
        db.budget.push({ id: `${tripId}-budget`, tripId, categories, amounts, expenses });
      }

      writeDB(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ================= STATIC FILE SERVING =================
  let safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  // Block sensitive files from being served
  const blocked = ['.env', '.env.example', 'db.json', 'server.js', '.gitignore', 'package.json', 'package-lock.json'];
  const baseFilename = path.basename(safePath);
  if (blocked.includes(baseFilename) || baseFilename.startsWith('.') || baseFilename.toLowerCase().endsWith('.env')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  const filePath = path.join(STATIC_DIR, safePath);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

// Process error listeners to prevent unexpected exits
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// Start Server
readDB();
server.listen(PORT, () => {
  const hasKey = !!(process.env.XAI_API_KEY || process.env.GROQ_API_KEY);
  console.log(`✈️ TravelMate backend running at http://localhost:${PORT}`);
  console.log(`   Open that URL in the browser (not Live Server). Groq key loaded: ${hasKey ? 'yes' : 'NO — check .env'}`);
});
