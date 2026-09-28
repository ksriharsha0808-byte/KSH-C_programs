// ========================================================
// TRAVELMATE - Interactive Scrapbook Frontend Logic
// ========================================================

// Initial Mock Data
const sampleDestinations = [
  {
    id: "dest-1",
    name: "Kyoto, Japan",
    emoji: "🌸🏯",
    bg: "linear-gradient(135deg, #ffd3b6 0%, #ffaaa5 100%)",
    season: "Spring Sakura",
    style: "Cultural & Historic",
    days: "4-6 Days",
    highlights: ["Fushimi Inari torii gates at sunrise", "Gion traditional tea houses & matcha", "Arashiyama bamboo grove stroll"]
  },
  {
    id: "dest-2",
    name: "Amalfi Coast, Italy",
    emoji: "🍋🌊",
    bg: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    season: "Sunny Summer",
    style: "Beach & Coastal",
    days: "5-7 Days",
    highlights: ["Pastel cliffside cafes in Positano", "Fresh lemon granita & handmade gnocchi", "Private sunset boat to Capri island"]
  },
  {
    id: "dest-3",
    name: "Swiss Alps, Switzerland",
    emoji: "🏔️🌲",
    bg: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    season: "Crisp Autumn / Winter",
    style: "Adventure",
    days: "4-5 Days",
    highlights: ["Panoramic train rides through Lauterbrunnen", "Hot chocolate & cozy fondue chalet", "First Cliff Walk suspended high in clouds"]
  },
  {
    id: "dest-4",
    name: "Bali, Indonesia",
    emoji: "🌺🥥",
    bg: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    season: "Tropical Bliss",
    style: "Relaxed & Luxury",
    days: "7-10 Days",
    highlights: ["Ubud jungle infinity pools", "Floating breakfast among lotus ponds", "Canggu beachfront sunset acoustic lounges"]
  },
  {
    id: "dest-5",
    name: "Paris, France",
    emoji: "🥐🎨",
    bg: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
    season: "Romantic Autumn",
    style: "Romantic",
    days: "3-5 Days",
    highlights: ["Warm buttery croissants in Le Marais", "Picnic by the Seine watching the Eiffel twinkle", "Vintage book hunting at Shakespeare & Co"]
  },
  {
    id: "dest-6",
    name: "Oaxaca, Mexico",
    emoji: "🌮🏺",
    bg: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    season: "Vibrant Winter",
    style: "Foodie & Culture",
    days: "4-6 Days",
    highlights: ["Tasting seven traditional mole recipes", "Handmade artisan pottery workshops", "Hierve el Agua petrified mineral falls"]
  }
];

