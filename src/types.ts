export type Role = 'DONOR' | 'HOSPITAL' | 'ADMIN';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UrgencyLevel = 'CRITICAL' | 'URGENT' | 'STANDARD';

export type DonorAvailability = 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
export type AvailabilityStatus = DonorAvailability;

export type RequestStatus = 'PENDING' | 'MATCHED' | 'FULFILLED' | 'CANCELLED';

export type MatchStatus = 'NOTIFIED' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';

export type InventoryStatus = 'STABLE' | 'MODERATE' | 'CRITICAL';

export type DonorBadge = 'FIRST_DONATION' | 'LIFE_SAVER' | 'HERO_DONOR' | 'EMERGENCY_RESPONDER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  verified: boolean;
  created_at: string;
  avatar?: string;
}

export interface DonationRecord {
  id: string;
  donor_id: string;
  hospital_id: string;
  hospital_name: string;
  date: string;
  blood_group: BloodGroup;
  units: number;
  units_donated: number;
  status: 'COMPLETED' | 'SCHEDULED' | 'CANCELLED';
  verified_by?: string;
  certificate_url?: string;
}

export interface Donor {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  blood_group: BloodGroup;
  latitude: number;
  longitude: number;
  address: string;
  availability: DonorAvailability;
  last_donation_date: string; // YYYY-MM-DD
  total_donations: number;
  eligible: boolean;
  ineligibility_reason?: string;
  verified: boolean;
  lives_impacted: number;
  badges: DonorBadge[];
  donation_history: DonationRecord[];
}

export interface Hospital {
  id: string;
  user_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  phone: string;
  emergency_hotline: string;
  license_number: string;
}

export interface BloodInventoryItem {
  id: string;
  hospital_id: string;
  blood_group: BloodGroup;
  units: number;
  minimum_threshold: number;
  updated_at: string;
  status: InventoryStatus;
  history?: Array<{
    id: string;
    timestamp: string;
    change: number;
    reason: string;
    actor: string;
  }>;
}

export interface EmergencyRequest {
  id: string;
  hospital_id: string;
  hospital_name: string;
  hospital_address: string;
  blood_group: BloodGroup;
  units_required: number;
  urgency: UrgencyLevel;
  latitude: number;
  longitude: number;
  search_radius_km: number;
  required_by: string;
  notes?: string;
  status: RequestStatus;
  created_at: string;
  matched_donors_count?: number;
  accepted_donor_id?: string;
  accepted_donor_name?: string;
  escalated_level?: 'LOCAL_5KM' | 'EXPANDED_10KM' | 'REGIONAL_25KM' | 'NETWORK_WIDE';
}

export interface MatchBreakdown {
  compatibilityScore: number; // Max 40
  proximityScore: number; // Max 25
  availabilityScore: number; // Max 15
  eligibilityScore: number; // Max 10
  historyScore: number; // Max 10
  reasons: string[];
}

export interface DonorMatch {
  id: string;
  request_id: string;
  donor_id: string;
  donor: Donor;
  match_score: number; // 0 to 100
  distance_km: number;
  status: MatchStatus;
  breakdown: MatchBreakdown;
  notified_at: string;
  responded_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  request_id?: string;
  type: 'EMERGENCY_REQUEST' | 'MATCH_ACCEPTED' | 'MATCH_DECLINED' | 'SHORTAGE_ALERT' | 'OUTREACH_CAMPAIGN' | 'SYSTEM';
  title: string;
  message: string;
  urgency?: UrgencyLevel;
  status: 'UNREAD' | 'READ';
  created_at: string;
  data?: Record<string, any>;
}

export interface ShortagePrediction {
  blood_group: BloodGroup;
  current_units: number;
  current_stock: number;
  critical_threshold: number;
  risk_level: 'CRITICAL' | 'MODERATE' | 'STABLE';
  predicted_depletion_hours: number;
  predicted_shortage_in: string;
  daily_burn_rate: number;
  projected_demand_7d: number;
  incoming_scheduled: number;
  recommendation: string;
  action_required: boolean;
}
export type PredictionRecord = ShortagePrediction;

export interface OutreachCampaign {
  id: string;
  hospital_id: string;
  blood_group: BloodGroup;
  target_radius_km: number;
  urgency: string;
  message: string;
  donors_notified_count: number;
  estimated_reach: string;
  projected_response_rate: string;
  created_at: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  hash?: string;
}

export interface RegionalDemandMetric {
  date: string;
  requests_count: number;
  units_dispatched: number;
  donations_received: number;
}

export interface MonthlyReportSummary {
  periodMonth: string; // YYYY-MM
  monthLabel: string; // e.g., 'September 2026'
  generatedAt: string;
  hospitalId: string;
  hospitalName: string;
  licenseNumber: string;
  facilityAddress: string;
  medicalDirector: string;
  totalRequests: number;
  fulfilledRequests: number;
  pendingRequests: number;
  cancelledRequests: number;
  fulfillmentRatePercent: number;
  totalUnitsRequested: number;
  totalUnitsFulfilled: number;
  totalDonationInflows: number;
  unitsInflowTotal: number;
  averageMatchTimeMinutes: number;
  averageDonorDistanceKm: number;
  criticalEscalationCount: number;
  bloodGroupBreakdown: Array<{
    bloodGroup: BloodGroup;
    requestedCount: number;
    unitsRequested: number;
    unitsFulfilled: number;
    fulfillmentRatePercent: number;
    inflowUnits: number;
    currentReserve: number;
    status: InventoryStatus;
  }>;
  recentFulfillments: Array<{
    id: string;
    date: string;
    bloodGroup: BloodGroup;
    units: number;
    urgency: UrgencyLevel;
    donorName: string;
    status: string;
    distanceKm?: number;
  }>;
}
