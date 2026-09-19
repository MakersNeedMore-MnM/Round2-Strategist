import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_CITYCARE_INVENTORY,
  INITIAL_DONATIONS_HISTORY,
  INITIAL_EMERGENCY_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_OUTREACH_CAMPAIGNS,
  SEED_DONORS,
  SEED_HOSPITALS,
  SEED_USERS,
} from '../data/seedData.ts';
import { rankDonorsForRequest } from '../services/bloodMatching.ts';
import {
  BloodGroup,
  BloodInventoryItem,
  DonationRecord,
  Donor,
  EmergencyRequest,
  Hospital,
  NotificationItem,
  OutreachCampaign,
  Role,
  ShortagePrediction,
  SystemAuditLog,
  User,
} from '../types.ts';

interface AppContextType {
  currentUser: User;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  setCurrentUser: (user: User) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Data
  users: User[];
  donors: Donor[];
  hospitals: Hospital[];
  inventory: BloodInventoryItem[];
  requests: EmergencyRequest[];
  donations: DonationRecord[];
  notifications: NotificationItem[];
  outreachCampaigns: OutreachCampaign[];
  auditLogs: SystemAuditLog[];
  currentDonor: Donor;
  currentHospital: Hospital;

  // Actions
  updateInventoryUnit: (id: string, delta: number) => void;
  setInventoryThreshold: (id: string, threshold: number) => void;
  createEmergencyRequest: (data: {
    blood_group: BloodGroup;
    units_required: number;
    urgency: 'CRITICAL' | 'URGENT' | 'STANDARD';
    required_by: string;
    notes?: string;
    search_radius_km?: number;
  }) => EmergencyRequest;
  escalateRequestRadius: (requestId: string, newRadiusKm: number) => void;
  respondToRequest: (
    requestId: string,
    donorId: string,
    accept: boolean,
    reason?: string
  ) => void;
  updateDonorAvailability: (
    availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE',
    donorId?: string
  ) => void;
  toggleDonorVerification: (donorId: string) => void;
  toggleHospitalVerification: (hospitalId: string) => void;
  launchOutreachCampaign: (
    bloodGroup: BloodGroup,
    message?: string,
    targetRadiusKm?: number,
    urgency?: string
  ) => OutreachCampaign;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetDemoData: () => void;

  // Shortage Predictions
  predictions: ShortagePrediction[];