// Active Trip State
let currentTrip = {
  id: "trip-kyoto",
  destination: "Kyoto, Japan",
  departureDate: "2026-10-12",
  returnDate: "2026-10-15",
  durationDays: 4,
  currency: "USD ($)",
  currencySymbol: "$",
  budget: 2500,
  spent: 1420,
  travelerType: "Couple/Pair",
  travelersCount: 2,
  travelStyle: "Cultural & Historic",
  accommodation: "Gion Komachi Ryokan & Spa",
  pace: "Balanced",
  daysData: [
    {
      dayNum: 1,
      title: "Arrival, Bamboo Forest & Riverside Lanterns",
      city: "Kyoto, Central & Arashiyama",
      hotel: "Gion Komachi Ryokan & Spa",
      slots: {
        morning: {
          title: "Check-in & Welcome Matcha Ceremony",
          time: "09:30 AM - 11:30 AM",
          desc: "Drop bags at the cozy wooden ryokan. Savor fresh warm wagashi sweets and ceremonial green tea overlooking the pebble garden.",
          tip: "Slip into the provided floral yukata robes for instant relaxation!"
        },
        afternoon: {
          title: "Arashiyama Bamboo Grove & Tenryu-ji",
          time: "01:00 PM - 04:30 PM",
          desc: "Wander through towering emerald stalks as the wind whispers through the bamboo. Stroll across Togetsukyo Bridge.",
          tip: "Grab soft-serve matcha ice cream near the main temple gate."
        },
        evening: {
          title: "Gion Lantern Walk & Kamo River Ramen",
          time: "06:30 PM - 09:00 PM",
          desc: "Walk along stone-paved Shirakawa canal illuminated by paper lanterns. Sit tatami-style for steaming duck ramen.",
          tip: "Keep an eye out for geiko and maiko gracefully hurrying to evening appointments."
        }
      }
    },
    {
      dayNum: 2,
      title: "Vermilion Shrines & Traditional Pottery",
      city: "Kyoto, Southern Higashiyama",
      hotel: "Gion Komachi Ryokan & Spa",
      slots: {
        morning: {
          title: "Early Morning at Fushimi Inari Taisha",
          time: "07:30 AM - 10:30 AM",
          desc: "Beat the crowds to hike through thousands of vivid scarlet Torii gates climbing Mount Inari. Greet the stone fox statues.",
          tip: "Take the quiet mountain path at Yotsutsuji intersection for panoramic views of the city."
        },
        afternoon: {
          title: "Kiyomizu-dera & Sannenzaka Slopes",
          time: "01:00 PM - 04:00 PM",
          desc: "Marvel at the wooden temple stage built without a single nail. Browse craft shops selling ceramics, wind chimes, and incense.",
          tip: "Don't trip on the Ninenzaka steps — local folklore says it's a blessing if you keep your footing!"
        },
        evening: {
          title: "Pontocho Alley Foodie Crawl",
          time: "06:00 PM - 08:30 PM",
          desc: "Duck into cozy izakayas tucked down atmospheric narrow alleys. Enjoy charcoal yakitori and local cold draft sake.",
          tip: "Book river-facing terrace seating (kawayuka) if weather permits."
        }
      }
    },
    {
      dayNum: 3,
      title: "Golden Zen Temples & Philosopher's Path",
      city: "Kyoto, Northern Higashiyama",
      hotel: "Gion Komachi Ryokan & Spa",
      slots: {
        morning: {
          title: "Kinkaku-ji (The Golden Pavilion)",
          time: "09:00 AM - 11:30 AM",
          desc: "Admire the top two floors completely covered in gold leaf, reflecting peacefully onto the Mirror Pond (Kyoko-chi).",
          tip: "Buy an omikuji fortune slip near the tea garden exit."
        },
        afternoon: {
          title: "Stroll the Philosopher's Path & Silver Pavilion",
          time: "01:30 PM - 04:30 PM",
          desc: "A tranquil stone path along a canal lined with weeping willows and cherry trees. Pop into tiny indie pottery studios and cat cafes.",
          tip: "Stop at Omen for their famous chilled hand-pulled udon noodles."
        },
        evening: {
          title: "Cozy Ryokan Kaiseki Feast & Onsen Soak",
          time: "07:00 PM - 09:30 PM",
          desc: "Multi-course seasonal dinner served in your room, followed by a mineral bath soak under cedar beams.",
          tip: "A perfect calm night to write in your travel journal."
        }
      }
    },
    {
      dayNum: 4,
      title: "Nishiki Market Souvenirs & Farewell Tea",
      city: "Kyoto, Downtown & Station",
      hotel: "Gion Komachi Ryokan & Spa",
      slots: {
        morning: {
          title: "Nishiki Market Feast ('Kyoto's Kitchen')",
          time: "09:30 AM - 12:00 PM",
          desc: "Sample skewers of dashi tamagoyaki, candied baby octopus, roasted senbei crackers, and strawberry daifuku mochi.",
          tip: "Buy packaged ceremonial uji matcha powder for gifts back home."
        },
        afternoon: {
          title: "Kyoto Botanical Gardens & Cafe Stroll",
          time: "01:30 PM - 04:00 PM",
          desc: "Relax on wide green lawns with a picnic bento box. Enjoy quiet greenhouse displays and bonsai collections.",
          tip: "A gentle unwind before airport or Shinkansen transit."
        },
        evening: {
          title: "Shinkansen Farewell & Bento Dinner",
          time: "06:00 PM - 08:30 PM",
          desc: "Hop aboard the sleek bullet train with an ekiben bento box, watching city neon lights fade into the evening dusk.",
          tip: "Have your scrapbook ready to paste in your train ticket stubs!"
        }
      }
    }
  ]
};

// Saved Trips Collection
let savedTrips = [
  {
    id: "trip-kyoto",
    title: "🌸 Springtime in Kyoto",
    dest: "Kyoto, Japan",
    emoji: "⛩️",
    dates: "Oct 12 - Oct 15, 2026",
    days: "4 Days",
    tag: "Cultural & Historic",
    status: "Upcoming",
    budget: "$2,500"
  },
  {
    id: "trip-amalfi",
    title: "🍋 Amalfi Sun & Coastlines",
    dest: "Amalfi Coast, Italy",
    emoji: "🏖️",
    dates: "Jun 20 - Jun 26, 2026",
    days: "7 Days",
    tag: "Beach & Coastal",
    status: "Dreaming",
    budget: "€3,200"
  },
  {
    id: "trip-swiss",
    title: "🏔️ Chalets & Alpine Peaks",
    dest: "Swiss Alps, Switzerland",
    emoji: "🍫",
    dates: "Dec 04 - Dec 09, 2025",
    days: "5 Days",
    tag: "Adventure",
    status: "Completed",
    budget: "$2,800"
  }
];

// Packing List items
let packingItems = [
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
];

// Budget Mock Data & Receipts
let budgetCategories = [
  { name: "Accommodation", allocated: 1000, spent: 750, color: "#BAE6FD" },
  { name: "Flights & Transit", allocated: 650, spent: 420, color: "#C6F6D5" },
  { name: "Food & Cafes", allocated: 500, spent: 180, color: "#FFF1B0" },
  { name: "Activities", allocated: 200, spent: 45, color: "#FFCCD5" },
  { name: "Souvenirs", allocated: 150, spent: 25, color: "#E9D5FF" }
];

