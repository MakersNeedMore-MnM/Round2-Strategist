import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
import {
  INITIAL_CITYCARE_INVENTORY,
  INITIAL_DONATIONS_HISTORY,
  INITIAL_EMERGENCY_REQUESTS,
  INITIAL_NOTIFICATIONS,
  SEED_DONORS,
  SEED_HOSPITALS,
  SEED_USERS,
} from './src/data/seedData.ts';
import { rankDonorsForRequest } from './src/services/bloodMatching.ts';
import { BloodGroup, BloodInventoryItem, Donor, EmergencyRequest, NotificationItem } from './src/types.ts';

// In-memory data store for the full-stack prototype (initialized with realistic seed data)
let users = [...SEED_USERS];
let donors = [...SEED_DONORS];
let hospitals = [...SEED_HOSPITALS];
let inventory: BloodInventoryItem[] = [...INITIAL_CITYCARE_INVENTORY];
let requests: EmergencyRequest[] = [...INITIAL_EMERGENCY_REQUESTS];
let donations = [...INITIAL_DONATIONS_HISTORY];
let notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
let outreachCampaigns: Array<{
  id: string;
  blood_group: BloodGroup;
  created_at: string;
  donors_notified_count: number;
  message: string;
}> = [];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // --- API Routes ---
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'BloodBridge AI API Server',
      timestamp: new Date().toISOString(),
      counts: {
        donors: donors.length,
        hospitals: hospitals.length,
        requests: requests.length,
        inventory_items: inventory.length,
      },
    });
  });

  // Users & Auth state
  app.get('/api/users', (req, res) => {
    res.json(users);
  });

  // Donors
  app.get('/api/donors', (req, res) => {
    const { blood_group, available } = req.query;
    let result = donors;
    if (blood_group) {
      result = result.filter((d) => d.blood_group === blood_group);
    }
    if (available === 'true') {
      result = result.filter((d) => d.availability === 'AVAILABLE');
    }
    res.json(result);
  });

  app.patch('/api/donors/:id', (req, res) => {
    const { id } = req.params;
    const index = donors.findIndex((d) => d.id === id);
    if (index === -1) return res.status(404).json({ error: 'Donor not found' });
    donors[index] = { ...donors[index], ...req.body };
    res.json(donors[index]);
  });

  // Hospitals
  app.get('/api/hospitals', (req, res) => {
    res.json(hospitals);
  });

  // Blood Inventory
  app.get('/api/inventory', (req, res) => {
    res.json(inventory);
  });

  app.patch('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    const index = inventory.findIndex((item) => item.id === id);
    if (index === -1) return res.status(404).json({ error: 'Item not found' });

    const updatedUnits = req.body.units !== undefined ? Number(req.body.units) : inventory[index].units;
    const threshold = req.body.minimum_threshold !== undefined ? Number(req.body.minimum_threshold) : inventory[index].minimum_threshold;
    
    let status: 'STABLE' | 'MODERATE' | 'CRITICAL' = 'STABLE';
    if (updatedUnits <= threshold) {
      status = 'CRITICAL';
    } else if (updatedUnits <= threshold * 1.4) {
      status = 'MODERATE';
    }

    inventory[index] = {
      ...inventory[index],
      ...req.body,
      units: updatedUnits,
      minimum_threshold: threshold,
      status,
      updated_at: new Date().toISOString(),
    };
    res.json(inventory[index]);
  });

  // Emergency Requests
  app.get('/api/requests', (req, res) => {
    res.json(requests);
  });

  app.post('/api/requests', (req, res) => {
    const {
      hospital_id = 'hosp_citycare',
      blood_group = 'O-',
      units_required = 2,
      urgency = 'CRITICAL',
      required_by = 'Within 2 hours',
      notes = 'Critical trauma unit requirement',
      search_radius_km = 5,
    } = req.body;

    const hospital = hospitals.find((h) => h.id === hospital_id) || hospitals[0];

    // Compute matching donors
    const rankedDonors = rankDonorsForRequest(
      donors,
      blood_group as BloodGroup,
      hospital.latitude,
      hospital.longitude,
      urgency,
      search_radius_km
    );

    const newRequest: EmergencyRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      hospital_id: hospital.id,
      hospital_name: hospital.name,
      hospital_address: hospital.address,
      blood_group: blood_group as BloodGroup,
      units_required: Number(units_required),
      urgency,
      latitude: hospital.latitude,
      longitude: hospital.longitude,
      search_radius_km,
      required_by,
      notes,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      matched_donors_count: rankedDonors.length,
      escalated_level: search_radius_km <= 5 ? 'LOCAL_5KM' : search_radius_km <= 10 ? 'EXPANDED_10KM' : 'REGIONAL_25KM',
    };

    requests.unshift(newRequest);

    // Generate notifications for matched eligible donors within range
    rankedDonors.slice(0, 5).forEach((match) => {
      notifications.unshift({
        id: `notif_${Date.now()}_${match.donor.id}`,
        user_id: match.donor.user_id,
        request_id: newRequest.id,
        type: 'EMERGENCY_REQUEST',
        title: `🚨 URGENT — ${newRequest.blood_group} Blood Required`,
        message: `${newRequest.hospital_name} (${match.distance_km} km away) requires ${newRequest.units_required} units of ${newRequest.blood_group}. Urgency: ${newRequest.urgency}.`,
        urgency: newRequest.urgency,
        status: 'UNREAD',
        created_at: new Date().toISOString(),
        data: {
          requestId: newRequest.id,
          hospitalName: newRequest.hospital_name,
          bloodGroup: newRequest.blood_group,
          distanceKm: match.distance_km,
          matchScore: match.match_score,
        },
      });
    });

    res.status(201).json({
      request: newRequest,
      matched_donors: rankedDonors,
    });
  });

  // Accept or decline emergency request
  app.post('/api/requests/:id/respond', (req, res) => {
    const { id } = req.params;
    const { donor_id, action } = req.body; // action: 'ACCEPT' | 'DECLINE'
    const requestIndex = requests.findIndex((r) => r.id === id);
    if (requestIndex === -1) return res.status(404).json({ error: 'Request not found' });

    const donor = donors.find((d) => d.id === donor_id) || donors[0];

    if (action === 'ACCEPT') {
      requests[requestIndex].status = 'MATCHED';
      requests[requestIndex].accepted_donor_id = donor.id;
      requests[requestIndex].accepted_donor_name = donor.name;

      // Hospital notification
      notifications.unshift({
        id: `notif_${Date.now()}_hosp`,
        user_id: 'user_hospital_1',
        request_id: requests[requestIndex].id,
        type: 'MATCH_ACCEPTED',
        title: `✅ Donor Matched: ${donor.name}`,
        message: `Donor ${donor.name} (${donor.blood_group}) accepted emergency request ${requests[requestIndex].id}. Estimated transit ETA: 20 minutes.`,
        urgency: requests[requestIndex].urgency,
        status: 'UNREAD',
        created_at: new Date().toISOString(),
        data: {
          donorId: donor.id,
          donorName: donor.name,
          phone: donor.phone,
        },
      });
    }

    res.json({ success: true, request: requests[requestIndex] });
  });

  // Targeted donor outreach campaign
  app.post('/api/outreach', (req, res) => {
    const { blood_group = 'O-', message } = req.body;
    const matchingDonors = donors.filter(
      (d) => d.blood_group === blood_group && d.availability === 'AVAILABLE' && d.eligible
    );

    const campaign = {
      id: `camp_${Date.now()}`,
      blood_group: blood_group as BloodGroup,
      created_at: new Date().toISOString(),
      donors_notified_count: matchingDonors.length,
      message: message || `Critical shortage alert: We urgently invite eligible ${blood_group} donors to schedule an appointment this week.`,
    };

    outreachCampaigns.unshift(campaign);

    // Notify donors
    matchingDonors.forEach((donor) => {
      notifications.unshift({
        id: `notif_${Date.now()}_${donor.id}`,
        user_id: donor.user_id,
        type: 'OUTREACH_CAMPAIGN',
        title: `Priority Blood Shortage Outreach (${blood_group})`,
        message: campaign.message,
        urgency: 'URGENT',
        status: 'UNREAD',
        created_at: new Date().toISOString(),
      });
    });

    res.json({ success: true, campaign, notifiedCount: matchingDonors.length });
  });

  // Notifications
  app.get('/api/notifications', (req, res) => {
    const { user_id } = req.query;
    if (user_id) {
      return res.json(notifications.filter((n) => n.user_id === user_id));
    }
    res.json(notifications);
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const { id } = req.params;
    const notif = notifications.find((n) => n.id === id);
    if (notif) notif.status = 'READ';
    res.json({ success: true });
  });

  // Reset Demo State
  app.post('/api/demo/reset', (req, res) => {
    users = [...SEED_USERS];
    donors = [...SEED_DONORS];
    hospitals = [...SEED_HOSPITALS];
    inventory = [...INITIAL_CITYCARE_INVENTORY];
    requests = [...INITIAL_EMERGENCY_REQUESTS];
    donations = [...INITIAL_DONATIONS_HISTORY];
    notifications = [...INITIAL_NOTIFICATIONS];
    outreachCampaigns = [];
    res.json({ success: true, message: 'Demo data successfully reset to baseline.' });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BloodBridge AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
