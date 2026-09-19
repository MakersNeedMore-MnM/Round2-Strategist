import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { BloodGroup, EmergencyRequest, UrgencyLevel } from '../../types.ts';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (request: EmergencyRequest) => void;
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentHospital, createEmergencyRequest, setActiveTab } = useApp();

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [unitsRequired, setUnitsRequired] = useState<number>(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('CRITICAL');
  const [requiredBy, setRequiredBy] = useState<string>('Within 2 hours');
  const [searchRadius, setSearchRadius] = useState<number>(5);
  const [notes, setNotes] = useState<string>(
    'Emergency trauma intake (ER Bed 4). Universal RBC matching needed urgently.'
  );
  const [createdRequest, setCreatedRequest] = useState<EmergencyRequest | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req = createEmergencyRequest({
      blood_group: bloodGroup,
      units_required: unitsRequired,
      urgency,
      required_by: requiredBy,
      notes,
      search_radius_km: searchRadius,
    });

    setCreatedRequest(req);
    if (onSuccess) {
      onSuccess(req);
    }
  };

  const handleGoToMatching = () => {
    onClose();
    setActiveTab('matching');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191B16]/80 backdrop-blur-xs">
      <div className="bg-[#F5F0E7] text-[#252820] max-w-xl w-full border border-[#D8D0C3] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#D8D0C3] flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#A94A4A] font-mono font-bold block mb-1">
              EMERGENCY REQUISITION PROTOCOL
            </span>
            <h3 className="font-serif text-2xl text-[#252820]">
              Create Emergency Request
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#596451] hover:text-[#252820] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen after submission */}
        {createdRequest ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-12 h-12 border border-[#596451] text-[#596451] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-serif text-3xl text-[#252820]">Requisition Dispatched</h4>
              <p className="text-xs text-[#596451] mt-1 font-mono">
                {createdRequest.id} · Priority alert sent to eligible donors in range
              </p>
            </div>

            <div className="border border-[#D8D0C3] bg-white p-4 font-mono text-xs text-left space-y-1">
              <div>
                <span className="text-[#596451]">BLOOD GROUP: </span>
                <strong className="text-[#A94A4A]">{createdRequest.blood_group}</strong>
              </div>
              <div>
                <span className="text-[#596451]">REQUIRED: </span>
                <strong className="text-[#252820]">{createdRequest.units_required} Units</strong>
              </div>
              <div>
                <span className="text-[#596451]">SECTOR RADIUS: </span>
                <strong className="text-[#252820]">{createdRequest.search_radius_km} km</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-4">
              <button
                onClick={handleGoToMatching}
                className="px-6 py-3 bg-[#A94A4A] text-[#F5F0E7] text-[10px] uppercase tracking-[0.2em] font-mono cursor-pointer"
              >
                Track on Radar →
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-[#D8D0C3] text-[#252820] text-[10px] uppercase tracking-[0.2em] font-mono cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[#596451] mb-2">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full p-2.5 border border-[#D8D0C3] bg-white text-[#252820]"
                >
                  <option value="O-">O− (Universal Donor)</option>
                  <option value="O+">O+</option>
                  <option value="A-">A−</option>
                  <option value="A+">A+</option>
                  <option value="B-">B−</option>
                  <option value="B+">B+</option>
                  <option value="AB-">AB−</option>
                  <option value="AB+">AB+</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[#596451] mb-2">
                  Units Required
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={unitsRequired}
                  onChange={(e) => setUnitsRequired(Number(e.target.value))}
                  className="w-full p-2.5 border border-[#D8D0C3] bg-white text-[#252820]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[#596451] mb-2">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className="w-full p-2.5 border border-[#D8D0C3] bg-white text-[#252820]"
                >
                  <option value="CRITICAL">CRITICAL (&lt;2h)</option>
                  <option value="URGENT">URGENT (&lt;6h)</option>
                  <option value="STANDARD">STANDARD (&lt;24h)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[#596451] mb-2">
                  Search Radius
                </label>
                <select
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-full p-2.5 border border-[#D8D0C3] bg-white text-[#252820]"
                >
                  <option value={5}>5.0 km (Local)</option>
                  <option value={10}>10.0 km (Metro)</option>
                  <option value={25}>25.0 km (Regional)</option>
                </select>
              </div>
            </div>

            <div className="font-mono text-xs">
              <label className="block text-[9px] uppercase tracking-[0.2em] text-[#596451] mb-2">
                Clinical Context / Department
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 border border-[#D8D0C3] bg-white text-[#252820]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 font-mono">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 border border-[#D8D0C3] text-[#596451] hover:text-[#252820] text-[10px] uppercase tracking-[0.2em] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#A94A4A] hover:bg-[#252820] text-[#F5F0E7] text-[10px] uppercase tracking-[0.25em] transition-colors cursor-pointer border border-[#A94A4A]"
              >
                Broadcast Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