let expenseReceipts = [
  { title: "Ryokan 2-night deposit", cat: "Accommodation", amount: 450 },
  { title: "Kansai Haruka Express Train", cat: "Flights & Transit", amount: 75 },
  { title: "Gion Kaiseki Tasting Set", cat: "Food & Cafes", amount: 95 },
  { title: "Bamboo Grove Matcha Cones", cat: "Food & Cafes", amount: 12 },
  { title: "Ceramic Sake Cup Souvenir", cat: "Souvenirs", amount: 25 }
];

// Active State
let activeDayIndex = 0;
let currentPackingFilter = "all";

// ========================================================
// Navigation & SPA Section Switching
// ========================================================
function navigateTo(sectionId) {
  // Update nav buttons
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    if (link.dataset.target === sectionId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Update sections
  const sections = document.querySelectorAll(".page-section");
  sections.forEach(sec => {
    if (sec.id === sectionId) {
      sec.classList.add("active");
    } else {
      sec.classList.remove("active");
    }
  });

  // Close mobile nav if open
  const navMenu = document.getElementById("navMenu");
  if (navMenu) navMenu.classList.remove("open");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ========================================================
// Itinerary Functions
// ========================================================
function renderItineraryHeader() {
  const titleEl = document.getElementById("itineraryTripTitle");
  const metaEl = document.getElementById("itineraryMetaText");
  const hotelEl = document.getElementById("itineraryHotelName");
  
  if (titleEl) titleEl.textContent = `🌸 ${currentTrip.destination}`;
  if (metaEl) {
    metaEl.textContent = `${currentTrip.durationDays} Days • ${currentTrip.travelersCount} Travellers (${currentTrip.travelerType}) • ${currentTrip.travelStyle} • ${currentTrip.pace} Pace`;
  }
  if (hotelEl) hotelEl.textContent = currentTrip.accommodation;
}

function renderDayTabs() {
  const tabsContainer = document.getElementById("dayTabsContainer");
  if (!tabsContainer) return;
  tabsContainer.innerHTML = "";

  currentTrip.daysData.forEach((day, index) => {
    const btn = document.createElement("button");
    btn.className = `day-tab-btn ${index === activeDayIndex ? "active" : ""}`;
    btn.textContent = `Day ${day.dayNum}`;
    btn.onclick = () => {
      activeDayIndex = index;
      renderDayTabs();
      renderDayContent();
    };
    tabsContainer.appendChild(btn);
  });
}

function renderDayContent() {
  const card = document.getElementById("dayContentCard");
  if (!card) return;

  const day = currentTrip.daysData[activeDayIndex] || currentTrip.daysData[0];
  if (!day) return;

  const slots = day.slots || {};
  const morning = slots.morning || { title: "Morning Exploration", time: "09:00 AM - 12:00 PM", desc: "Stroll around and explore the local morning sights.", tip: "Wake up early for quiet streets!" };
  const afternoon = slots.afternoon || { title: "Afternoon Sights & Culture", time: "01:30 PM - 04:30 PM", desc: "Visit landmark attractions and sample local cuisine.", tip: "Stay hydrated and carry your camera." };
  const evening = slots.evening || { title: "Evening Dinner & Stroll", time: "06:30 PM - 09:00 PM", desc: "Enjoy cozy dinner and evening ambiance.", tip: "Take notes in your travel journal." };

  card.innerHTML = `
    <div class="washi-tape washi-mint top-left"></div>
    <div class="day-overview-header" style="margin-bottom: 1.5rem; border-bottom: 2px dashed #ECE2D5; padding-bottom: 1rem;">
      <span class="cute-badge">Day ${day.dayNum} of ${currentTrip.durationDays}</span>
      <h3 class="handwritten-title" style="font-size: 1.6rem; margin-top: 0.3rem;">${day.title}</h3>
      <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-top: 0.2rem;">📍 City / Area: <strong>${day.city}</strong> | 🏨 Base: <strong>${day.hotel}</strong></p>
    </div>

    <div class="day-slots-grid">
      <!-- Morning -->
      <div class="slot-card">
        <span class="slot-badge slot-badge-morning">☀️ Morning</span>
        <h4 class="slot-title">${morning.title || "Morning Activity"}</h4>
        <div class="slot-time">⏰ ${morning.time || "09:00 AM - 12:00 PM"}</div>
        <p class="slot-desc">${morning.desc || ""}</p>
        <div class="slot-tip">💡 Scrapbook tip: ${morning.tip || "Enjoy the moment!"}</div>
      </div>

      <!-- Afternoon -->
      <div class="slot-card">
        <span class="slot-badge slot-badge-afternoon">🌤️ Afternoon</span>
        <h4 class="slot-title">${afternoon.title || "Afternoon Activity"}</h4>
        <div class="slot-time">⏰ ${afternoon.time || "01:30 PM - 04:30 PM"}</div>
        <p class="slot-desc">${afternoon.desc || ""}</p>
        <div class="slot-tip">💡 Scrapbook tip: ${afternoon.tip || "Take a souvenir photo!"}</div>
      </div>

      <!-- Evening -->
      <div class="slot-card">
        <span class="slot-badge slot-badge-evening">🌙 Evening</span>
        <h4 class="slot-title">${evening.title || "Evening Activity"}</h4>
        <div class="slot-time">⏰ ${evening.time || "06:30 PM - 09:00 PM"}</div>
        <p class="slot-desc">${evening.desc || ""}</p>
        <div class="slot-tip">💡 Scrapbook tip: ${evening.tip || "Cherish the evening memories!"}</div>
      </div>
    </div>
  `;
}

// Helper to generate dynamic days when user submits form
function generateDaysForTrip(destination, numDays, style, accommodation) {
  const generated = [];
  const sampleThemes = [
    { title: "Arrival, Historic Sights & Welcome Flavors", morning: "Check-in & neighborhood bakery coffee", afternoon: "Main architectural landmark & plaza walk", evening: "Candlelit courtyard dinner & dessert" },
    { title: "Hidden Cobblestones & Scenic Vistas", morning: "Early view deck or scenic hill hike", afternoon: "Artisan crafts, flea markets & local boutiques", evening: "Acoustic lounge & riverside gelato" },
    { title: "Nature Immersion & Local Food Crawl", morning: "Botanical gardens or national trail walk", afternoon: "Culinary market tastings & cooking class", evening: "Sunset viewing & relaxed jazz bar" },
    { title: "Culture Highlights & Museum Discovery", morning: "Historic temple / palace audio guide", afternoon: "Riverside walk & bookstore cafe", evening: "Terrace dinner with regional wine or tea" },
    { title: "Coastal Breeze or Countryside Excursion", morning: "Day trip to seaside or mountain village", afternoon: "Boat cruise or scenic train overlook", evening: "Seafood dinner & night market stroll" },
    { title: "Souvenirs, Sweet Pastries & Farewell Sunset", morning: "Morning craft stalls & gift shopping", afternoon: "Relaxed park stroll & souvenir journaling", evening: "Farewell rooftop dinner under the stars" }
  ];

  for (let i = 1; i <= numDays; i++) {
    const themeIndex = (i - 1) % sampleThemes.length;
    const t = sampleThemes[themeIndex];
    generated.push({
      dayNum: i,
      title: `${t.title}`,
      city: `${destination} Highlights`,
      hotel: accommodation,
      slots: {
        morning: {
          title: `Day ${i}: ${t.morning}`,
          time: "09:00 AM - 12:00 PM",
          desc: `Begin the day refreshed in ${destination}. Embrace the ${style.toLowerCase()} atmosphere with gentle exploration.`,
          tip: "Snap a polaroid here and collect your morning coffee receipt!"
        },
        afternoon: {
          title: `Day ${i}: ${t.afternoon}`,
          time: "01:30 PM - 05:00 PM",
          desc: `Enjoy the cultural landmarks and local scenes of ${destination}. Great time to sit by a fountain or terrace.`,
          tip: "Carry your water bottle and comfortable walking sneakers."
        },
        evening: {
          title: `Day ${i}: ${t.evening}`,
          time: "06:30 PM - 09:30 PM",
          desc: `Wrap up with cozy local dining, evening lights, and journaling down today's memories.`,
          tip: "Write down 3 cute things that made you smile today!"
        }
      }
    });
  }
  return generated;
}

// ========================================================
// Packing List Logic
// ========================================================
function renderPackingList() {
  const container = document.getElementById("packingGrid");
  if (!container) return;
  container.innerHTML = "";

  const filtered = currentPackingFilter === "all" 
    ? packingItems 
    : packingItems.filter(item => item.cat === currentPackingFilter);

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = `packing-item-card ${item.checked ? "checked" : ""}`;
    card.innerHTML = `
      <div class="item-left" onclick="togglePackItem(${item.id})">
        <div class="cute-checkbox">${item.checked ? "✓" : ""}</div>
        <div>
          <div class="item-text">${item.text}</div>
          <span class="item-cat-tag">${item.cat}</span>
        </div>
      </div>
      <button class="item-del-btn" onclick="deletePackItem(event, ${item.id})" title="Remove item">×</button>
    `;
    container.appendChild(card);
  });

  updatePackingProgress();
}