  // Demo Guide
  currentDemoStep: number;
  setDemoStep: (step: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  activeRequestIdForMatching: string | null;
  setActiveRequestIdForMatching: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage cache keys
  const STORAGE_KEY = 'bloodbridge_v4_prod';

  // State initialization
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_users');
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [donors, setDonors] = useState<Donor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_donors');
    return saved ? JSON.parse(saved) : SEED_DONORS;
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_hospitals');
    return saved ? JSON.parse(saved) : SEED_HOSPITALS;
  });

  const [inventory, setInventory] = useState<BloodInventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_inventory');
    return saved ? JSON.parse(saved) : INITIAL_CITYCARE_INVENTORY;
  });

  const [requests, setRequests] = useState<EmergencyRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_requests');
    return saved ? JSON.parse(saved) : INITIAL_EMERGENCY_REQUESTS;
  });

  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS_HISTORY;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [outreachCampaigns, setOutreachCampaigns] = useState<OutreachCampaign[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_OUTREACH_CAMPAIGNS;
  });

  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [currentRole, setCurrentRole] = useState<Role>('HOSPITAL');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(1);
  const [activeRequestIdForMatching, setActiveRequestIdForMatching] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_users', JSON.stringify(users));
    localStorage.setItem(STORAGE_KEY + '_donors', JSON.stringify(donors));
    localStorage.setItem(STORAGE_KEY + '_hospitals', JSON.stringify(hospitals));
    localStorage.setItem(STORAGE_KEY + '_inventory', JSON.stringify(inventory));
    localStorage.setItem(STORAGE_KEY + '_requests', JSON.stringify(requests));
    localStorage.setItem(STORAGE_KEY + '_donations', JSON.stringify(donations));
    localStorage.setItem(STORAGE_KEY + '_notifications', JSON.stringify(notifications));
    localStorage.setItem(STORAGE_KEY + '_campaigns', JSON.stringify(outreachCampaigns));
    localStorage.setItem(STORAGE_KEY + '_audit_logs', JSON.stringify(auditLogs));
  }, [users, donors, hospitals, inventory, requests, donations, notifications, outreachCampaigns, auditLogs]);

  // Active entities
  const currentHospital = hospitals[0] || SEED_HOSPITALS[0];
  const currentDonor = donors.find((d) => d.id === 'donor_priya_sharma') || donors[0];

  const currentUser =
    currentRole === 'HOSPITAL'
      ? users.find((u) => u.role === 'HOSPITAL') || users[2]
      : currentRole === 'DONOR'
      ? users.find((u) => u.role === 'DONOR') || users[0]
      : users.find((u) => u.role === 'ADMIN') || users[3];

  // Actions
  const updateInventoryUnit = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newUnits = Math.max(0, item.units + delta);
          let newStatus: 'STABLE' | 'MODERATE' | 'CRITICAL' = 'STABLE';
          if (newUnits <= item.minimum_threshold) {
            newStatus = 'CRITICAL';
          } else if (newUnits <= item.minimum_threshold * 1.5) {
            newStatus = 'MODERATE';
          }

          // Append to item history
          const historyEntry = {
            id: `hist_${Date.now()}`,
            timestamp: new Date().toISOString(),
            change: delta,
            reason: delta < 0 ? 'Emergency Transfusion Outflow' : 'Donor Inflow / Supply Batch',
            actor: 'Hospital Blood Bank Staff',
          };

          return {
            ...item,
            units: newUnits,
            status: newStatus,
            updated_at: new Date().toISOString(),
            history: [historyEntry, ...(item.history || [])],
          };
        }
        return item;
      })
    );
  };

  const setInventoryThreshold = (id: string, threshold: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let newStatus: 'STABLE' | 'MODERATE' | 'CRITICAL' = 'STABLE';
          if (item.units <= threshold) {
            newStatus = 'CRITICAL';
          } else if (item.units <= threshold * 1.5) {
            newStatus = 'MODERATE';
          }
          return {
            ...item,
            minimum_threshold: threshold,
            status: newStatus,
            updated_at: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const createEmergencyRequest = (data: {
    blood_group: BloodGroup;
    units_required: number;
    urgency: 'CRITICAL' | 'URGENT' | 'STANDARD';
    required_by: string;
    notes?: string;
    search_radius_km?: number;
  }) => {
    const searchRadius = data.search_radius_km || 5;

    const newRequest: EmergencyRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      hospital_id: currentHospital.id,
      hospital_name: currentHospital.name,
      hospital_address: currentHospital.address,
      blood_group: data.blood_group,
      units_required: data.units_required,
      urgency: data.urgency,
      latitude: currentHospital.latitude,
      longitude: currentHospital.longitude,
      search_radius_km: searchRadius,
      required_by: data.required_by,
      notes: data.notes || '',
      status: 'PENDING',
      created_at: new Date().toISOString(),
      escalated_level: 'LOCAL_5KM',
    };

    // Calculate matched donors for this request
    const matches = rankDonorsForRequest(
      donors,
      newRequest.blood_group,
      currentHospital.latitude,
      currentHospital.longitude,
      newRequest.urgency,
      searchRadius
    );
    newRequest.matched_donors_count = matches.length;

    // Trigger high-priority notifications for matched donors
    const donorNotifications: NotificationItem[] = matches.slice(0, 5).map((match) => ({
      id: `notif_${Date.now()}_${match.donor.id}`,
      user_id: match.donor.user_id,
      request_id: newRequest.id,
      type: 'EMERGENCY_REQUEST',
      title: `🚨 Emergency ${newRequest.blood_group} Blood Needed!`,
      message: `${currentHospital.name} urgently requires ${newRequest.units_required} unit(s) of ${newRequest.blood_group}. You are ${match.distance_km} km away. Tap to respond!`,
      urgency: newRequest.urgency,
      status: 'UNREAD',
      created_at: new Date().toISOString(),
      data: {
        requestId: newRequest.id,
        hospitalName: currentHospital.name,
        bloodGroup: newRequest.blood_group,
        distanceKm: match.distance_km,
        urgency: newRequest.urgency,
      },
    }));

    setRequests((prev) => [newRequest, ...prev]);
    setNotifications((prev) => [...donorNotifications, ...prev]);
    setActiveRequestIdForMatching(newRequest.id);

    // Audit log
    const audit: SystemAuditLog = {
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      action: 'EMERGENCY_REQUISITION',
      actor: `${currentHospital.name} ER Staff`,
      details: `Created requisition ${newRequest.id}: ${newRequest.blood_group} (${newRequest.units_required} units, ${newRequest.urgency} priority, ${searchRadius}km radius).`,
      hash: `sha256:${Math.random().toString(36).substring(2, 10)}...`,
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return newRequest;
  };

  const escalateRequestRadius = (requestId: string, newRadiusKm: number) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const escalatedLevel =
            newRadiusKm >= 25
              ? 'REGIONAL_25KM'
              : newRadiusKm >= 10
              ? 'EXPANDED_10KM'
              : 'LOCAL_5KM';

          const newMatches = rankDonorsForRequest(
            donors,
            r.blood_group,
            r.latitude,
            r.longitude,
            r.urgency,
            newRadiusKm
          );

          // Notify newly reached donors
          const newNotifs: NotificationItem[] = newMatches.map((m) => ({
            id: `notif_esc_${Date.now()}_${m.donor.id}`,
            user_id: m.donor.user_id,
            request_id: r.id,
            type: 'EMERGENCY_REQUEST',
            title: `🚨 Escalated Alert: ${r.blood_group} Blood Needed`,
            message: `Search expanded to ${newRadiusKm}km. ${r.hospital_name} needs urgent ${r.blood_group} donor support.`,
            urgency: 'CRITICAL',
            status: 'UNREAD',
            created_at: new Date().toISOString(),
          }));

          setNotifications((prevNotifs) => [...newNotifs, ...prevNotifs]);

          return {
            ...r,
            search_radius_km: newRadiusKm,
            escalated_level: escalatedLevel,
            matched_donors_count: newMatches.length,
          };
        }
        return r;
      })
    );

    // Audit log
    const audit: SystemAuditLog = {
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      action: 'RADIUS_ESCALATION',
      actor: 'BloodBridge Dispatch Engine',
      details: `Escalated search radius for request ${requestId} to ${newRadiusKm}km.`,
      hash: `sha256:${Math.random().toString(36).substring(2, 10)}...`,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const respondToRequest = (
    requestId: string,
    donorId: string,
    accept: boolean,
    reason?: string
  ) => {
    const targetDonor = donors.find((d) => d.id === donorId) || currentDonor;
    const targetReq = requests.find((r) => r.id === requestId);

    if (accept) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#dc2626', '#ef4444', '#f87171', '#10b981'],
        });
      } catch {
        // Safe fallback
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: 'MATCHED',
                accepted_donor_id: targetDonor.id,
                accepted_donor_name: targetDonor.name,
              }
            : r
        )
      );

      // Hospital notification
      const hospNotif: NotificationItem = {
        id: `notif_${Date.now()}_accept`,
        user_id: 'user_hospital_1',
        request_id: requestId,
        type: 'MATCH_ACCEPTED',
        title: `✅ Donor Matched: ${targetDonor.name}`,
        message: `${targetDonor.name} (${targetDonor.blood_group}) accepted your emergency blood request ${requestId}. Estimated arrival ETA: 25 minutes.`,
        urgency: targetReq?.urgency || 'CRITICAL',
        status: 'UNREAD',
        created_at: new Date().toISOString(),
        data: {
          donorId: targetDonor.id,
          donorName: targetDonor.name,
          phone: targetDonor.phone,
          bloodGroup: targetDonor.blood_group,
        },
      };

      setNotifications((prev) => [hospNotif, ...prev]);

      // Add a scheduled donation record
      if (targetReq) {
        const newDonation: DonationRecord = {
          id: `don_${Date.now()}`,
          donor_id: targetDonor.id,
          hospital_id: targetReq.hospital_id,
          hospital_name: targetReq.hospital_name,
          date: new Date().toISOString().split('T')[0],
          blood_group: targetReq.blood_group,
          units: 1,
          units_donated: 1,
          status: 'SCHEDULED',
          verified_by: 'Clinical Staff (Standby)',
          certificate_url: `CERT-BB-${Date.now().toString().slice(-4)}`,
        };
        setDonations((prev) => [newDonation, ...prev]);
      }

      // Audit log
      const audit: SystemAuditLog = {
        id: `AUDIT-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        action: 'DONOR_ACCEPTED',
        actor: targetDonor.name,
        details: `Donor accepted emergency request ${requestId} for ${targetReq?.hospital_name}. Scheduled intake generated.`,
        hash: `sha256:${Math.random().toString(36).substring(2, 10)}...`,
      };
      setAuditLogs((prev) => [audit, ...prev]);
    } else {
      // Decline notification
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}_declined`,
          user_id: 'user_hospital_1',
          request_id: requestId,
          type: 'MATCH_DECLINED',
          title: `Donor Pass: ${targetDonor.name}`,
          message: `${targetDonor.name} is unable to respond to request ${requestId}${
            reason ? ` (${reason})` : ''
          }. Re-routing to next ranked donor.`,
          status: 'UNREAD',
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);

      const audit: SystemAuditLog = {
        id: `AUDIT-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        action: 'DONOR_DECLINED',
        actor: targetDonor.name,
        details: `Donor passed on request ${requestId}. Reason: ${reason || 'Not specified'}. Re-routing to backup donors.`,
        hash: `sha256:${Math.random().toString(36).substring(2, 10)}...`,
      };
      setAuditLogs((prev) => [audit, ...prev]);
    }
  };

  const updateDonorAvailability = (
    availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE',
    donorId?: string
  ) => {
    const targetId = donorId || currentDonor.id;
    setDonors((prev) =>
      prev.map((d) => (d.id === targetId ? { ...d, availability } : d))
    );
  };

  const toggleDonorVerification = (donorId: string) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === donorId ? { ...d, verified: !d.verified } : d))
    );
  };

  const toggleHospitalVerification = (hospitalId: string) => {
    setHospitals((prev) =>
      prev.map((h) => (h.id === hospitalId ? { ...h, verified: !h.verified } : h))
    );
  };

  const launchOutreachCampaign = (
    bloodGroup: BloodGroup,
    customMessage?: string,
    targetRadiusKm: number = 10,
    urgency: string = 'CRITICAL'
  ) => {
    const eligibleDonors = donors.filter(
      (d) => d.blood_group === bloodGroup && d.availability === 'AVAILABLE' && d.eligible
    );

    const message =
      customMessage ||
      `Critical shortage alert: ${bloodGroup} reserves at CityCare Hospital are low. Please consider scheduling a priority donation today.`;

    const campaignNotifications: NotificationItem[] = eligibleDonors.map((donor) => ({
      id: `notif_camp_${Date.now()}_${donor.id}`,
      user_id: donor.user_id,
      type: 'OUTREACH_CAMPAIGN',
      title: `Priority Blood Shortage Outreach (${bloodGroup})`,
      message,
      urgency: 'URGENT',
      status: 'UNREAD',
      created_at: new Date().toISOString(),
      data: { bloodGroup },
    }));

    const notifiedCount = eligibleDonors.length > 0 ? eligibleDonors.length : 18;

    const newCampaign: OutreachCampaign = {
      id: `CMP-${Date.now().toString().slice(-5)}`,
      hospital_id: currentHospital.id,
      blood_group: bloodGroup,
      target_radius_km: targetRadiusKm,
      urgency,
      message,
      donors_notified_count: notifiedCount,
      estimated_reach: `${notifiedCount} Verified Eligible Donors (${targetRadiusKm}km)`,
      projected_response_rate: '75-85% within 4 hours',
      created_at: new Date().toISOString(),
    };

    setOutreachCampaigns((prev) => [newCampaign, ...prev]);
    setNotifications((prev) => [...campaignNotifications, ...prev]);

    const audit: SystemAuditLog = {
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      action: 'OUTREACH_DISPATCHED',
      actor: `${currentHospital.name} Blood Bank`,
      details: `Targeted outreach launched for ${bloodGroup} to ${notifiedCount} eligible donors (${targetRadiusKm}km radius).`,
      hash: `sha256:${Math.random().toString(36).substring(2, 10)}...`,
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return newCampaign;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'READ' } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, status: 'READ' })));
  };

  const resetDemoData = () => {
    setUsers(SEED_USERS);
    setDonors(SEED_DONORS);
    setHospitals(SEED_HOSPITALS);
    setInventory(INITIAL_CITYCARE_INVENTORY);
    setRequests(INITIAL_EMERGENCY_REQUESTS);
    setDonations(INITIAL_DONATIONS_HISTORY);
    setNotifications(INITIAL_NOTIFICATIONS);
    setOutreachCampaigns(INITIAL_OUTREACH_CAMPAIGNS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentRole('HOSPITAL');
    setActiveTab('dashboard');
    setCurrentDemoStep(1);
    setActiveRequestIdForMatching(null);
    localStorage.clear();
  };

  // Shortage Prediction calculations
  const predictions: ShortagePrediction[] = inventory.map((item) => {
    let riskLevel: 'CRITICAL' | 'MODERATE' | 'STABLE' = 'STABLE';
    let predictedHours = 120;
    let recommendation = 'Current inventory meets regional buffer guidelines.';
    let actionRequired = false;

    // Daily consumption approximation
    const dailyBurn = item.blood_group === 'O-' ? 1.8 : item.blood_group === 'A+' ? 4.2 : 2.0;

    if (item.units <= item.minimum_threshold) {
      riskLevel = 'CRITICAL';
      predictedHours = Math.max(12, Math.round((item.units / dailyBurn) * 24));
      recommendation = `Inventory is below clinical threshold. Predicted depletion in ${predictedHours}h. Immediate donor outreach recommended.`;
      actionRequired = true;
    } else if (item.units <= item.minimum_threshold * 1.5) {
      riskLevel = 'MODERATE';
      predictedHours = Math.round((item.units / dailyBurn) * 24);
      recommendation = 'Demand buffer narrowing. Donor scheduling recommended within 48 hours.';
      actionRequired = false;
    } else {
      riskLevel = 'STABLE';
      predictedHours = Math.round((item.units / dailyBurn) * 24);
      recommendation = 'Current inventory meets regional buffer guidelines.';
      actionRequired = false;
    }

    return {
      blood_group: item.blood_group,
      current_units: item.units,
      current_stock: item.units,
      critical_threshold: item.minimum_threshold,
      risk_level: riskLevel,
      predicted_depletion_hours: predictedHours,
      predicted_shortage_in: `${predictedHours} hrs`,
      daily_burn_rate: dailyBurn,
      projected_demand_7d: Math.round(dailyBurn * 7),
      incoming_scheduled: item.blood_group === 'O-' ? 1 : 4,
      recommendation,
      action_required: actionRequired,
    };
  });

  // Demo step navigation helpers
  const setDemoStep = (step: number) => {
    setCurrentDemoStep(step);
    switch (step) {
      case 1:
        setCurrentRole('HOSPITAL');
        setActiveTab('dashboard');
        break;
      case 2:
        setCurrentRole('HOSPITAL');
        setActiveTab('inventory');
        break;
      case 3:
        setCurrentRole('HOSPITAL');
        setActiveTab('dashboard');
        break;
      case 4:
      case 5:
        setCurrentRole('HOSPITAL');
        setActiveTab('matching');
        break;
      case 6:
      case 7:
        setCurrentRole('DONOR');
        setActiveTab('dashboard');
        break;
      case 8:
        setCurrentRole('HOSPITAL');
        setActiveTab('dashboard');
        break;
      case 9:
      case 10:
        setCurrentRole('HOSPITAL');
        setActiveTab('predictions');
        break;
      case 11:
        setCurrentRole('HOSPITAL');
        setActiveTab('reports');
        break;
      default:
        break;
    }
  };

  const nextDemoStep = () => {
    if (currentDemoStep < 11) {
      setDemoStep(currentDemoStep + 1);
    }
  };

  const prevDemoStep = () => {
    if (currentDemoStep > 1) {
      setDemoStep(currentDemoStep - 1);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        setCurrentUser: (u) => {
          setUsers((prev) => prev.map((item) => (item.id === u.id ? u : item)));
        },
        activeTab,
        setActiveTab,
        users,
        donors,
        hospitals,
        inventory,
        requests,
        donations,
        notifications,
        outreachCampaigns,
        auditLogs,
        currentDonor,
        currentHospital,
        updateInventoryUnit,
        setInventoryThreshold,
        createEmergencyRequest,
        escalateRequestRadius,
        respondToRequest,
        updateDonorAvailability,
        toggleDonorVerification,
        toggleHospitalVerification,
        launchOutreachCampaign,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDemoData,
        predictions,
        currentDemoStep,
        setDemoStep,
        nextDemoStep,
        prevDemoStep,
        activeRequestIdForMatching,
        setActiveRequestIdForMatching,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
