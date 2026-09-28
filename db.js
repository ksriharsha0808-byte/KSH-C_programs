// ========================================================
// TravelMate Minimal Persistent Database (IndexedDB)
// Object Stores: trips, itinerary, packing, budget
// ========================================================

const DB_NAME = "TravelMateDB";
const DB_VERSION = 1;

let dbInstance = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      // 1. Trips Store
      if (!db.objectStoreNames.contains("trips")) {
        db.createObjectStore("trips", { keyPath: "id" });
      }

      // 2. Itinerary Store
      if (!db.objectStoreNames.contains("itinerary")) {
        const itinStore = db.createObjectStore("itinerary", { keyPath: "id" });
        itinStore.createIndex("tripId", "tripId", { unique: false });
      }

      // 3. Packing Store
      if (!db.objectStoreNames.contains("packing")) {
        const packStore = db.createObjectStore("packing", { keyPath: "id" });
        packStore.createIndex("tripId", "tripId", { unique: false });
      }

      // 4. Budget Store
      if (!db.objectStoreNames.contains("budget")) {
        const budgetStore = db.createObjectStore("budget", { keyPath: "id" });
        budgetStore.createIndex("tripId", "tripId", { unique: false });
      }
    };

    request.onsuccess = (e) => {
      dbInstance = e.target.result;
      resolve(dbInstance);
    };

    request.onerror = (e) => {
      reject(e.target.error);
    };
  });
}

// Transaction Helpers
function putItem(storeName, data) {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.put(data);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  });
}

function getAllItems(storeName) {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  });
}

function getItemByIndex(storeName, indexName, value) {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const req = index.getAll(value);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  });
}

// High-Level Database APIs
const TM_DB = {
  // Initialize and Seed Default Trip if Empty
  async init(seedData) {
    await openDB();
    const existingTrips = await getAllItems("trips");
    if (existingTrips.length === 0 && seedData) {
      await this.saveCompleteTrip(
        seedData.trip,
        seedData.itinerary,
        seedData.packing,
        seedData.budget
      );
    }
  },

  // Save complete trip and related entities
  async saveCompleteTrip(trip, itineraryDays, packingList, budgetInfo) {
    // 1. Trips
    await putItem("trips", {
      id: trip.id,
      destination: trip.destination,
      dates: {
        departure: trip.departureDate,
        return: trip.returnDate,
        durationDays: trip.durationDays
      },
      budget: {
        amount: trip.budget,
        currency: trip.currency,
        currencySymbol: trip.currencySymbol
      },
      travellers: {
        type: trip.travelerType,
        count: trip.travelersCount
      },
      preferences: {
        travelStyle: trip.travelStyle,
        accommodation: trip.accommodation,
        pace: trip.pace
      }
    });

    // 2. Itinerary
    for (const day of itineraryDays) {
      await putItem("itinerary", {
        id: `${trip.id}-day-${day.dayNum}`,
        tripId: trip.id,
        day: day.dayNum,
        city: day.city,
        hotel: day.hotel,
        activities: day.slots
      });
    }

    // 3. Packing
    await putItem("packing", {
      id: `${trip.id}-packing`,
      tripId: trip.id,
      items: packingList
    });

    // 4. Budget
    await putItem("budget", {
      id: `${trip.id}-budget`,
      tripId: trip.id,
      categories: budgetInfo.categories,
      amounts: budgetInfo.amounts,
      expenses: budgetInfo.expenses || []
    });
  },

  // Fetch all trips
  async getTrips() {
    return await getAllItems("trips");
  },

  // Fetch complete trip by ID
  async getTripBundle(tripId) {
    const trips = await getAllItems("trips");
    const trip = trips.find(t => t.id === tripId) || trips[0];
    if (!trip) return null;

    const itinerary = await getItemByIndex("itinerary", "tripId", trip.id);
    const packingArr = await getItemByIndex("packing", "tripId", trip.id);
    const budgetArr = await getItemByIndex("budget", "tripId", trip.id);

    return {
      trip,
      itinerary: itinerary.sort((a, b) => a.day - b.day),
      packing: packingArr.length > 0 ? packingArr[0].items : [],
      budget: budgetArr.length > 0 ? budgetArr[0] : null
    };
  },

  // Update Packing for a trip
  async updatePacking(tripId, items) {
    await putItem("packing", {
      id: `${tripId}-packing`,
      tripId: tripId,
      items: items
    });
  },

  // Update Budget for a trip
  async updateBudget(tripId, categories, amounts, expenses) {
    await putItem("budget", {
      id: `${tripId}-budget`,
      tripId: tripId,
      categories: categories,
      amounts: amounts,
      expenses: expenses
    });
  }
};

window.TM_DB = TM_DB;