function togglePackItem(id) {
  const item = packingItems.find(i => i.id === id);
  if (item) {
    item.checked = !item.checked;
    renderPackingList();
    if (window.TM_API && currentTrip) {
      TM_API.updatePacking(currentTrip.id, packingItems);
    }
  }
}

function deletePackItem(e, id) {
  e.stopPropagation();
  packingItems = packingItems.filter(i => i.id !== id);
  renderPackingList();
  if (window.TM_API && currentTrip) {
    TM_API.updatePacking(currentTrip.id, packingItems);
  }
  showToast("🗑️ Item removed from suitcase");
}

function updatePackingProgress() {
  const total = packingItems.length;
  const packed = packingItems.filter(i => i.checked).length;
  const pct = total === 0 ? 0 : Math.round((packed / total) * 100);

  const statsEl = document.getElementById("packingStats");
  const barEl = document.getElementById("packingProgressBar");
  const homeStat = document.getElementById("statPackedCount");

  if (statsEl) statsEl.textContent = `${packed}/${total} (${pct}%)`;
  if (barEl) barEl.style.width = `${pct}%`;
  if (homeStat) homeStat.textContent = `${packed}/${total}`;
}

// ========================================================
// Budget Logic
// ========================================================
function renderBudgetDashboard() {
  const totalDisplay = document.getElementById("budgetTotalDisplay");
  const spentDisplay = document.getElementById("budgetSpentDisplay");
  const remainDisplay = document.getElementById("budgetRemainDisplay");

  const sym = currentTrip.currencySymbol || "$";
  const total = currentTrip.budget || 2500;
  
  // Calculate total spent from categories
  const totalSpent = budgetCategories.reduce((acc, cat) => acc + cat.spent, 0);
  const remaining = Math.max(0, total - totalSpent);

  if (totalDisplay) totalDisplay.textContent = `${sym}${total.toLocaleString()}`;
  if (spentDisplay) spentDisplay.textContent = `${sym}${totalSpent.toLocaleString()}`;
  if (remainDisplay) remainDisplay.textContent = `${sym}${remaining.toLocaleString()}`;

  // Render categories progress
  const listContainer = document.getElementById("budgetCategoriesList");
  if (listContainer) {
    listContainer.innerHTML = "";
    budgetCategories.forEach(cat => {
      const pct = Math.min(100, Math.round((cat.spent / cat.allocated) * 100));
      const row = document.createElement("div");
      row.className = "budget-cat-row";
      row.innerHTML = `
        <div class="cat-row-header">
          <span>${cat.name}</span>
          <span><strong>${sym}${cat.spent}</strong> / ${sym}${cat.allocated} (${pct}%)</span>
        </div>
        <div class="cat-progress-track">
          <div class="cat-progress-fill" style="width: ${pct}%; background: ${cat.color};"></div>
        </div>
      `;
      listContainer.appendChild(row);
    });
  }

  // Render receipts
  const historyList = document.getElementById("expenseHistoryList");
  if (historyList) {
    historyList.innerHTML = "";
    expenseReceipts.slice().reverse().forEach(exp => {
      const li = document.createElement("li");
      li.className = "expense-item";
      li.innerHTML = `
        <div class="expense-item-info">
          <strong>${exp.title}</strong>
          <span class="expense-item-cat">${exp.cat}</span>
        </div>
        <div class="expense-item-val">-${sym}${exp.amount}</div>
      `;
      historyList.appendChild(li);
    });
  }
}

