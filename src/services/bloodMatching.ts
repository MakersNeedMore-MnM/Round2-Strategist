import { BloodGroup, Donor, DonorMatch, MatchBreakdown, UrgencyLevel } from '../types.ts';

/**
 * Deterministic Red Blood Cell (RBC) Compatibility Matrix.
 * Key: Recipient Blood Group -> Value: Array of compatible Donor Blood Groups
 */
export const COMPATIBLE_DONORS_FOR_RECIPIENT: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

/**
 * Check if a donor blood group is strictly compatible with recipient blood group
 */
export function isBloodCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const allowed = COMPATIBLE_DONORS_FOR_RECIPIENT[recipientGroup];
  return allowed ? allowed.includes(donorGroup) : false;
}

/**
 * Calculate Haversine distance in kilometers between two geo-coordinates
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal place
}

/**
 * Deterministic Match Score Calculation
 * Maximum score: 100 points
 * 
 * Components:
 * - Compatibility: up to 40 pts
 * - Proximity: up to 25 pts
 * - Availability: up to 15 pts
 * - Donation Eligibility: up to 10 pts
 * - Response & Donation History: up to 10 pts
 */
export function calculateDonorMatchScore(
  donor: Donor,
  targetBloodGroup: BloodGroup,
  hospitalLat: number,
  hospitalLon: number,
  urgency: UrgencyLevel
): { score: number; distance: number; breakdown: MatchBreakdown } {
  const distance = calculateDistanceKm(hospitalLat, hospitalLon, donor.latitude, donor.longitude);
  const reasons: string[] = [];

  // 1. Compatibility (Max 40)
  let compatibilityScore = 0;
  const compatible = isBloodCompatible(donor.blood_group, targetBloodGroup);
  if (compatible) {
    if (donor.blood_group === targetBloodGroup) {
      compatibilityScore = 40;
      reasons.push(`Exact blood group match (${donor.blood_group})`);
    } else {
      compatibilityScore = 36;
      reasons.push(`Universal compatible match (${donor.blood_group} → ${targetBloodGroup})`);
    }
  } else {
    compatibilityScore = 0;
    reasons.push(`Incompatible blood group (${donor.blood_group} for ${targetBloodGroup})`);
  }

  // 2. Proximity (Max 25)
  let proximityScore = 0;
  if (distance <= 3.5) {
    proximityScore = 25;
    reasons.push(`Within immediate perimeter (${distance} km)`);
  } else if (distance <= 6.0) {
    proximityScore = 22;
    reasons.push(`Close proximity (${distance} km)`);
  } else if (distance <= 12.0) {
    proximityScore = 17;
    reasons.push(`Moderate distance (${distance} km)`);
  } else if (distance <= 25.0) {
    proximityScore = 11;
    reasons.push(`Extended radius (${distance} km)`);
  } else {
    proximityScore = Math.max(3, Math.round(25 - (distance - 25) * 0.8));
    reasons.push(`Regional range (${distance} km)`);
  }

  // 3. Availability (Max 15)
  let availabilityScore = 0;
  if (donor.availability === 'AVAILABLE') {
    availabilityScore = 15;
    reasons.push('Actively available');
  } else if (donor.availability === 'BUSY') {
    availabilityScore = 5;
    reasons.push('Marked busy / on-call');
  } else {
    availabilityScore = 0;
    reasons.push('Temporarily unavailable');
  }

  // 4. Eligibility (Max 10)
  let eligibilityScore = 0;
  if (donor.eligible) {
    eligibilityScore = 10;
    reasons.push('Clinically eligible (>56d since donation)');
  } else {
    eligibilityScore = 0;
    reasons.push(donor.ineligibility_reason || 'In cooldown period');
  }

  // 5. Response & Donation History (Max 10)
  let historyScore = 0;
  if (donor.total_donations >= 5) {
    historyScore = 10;
    reasons.push(`High reliability veteran (${donor.total_donations} donations)`);
  } else if (donor.total_donations >= 2) {
    historyScore = 8;
    reasons.push(`Proven donor history (${donor.total_donations} donations)`);
  } else if (donor.total_donations === 1) {
    historyScore = 6;
    reasons.push('1 verified prior donation');
  } else {
    historyScore = 5;
    reasons.push('New registered donor');
  }

  // Total raw score
  let totalScore = compatibilityScore + proximityScore + availabilityScore + eligibilityScore + historyScore;

  // If blood is incompatible or donor is unavailable and urgency is critical, penalize appropriately
  if (!compatible) {
    totalScore = Math.min(totalScore, 20);
  }

  const breakdown: MatchBreakdown = {
    compatibilityScore,
    proximityScore,
    availabilityScore,
    eligibilityScore,
    historyScore,
    reasons,
  };

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    distance,
    breakdown,
  };
}

/**
 * Filter and rank donors for a hospital emergency request
 */
export function rankDonorsForRequest(
  donors: Donor[],
  targetBloodGroup: BloodGroup,
  hospitalLat: number,
  hospitalLon: number,
  urgency: UrgencyLevel,
  radiusKm: number = 25
): Array<{
  donor: Donor;
  match_score: number;
  distance_km: number;
  breakdown: MatchBreakdown;
  withinRadius: boolean;
}> {
  return donors
    .map((donor) => {
      const { score, distance, breakdown } = calculateDonorMatchScore(
        donor,
        targetBloodGroup,
        hospitalLat,
        hospitalLon,
        urgency
      );
      return {
        donor,
        match_score: score,
        distance_km: distance,
        breakdown,
        withinRadius: distance <= radiusKm,
      };
    })
    .filter((item) => isBloodCompatible(item.donor.blood_group, targetBloodGroup))
    .sort((a, b) => b.match_score - a.match_score);
}
