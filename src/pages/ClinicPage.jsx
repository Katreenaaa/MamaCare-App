import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CLINICS } from "../data";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Stethoscope,
  Navigation,
  PhoneCall,
  BadgeCheck,
  Building2,
} from "lucide-react";

function MapUpdater({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 12, { animate: true, duration: 1.5 });
  }
  return null;
}

export default function ClinicPage({ t, onBack }) {
  const [filter, setFilter] = useState("");
  const [selectedClinic, setSelectedClinic] = useState(null);

  // 1. Super-Search: Filters by Clinic Name, State, or LGA
  const filteredClinics = CLINICS.filter(
    (c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      (c.state && c.state.toLowerCase().includes(filter.toLowerCase())) ||
      (c.lga && c.lga.toLowerCase().includes(filter.toLowerCase())),
  );

  // 2. Find the center point for the map based on search results
  const mapCenter =
    filteredClinics.length > 0 ? filteredClinics[0].coords : [9.082, 8.6753];

  // ==========================================
  // VIEW: CLINIC DETAIL PAGE
  // ==========================================
  if (selectedClinic) {
    return (
      <div className="h-full min-h-full flex-1 bg-white flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-4 px-4 text-white flex items-center gap-3 z-10 shadow-sm">
          <button
            onClick={() => setSelectedClinic(null)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h2 className="text-[20px] font-extrabold tracking-tight">
            Facility Details
          </h2>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Hospital Image Wrapper - Taller for a better native look */}
          <div className="w-full h-64 shrink-0 bg-gray-200 relative">
            <img
              src={
                selectedClinic.image ||
                "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
              alt={selectedClinic.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white -mt-8 rounded-t-xl relative z-10 px-6 pt-8 pb-28 flex-1 flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
            <h1 className="text-[24px] font-extrabold text-gray-900 leading-tight mb-3">
              {selectedClinic.name}
            </h1>

            <div className="inline-flex items-center gap-1.5 bg-[#E8F5F0] text-[#1B5E4B] px-3 py-1.5 rounded-lg text-[12px] font-extrabold mb-8 self-start">
              <BadgeCheck size={16} strokeWidth={3} /> Accredited Facility
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 bg-[#fdfaf5] text-gray-500 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <MapPin size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Address
                  </span>
                  <span className="text-[15px] text-gray-900 font-bold mt-0.5 leading-snug">
                    {selectedClinic.address}
                  </span>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 bg-[#fdfaf5] text-gray-500 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <Clock size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Hours
                  </span>
                  <span className="text-[15px] text-gray-900 font-bold mt-0.5">
                    {selectedClinic.hours || "24 Hours"}
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 bg-[#fdfaf5] text-gray-500 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <Phone size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Phone
                  </span>
                  <span className="text-[15px] text-gray-900 font-bold mt-0.5">
                    {selectedClinic.phone || "01-774-4391"}
                  </span>
                </div>
              </div>

              {/* Services */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 bg-[#fdfaf5] text-gray-500 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <Stethoscope size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Services
                  </span>
                  <span className="text-[15px] text-gray-900 font-bold mt-0.5 leading-relaxed">
                    {selectedClinic.services ||
                      "High-Risk Pregnancy, Specialist Care, Labour & Delivery, Immunization"}
                  </span>
                </div>
              </div>

              {/* Action Buttons in Info Card */}
              <div className="flex gap-3 pt-6 mt-auto border-t border-gray-100">
                <button
                  onClick={() => alert(`Calling ${selectedClinic.name}...`)}
                  className="flex-1 bg-[#1B5E4B] text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#154b3c] active:scale-95 transition-all shadow-sm text-[14px] cursor-pointer"
                >
                  <PhoneCall size={18} strokeWidth={2.5} /> Call Now
                </button>
                <button
                  onClick={() =>
                    alert(`Opening Maps for ${selectedClinic.name}...`)
                  }
                  className="flex-1 bg-[#E8F5F0] text-[#1B5E4B] font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#d5ebe2] active:scale-95 transition-all shadow-sm text-[14px] cursor-pointer"
                >
                  <Navigation size={18} strokeWidth={2.5} /> Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN LIST & MAP PAGE
  // ==========================================
  return (
    <div className="h-full min-h-full flex-1 bg-[#fdfaf5] flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-8 px-6 text-white flex items-center gap-3 z-10 shadow-sm">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 hover:bg-white/10 rounded-full transition-colors mr-1 cursor-pointer"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
        )}
        <div>
          <h2 className="text-[26px] font-extrabold tracking-tight leading-tight">
            {t?.locHeading || "Find Healthcare"}
          </h2>
          <p className="text-[13px] text-white/80 mt-0.5">
            {t?.locSub || "Accredited facilities near you"}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 relative z-10 shrink-0">
        <input
          className="w-full bg-white border-[1.5px] border-gray-200 rounded-xl py-3.5 px-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-[14px] outline-none focus:border-[#1B5E4B] transition-colors placeholder:text-gray-400"
          placeholder="Search by state, LGA, or name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Map Element */}
      <div className="h-48 mx-4 mb-2 rounded-2xl overflow-hidden border-[1.5px] border-gray-200 relative z-0 shrink-0 shadow-sm">
        <MapContainer
          center={mapCenter}
          zoom={12}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapUpdater coords={mapCenter} />
          {filteredClinics.map((clinic) => (
            <Marker key={clinic.id} position={clinic.coords}>
              <Popup className="text-sm font-bold">
                {clinic.name} <br />
                <span className="font-normal text-gray-500">
                  {clinic.lga}, {clinic.state}
                </span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-4 pb-28 pt-2 flex flex-col gap-3 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {filteredClinics.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedClinic(c)}
            className="bg-white p-4 rounded-[20px] border-[1.5px] border-gray-100 hover:border-[#1B5E4B]/40 transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          >
            <div className="font-extrabold text-[15px] text-gray-900 flex items-center gap-2">
              <Building2
                size={18}
                className="text-[#1B5E4B]"
                strokeWidth={2.5}
              />
              {c.name}
            </div>
            <div className="text-[12px] text-gray-500 mt-1.5 pl-6 leading-snug">
              {c.address}
            </div>
            <div className="flex justify-between items-center mt-3 pl-6">
              <span className="text-[12px] font-extrabold text-[#1B5E4B]">
                📍 {c.dist || "2.5 km away"}
              </span>
              <span className="text-[11px] font-bold text-gray-400">
                View Details &rarr;
              </span>
            </div>
          </div>
        ))}
        {filteredClinics.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-6 font-semibold pb-10">
            No clinics found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