// ========================================================
// My Trips & Destinations Rendering
// ========================================================
function renderMyTrips() {
  const grid = document.getElementById("myTripsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  savedTrips.forEach(trip => {
    const card = document.createElement("div");
    card.className = "trip-polaroid-card";
    const statusColor = trip.status === "Upcoming" ? "var(--pastel-mint)" : (trip.status === "Completed" ? "var(--pastel-yellow)" : "var(--pastel-pink)");
    
    card.innerHTML = `
      <div class="washi-tape washi-yellow top-left"></div>
      <div class="trip-card-banner" style="background: linear-gradient(135deg, #ffd3b6, #ffaaa5);">
        ${trip.emoji}
        <span class="sticker trip-status-sticker" style="background: ${statusColor}; font-size: 0.72rem;">${trip.status}</span>
      </div>
      <div class="trip-card-body">
        <h3>${trip.title}</h3>
        <div class="trip-card-dates">📅 ${trip.dates} (${trip.days})</div>
        <div class="trip-card-tags">
          <span class="trip-mini-tag">📍 ${trip.dest}</span>
          <span class="trip-mini-tag">🎨 ${trip.tag}</span>
          <span class="trip-mini-tag">💰 ${trip.budget}</span>
        </div>
      </div>
      <div class="trip-card-actions" style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
        <button class="btn btn-primary btn-sm flex-1" onclick="viewTripDetail('${trip.id}')">📖 Open</button>
        <button class="btn btn-secondary btn-sm" onclick="editTripAction('${trip.id}')" title="Edit trip details">✏️ Edit</button>
        <button class="btn btn-secondary btn-sm" onclick="deleteTripAction('${trip.id}')" style="color: #c53030;" title="Delete this trip">🗑️</button>
      </div>
    `;
    grid.appendChild(card);
  });

  const countEl = document.getElementById("statTripsCount");
  if (countEl) countEl.textContent = savedTrips.length;
}

async function viewTripDetail(tripId) {
  let bundle = null;
  if (window.TM_API) {
    bundle = await TM_API.getTripBundle(tripId);
  } else if (window.TM_DB) {
    bundle = await TM_DB.getTripBundle(tripId);
  }

  if (bundle && bundle.trip) {
    currentTrip = {
      id: bundle.trip.id,
      destination: bundle.trip.destination,
      departureDate: bundle.trip.dates.departure,
      returnDate: bundle.trip.dates.return,
      durationDays: bundle.trip.dates.durationDays,
      currency: bundle.trip.budget.currency,
      currencySymbol: bundle.trip.budget.currencySymbol,
      budget: bundle.trip.budget.amount,
      travelerType: bundle.trip.travellers.type,
      travelersCount: bundle.trip.travellers.count,
      travelStyle: bundle.trip.preferences.travelStyle,
      accommodation: bundle.trip.preferences.accommodation,
      pace: bundle.trip.preferences.pace,
      daysData: bundle.itinerary.map(it => ({
        dayNum: it.day,
        title: it.activities.morning ? it.activities.morning.title : `Day ${it.day}`,
        city: it.city,
        hotel: it.hotel,
        slots: it.activities
      }))
    };

    if (bundle.packing && bundle.packing.length > 0) {
      packingItems = bundle.packing;
    }
    if (bundle.budget) {
      budgetCategories = bundle.budget.categories || budgetCategories;
      expenseReceipts = bundle.budget.expenses || expenseReceipts;
    }

    activeDayIndex = 0;
    renderItineraryHeader();
    renderDayTabs();
    renderDayContent();
    renderPackingList();
    renderBudgetDashboard();
  }

  navigateTo("itinerary");
  showToast("📔 Opened trip itinerary scrapbook!");
}

