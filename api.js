// ========================================================
// TravelMate Frontend API Client (Backend Connector)
// frontend -> backend -> database -> backend -> frontend
// ========================================================

// Always talk to the Node backend on port 3000.
// Live Server / file:// / other preview ports caused "Failed to fetch"
// because fetch went to that preview origin (no /generate-trip API there).
function resolveApiBase() {
  const origin = window.location.origin || '';
  const port = String(window.location.port || '');
  if (/^https?:/i.test(origin) && (port === '3000' || /:3000$/i.test(origin))) {
    return origin;
  }
  return 'http://localhost:3000';
}

const API_BASE = resolveApiBase();

function networkError(err) {
  const msg = (err && err.message) ? err.message : String(err);
  if (err && (err.name === 'TypeError' || /failed to fetch|networkerror|load failed/i.test(msg))) {
    return new Error(
      `Failed to reach TravelMate backend at ${API_BASE}. ` +
      'Do not use Live Server for this app. In VS Code run: node server.js ' +
      'then open http://localhost:3000'
    );
  }
  return err;
}

const TM_API = {
  // 0. Generate trip via backend Groq AI endpoint (/generate-trip)
  async generateTrip(preferences) {
    let res;
    try {
      res = await fetch(`${API_BASE}/generate-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
    } catch (e) {
      throw networkError(e);
    }
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const err = new Error(errBody.error || `HTTP ${res.status}`);
      err.canRetry = errBody.canRetry;
      throw err;
    }
    return await res.json();
  },

  // 1. Get all trips
  async getTrips() {
    try {
      const res = await fetch(`${API_BASE}/api/trips`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn("Backend unavailable, using persistent database fallback:", e);
      return window.TM_DB ? await TM_DB.getTrips() : [];
    }
  },

  // 2. Get full trip bundle (trip + itinerary + packing + budget)
  async getTripBundle(tripId) {
    try {
      const res = await fetch(`${API_BASE}/api/trips/${tripId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn("Backend unavailable, using persistent database fallback:", e);
      return window.TM_DB ? await TM_DB.getTripBundle(tripId) : null;
    }
  },

  // 3. Create a trip with all components
  async createTrip(trip, itineraryDays, packingList, budgetInfo) {
    try {
      const payload = {
        trip,
        itinerary: itineraryDays,
        packing: packingList,
        budget: budgetInfo
      };
      const res = await fetch(`${API_BASE}/api/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      // Also sync to IndexedDB for seamless dual-persistence
      if (window.TM_DB) {
        await TM_DB.saveCompleteTrip(trip, itineraryDays, packingList, budgetInfo);
      }
      return data;
    } catch (e) {
      console.warn("Backend error, writing to database fallback:", e);
      if (window.TM_DB) {
        await TM_DB.saveCompleteTrip(trip, itineraryDays, packingList, budgetInfo);
      }
      return { success: true, tripId: trip.id };
    }
  },

  // 4. Update trip details
  async updateTrip(tripId, updateData) {
    try {
      const res = await fetch(`${API_BASE}/api/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn("Backend error updating trip:", e);
      return { success: true };
    }
  },

  // 5. Delete trip
  async deleteTrip(tripId) {
    try {
      const res = await fetch(`${API_BASE}/api/trips/${tripId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn("Backend error deleting trip:", e);
      return { success: true };
    }
  },

  // 6. Update packing list
  async updatePacking(tripId, items) {
    try {
      const res = await fetch(`${API_BASE}/api/trips/${tripId}/packing`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (window.TM_DB) await TM_DB.updatePacking(tripId, items);
      return await res.json();
    } catch (e) {
      if (window.TM_DB) await TM_DB.updatePacking(tripId, items);
      return { success: true };
    }
  },

  // 7. Update budget and receipts
  async updateBudget(tripId, categories, amounts, expenses) {
    try {
      const res = await fetch(`${API_BASE}/api/trips/${tripId}/budget`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories, amounts, expenses })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (window.TM_DB) await TM_DB.updateBudget(tripId, categories, amounts, expenses);
      return await res.json();
    } catch (e) {
      if (window.TM_DB) await TM_DB.updateBudget(tripId, categories, amounts, expenses);
      return { success: true };
    }
  }
};