async function deleteTripAction(tripId) {
  if (confirm("Are you sure you want to remove this trip from your scrapbook?")) {
    if (window.TM_API) {
      await TM_API.deleteTrip(tripId);
    }
    savedTrips = savedTrips.filter(t => t.id !== tripId);
    renderMyTrips();
    showToast("🗑️ Trip removed from scrapbook.");
  }
}

async function editTripAction(tripId) {
  let bundle = null;
  if (window.TM_API) {
    bundle = await TM_API.getTripBundle(tripId);
  } else if (window.TM_DB) {
    bundle = await TM_DB.getTripBundle(tripId);
  }

  if (bundle && bundle.trip) {
    navigateTo("plan");
    const destInput = document.getElementById("destInput");
    const currSelect = document.getElementById("currencySelect");
    const depDate = document.getElementById("depDate");
    const retDate = document.getElementById("retDate");
    const budgetInput = document.getElementById("budgetInput");
    const tType = document.getElementById("travelerType");
    const tCount = document.getElementById("travelerCount");
    const accomSelect = document.getElementById("accomSelect");
    const paceSelect = document.getElementById("paceSelect");

    if (destInput) destInput.value = bundle.trip.destination;
    if (currSelect) currSelect.value = bundle.trip.budget.currency;
    if (depDate) depDate.value = bundle.trip.dates.departure;
    if (retDate) retDate.value = bundle.trip.dates.return;
    if (budgetInput) budgetInput.value = bundle.trip.budget.amount;
    if (tType) tType.value = bundle.trip.travellers.type;
    if (tCount) tCount.value = bundle.trip.travellers.count;
    if (accomSelect) accomSelect.value = bundle.trip.preferences.accommodation;
    if (paceSelect) paceSelect.value = bundle.trip.preferences.pace;

    // Set style chips
    const styleVal = bundle.trip.preferences.travelStyle;
    document.querySelectorAll(".style-chip").forEach(chip => {
      if (chip.dataset.val === styleVal) chip.classList.add("active");
      else chip.classList.remove("active");
    });

    calculateDuration();
    showToast(`✏️ Editing trip to ${bundle.trip.destination}`);
  }
}

function renderDestinations() {
  const grid = document.getElementById("destinationsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  sampleDestinations.forEach(dest => {
    const card = document.createElement("div");
    card.className = "trip-polaroid-card";
    card.innerHTML = `
      <div class="washi-tape washi-mint top-right"></div>
      <div class="trip-card-banner" style="background: ${dest.bg};">
        ${dest.emoji}
        <span class="sticker trip-status-sticker" style="background: var(--pastel-yellow); font-size: 0.72rem;">${dest.season}</span>
      </div>
      <div class="trip-card-body">
        <h3>${dest.name}</h3>
        <div class="trip-card-tags">
          <span class="trip-mini-tag">🕒 ${dest.days}</span>
          <span class="trip-mini-tag">✨ ${dest.style}</span>
        </div>
        <ul class="dest-card-highlights">
          ${dest.highlights.map(h => `<li>🌸 ${h}</li>`).join("")}
        </ul>
      </div>
      <button class="btn btn-primary btn-sm btn-block" onclick="prefillDestination('${dest.name}', '${dest.style}')">✏️ Plan This Trip</button>
    `;
    grid.appendChild(card);
  });
}

function prefillDestination(name, style) {
  navigateTo("plan");
  const destInput = document.getElementById("destInput");
  if (destInput) destInput.value = name;

  // Set style chip
  const chips = document.querySelectorAll(".style-chip");
  chips.forEach(chip => {
    if (chip.dataset.val.includes(style.split(" ")[0])) {
      chip.classList.add("active");
    } else {
      chip.classList.remove("active");
    }
  });

  showToast(`📍 Set destination to ${name}!`);
}

// ========================================================
// Toast Notifications
// ========================================================
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById("cuteToast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// Sample Trip Form Reset
function resetFormToSample() {
  const destInput = document.getElementById("destInput");
  const depDate = document.getElementById("depDate");
  const retDate = document.getElementById("retDate");
  const budgetInput = document.getElementById("budgetInput");
  const travelerCount = document.getElementById("travelerCount");

  if (destInput) destInput.value = "Amalfi Coast, Italy";
  if (depDate) depDate.value = "2026-07-10";
  if (retDate) retDate.value = "2026-07-16";
  if (budgetInput) budgetInput.value = "3200";
  if (travelerCount) travelerCount.value = "2";

  calculateDuration();
  showToast("📋 Loaded Amalfi Coast sample trip!");
}

function calculateDuration() {
  const depDate = document.getElementById("depDate");
  const retDate = document.getElementById("retDate");
  const display = document.getElementById("durationDisplay");

  if (depDate && retDate && depDate.value && retDate.value) {
    const start = new Date(depDate.value);
    const end = new Date(retDate.value);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays > 0) {
      display.textContent = `${diffDays} Days Adventure ☀️`;
      display.style.background = "var(--pastel-mint)";
      return diffDays;
    } else {
      display.textContent = "Return must be after departure!";
      display.style.background = "var(--pastel-pink)";
      return 1;
    }
  }
  display.textContent = "Select dates";
  return 4;
}

// ========================================================
// App Initialization & Event Listeners
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  // Navigation click listeners
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      const target = link.dataset.target;
      navigateTo(target);
    });
  });

  // Date changes for trip plan
  const depDate = document.getElementById("depDate");
  const retDate = document.getElementById("retDate");
  if (depDate && retDate) {
    // Default mock dates
    depDate.value = "2026-10-12";
    retDate.value = "2026-10-15";
    calculateDuration();

    depDate.addEventListener("change", calculateDuration);
    retDate.addEventListener("change", calculateDuration);
  }

  // Style Chip Selector
  const styleChips = document.querySelectorAll(".style-chip");
  styleChips.forEach(chip => {
    chip.addEventListener("click", () => {
      styleChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });

  // Retry helper for Groq AI trip generation
  window.retryGenerateTrip = function() {
    const form = document.getElementById("tripPlanForm");
    if (form) form.requestSubmit();
  };

  // Trip Plan Form Submit (Connected to /generate-trip via Groq AI)
  const tripPlanForm = document.getElementById("tripPlanForm");
  if (tripPlanForm) {
    tripPlanForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById("submitTripBtn");
      const errorBanner = document.getElementById("aiErrorBanner");
      const errorMsg = document.getElementById("aiErrorMsg");

      if (errorBanner) errorBanner.style.display = "none";

      const dest = document.getElementById("destInput").value.trim();
      const curr = document.getElementById("currencySelect").value;
      const dep = document.getElementById("depDate").value;
      const ret = document.getElementById("retDate").value;
      const budgetVal = parseFloat(document.getElementById("budgetInput").value) || 2000;
      const tType = document.getElementById("travelerType").value;
      const tCount = parseInt(document.getElementById("travelerCount").value, 10) || 1;
      const activeChip = document.querySelector(".style-chip.active");
      const style = activeChip ? activeChip.dataset.val : "Cultural & Historic";
      const accom = document.getElementById("accomSelect").value;
      const pace = document.getElementById("paceSelect").value;

      const dur = calculateDuration() || 4;
      const currencySymbol = curr.includes("€") ? "€" : (curr.includes("¥") ? "¥" : (curr.includes("£") ? "£" : (curr.includes("₹") ? "₹" : "$")));

      const preferences = {
        destination: dest,
        departureDate: dep,
        returnDate: ret,
        durationDays: dur,
        currency: curr,
        currencySymbol: currencySymbol,
        budget: budgetVal,
        travelerType: tType,
        travelersCount: tCount,
        travelStyle: style,
        accommodation: accom,
        pace: pace
      };

      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "✨ Groq AI is planning your trip... ✈️";
      }

      try {
        let aiResponse;
        if (window.TM_API && window.TM_API.generateTrip) {
          aiResponse = await TM_API.generateTrip(preferences);
        } else {
          throw new Error("Backend API unavailable");
        }

        // Apply generated data
        currentTrip = {
          id: aiResponse.trip.id,
          destination: aiResponse.trip.destination,
          departureDate: aiResponse.trip.dates.departure,
          returnDate: aiResponse.trip.dates.return,
          durationDays: aiResponse.trip.dates.durationDays,
          currency: aiResponse.trip.budget.currency,
          currencySymbol: aiResponse.trip.budget.currencySymbol,
          budget: aiResponse.trip.budget.amount,
          travelerType: aiResponse.trip.travellers.type,
          travelersCount: aiResponse.trip.travellers.count,
          travelStyle: aiResponse.trip.preferences.travelStyle,
          accommodation: aiResponse.trip.preferences.accommodation,
          pace: aiResponse.trip.preferences.pace,
          daysData: (aiResponse.itinerary || []).map(it => ({
            dayNum: it.day,
            title: it.activities && it.activities.morning ? it.activities.morning.title : `Day ${it.day}`,
            city: it.city,
            hotel: it.hotel,
            slots: it.activities
          }))
        };

        if (aiResponse.packing && aiResponse.packing.length > 0) {
          packingItems = aiResponse.packing;
        }

        if (aiResponse.budget) {
          budgetCategories = aiResponse.budget.categories || budgetCategories;
          expenseReceipts = aiResponse.budget.expenses || [];
        }

        // Add to saved trips list
        savedTrips.unshift({
          id: currentTrip.id,
          title: `✈️ Adventure to ${dest}`,
          dest: dest,
          emoji: "🗺️",
          dates: `${dep} - ${ret}`,
          days: `${dur} Days`,
          tag: style,
          status: "Upcoming",
          budget: `${currencySymbol}${budgetVal.toLocaleString()}`
        });

        activeDayIndex = 0;
        renderItineraryHeader();
        renderDayTabs();
        renderDayContent();
        renderMyTrips();
        renderPackingList();
        renderBudgetDashboard();

        if (aiResponse.usedFallback) {
          showToast(`✨ Generated ${dest} itinerary!`);
        } else {
          showToast(`🤖 Groq AI created your ${dest} scrapbook itinerary!`);
        }
        navigateTo("itinerary");
      } catch (err) {
        console.error("AI Trip generation error:", err);
        if (errorBanner) {
          errorBanner.style.display = "flex";
          if (errorMsg) errorMsg.textContent = err.message || "Failed to generate trip with Groq AI.";
        }
        showToast("⚠️ Could not generate trip. Click Retry to try again.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "✨ Create My Scrapbook Itinerary";
        }
      }
    });
  }

  // Packing Category Filter Buttons
  document.querySelectorAll(".cat-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".cat-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentPackingFilter = tab.dataset.cat;
      renderPackingList();
    });
  });

  // Add Packing Item Form
  const addPackingForm = document.getElementById("addPackingForm");
  if (addPackingForm) {
    addPackingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const textInput = document.getElementById("packItemInput");
      const catInput = document.getElementById("packCatInput");

      if (textInput.value.trim()) {
        packingItems.push({
          id: Date.now(),
          text: textInput.value.trim(),
          cat: catInput.value,
          checked: false
        });
        textInput.value = "";
        renderPackingList();
        if (window.TM_API && currentTrip) {
          TM_API.updatePacking(currentTrip.id, packingItems);
        } else if (window.TM_DB && currentTrip) {
          TM_DB.updatePacking(currentTrip.id, packingItems);
        }
        showToast("🧳 Item added to suitcase!");
      }
    });
  }

  // Add Expense Form
  const addExpenseForm = document.getElementById("addExpenseForm");
  if (addExpenseForm) {
    addExpenseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const titleInput = document.getElementById("expenseTitle");
      const amountInput = document.getElementById("expenseAmount");
      const catInput = document.getElementById("expenseCat");

      const title = titleInput.value.trim();
      const amount = parseFloat(amountInput.value);
      const catName = catInput.value;

      if (title && amount > 0) {
        expenseReceipts.push({ title, cat: catName, amount });
        
        // update category
        const found = budgetCategories.find(c => c.name === catName);
        if (found) {
          found.spent += amount;
        }

        titleInput.value = "";
        amountInput.value = "";
        renderBudgetDashboard();
        
        const totalSpent = budgetCategories.reduce((acc, cat) => acc + cat.spent, 0);
        if (window.TM_API && currentTrip) {
          TM_API.updateBudget(
            currentTrip.id,
            budgetCategories,
            { total: currentTrip.budget, spent: totalSpent, remaining: Math.max(0, currentTrip.budget - totalSpent) },
            expenseReceipts
          );
        } else if (window.TM_DB && currentTrip) {
          TM_DB.updateBudget(
            currentTrip.id,
            budgetCategories,
            { total: currentTrip.budget, spent: totalSpent, remaining: Math.max(0, currentTrip.budget - totalSpent) },
            expenseReceipts
          );
        }
        showToast(`💸 Logged ${currentTrip.currencySymbol}${amount} for ${title}!`);
      }
    });
  }

  // Initial Data Load (Backend -> Database -> Frontend)
  async function loadInitialData() {
    let trips = [];
    if (window.TM_API) {
      trips = await TM_API.getTrips();
    }
    if ((!trips || trips.length === 0) && window.TM_DB) {
      const totalSpent = budgetCategories.reduce((acc, cat) => acc + cat.spent, 0);
      await TM_DB.init({
        trip: currentTrip,
        itinerary: currentTrip.daysData,
        packing: packingItems,
        budget: {
          categories: budgetCategories,
          amounts: { total: currentTrip.budget, spent: totalSpent, remaining: currentTrip.budget - totalSpent },
          expenses: expenseReceipts
        }
      });
      trips = await TM_DB.getTrips();
    }

    if (trips && trips.length > 0) {
      savedTrips = trips.map(t => ({
        id: t.id,
        title: `✈️ Adventure to ${t.destination}`,
        dest: t.destination,
        emoji: "🗺️",
        dates: `${t.dates.departure} - ${t.dates.return}`,
        days: `${t.dates.durationDays} Days`,
        tag: t.preferences.travelStyle,
        status: "Upcoming",
        budget: `${t.budget.currencySymbol}${t.budget.amount.toLocaleString()}`
      }));
      renderMyTrips();
    }
  }

  loadInitialData();

  renderItineraryHeader();
  renderDayTabs();
  renderDayContent();
  renderPackingList();
  renderBudgetDashboard();
  renderMyTrips();
  renderDestinations();
});
