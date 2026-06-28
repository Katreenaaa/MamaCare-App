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
  Asterisk,
  RotateCw,
  Search,
  ListFilter,
  Crosshair,
  Bookmark,
} from "lucide-react";

function MapUpdater({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 12, { animate: true, duration: 1.5 });
  }
  return null;
}

export default function ClinicPage({ onBack }) {
  // Split search into Area and Name to match the new premium layout
  const [areaSearch, setAreaSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [selectedClinic, setSelectedClinic] = useState(null);

  // Filter Logic: Must match BOTH Area and Name if provided
  const filteredClinics = CLINICS.filter((c) => {
    const matchesArea =
      !areaSearch ||
      (c.state && c.state.toLowerCase().includes(areaSearch.toLowerCase())) ||
      (c.lga && c.lga.toLowerCase().includes(areaSearch.toLowerCase())) ||
      (c.address && c.address.toLowerCase().includes(areaSearch.toLowerCase()));

    const matchesName =
      !nameSearch || c.name.toLowerCase().includes(nameSearch.toLowerCase());

    return matchesArea && matchesName;
  });

  // Find the center point for the map based on search results
  const mapCenter =
    filteredClinics.length > 0 ? filteredClinics[0].coords : [6.5244, 3.3792]; // Default to Lagos

  // ==========================================
  // VIEW: CLINIC DETAIL PAGE
  // ==========================================
  if (selectedClinic) {
    return (
      <div className="h-full min-h-full flex-1 bg-white flex flex-col overflow-hidden relative">
        {/* Header (Light Theme to match premium feel) */}
        <div className="shrink-0 bg-[#fdfaf5] pt-14 pb-4 px-4 text-gray-900 flex items-center gap-3 z-10 border-b border-gray-100">
          <button
            onClick={() => setSelectedClinic(null)}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors cursor-pointer text-[#1B5E4B]"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h2 className="text-[20px] font-extrabold tracking-tight">
            Facility Details
          </h2>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Hospital Image Wrapper */}
          <div className="w-full h-64 shrink-0 bg-[#E8F5F0] relative flex items-center justify-center">
            <img
              src={
                selectedClinic.image ||
                "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
              alt={selectedClinic.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/mama-care.png";
              }}
            />
          </div>

          <div className="bg-white -mt-8 rounded-t-4xl relative z-10 px-6 pt-8 pb-28 flex-1 flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
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
  // VIEW: MAIN LIST & MAP PAGE (Premium Look)
  // ==========================================
  return (
    <div className="h-full min-h-full flex-1 bg-[#fdfaf5] flex flex-col overflow-hidden relative">
      {/* 1. Header */}
      <div className="shrink-0 pt-14 pb-4 px-6 flex items-center justify-between z-10 bg-[#fdfaf5]">
        <div className="flex items-center gap-2.5">
          {onBack ? (
            <button
              onClick={onBack}
              className="p-1 -ml-1 hover:bg-gray-200 rounded-full transition-colors cursor-pointer text-[#1B5E4B]"
            >
              <ArrowLeft size={24} strokeWidth={2.5} />
            </button>
          ) : (
            <Asterisk size={28} className="text-[#1B5E4B]" strokeWidth={3} />
          )}
          <h2 className="text-[22px] font-extrabold tracking-tight text-gray-900 leading-tight">
            Maternity Locator
          </h2>
        </div>
        <button
          onClick={() => {
            setAreaSearch("");
            setNameSearch("");
          }}
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[#1B5E4B] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCw size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-28">
        {/* 2. Premium Search Inputs */}
        <div className="px-6 flex flex-col gap-3 z-10 relative mb-4">
          {/* Area Search */}
          <div className="flex items-center bg-white border-[1.5px] border-gray-200 rounded-full px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus-within:border-[#1B5E4B] transition-colors">
            <MapPin
              size={18}
              className="text-[#1B5E4B] shrink-0 mr-3"
              strokeWidth={2.5}
            />
            <input
              className="flex-1 text-[14px] outline-none placeholder:text-gray-400 text-gray-900 font-medium"
              placeholder="Search by area e.g. Ikorodu, Suru"
              value={areaSearch}
              onChange={(e) => setAreaSearch(e.target.value)}
            />
            <Search
              size={18}
              className="text-[#1B5E4B] shrink-0 ml-2"
              strokeWidth={2.5}
            />
          </div>

          {/* Name Filter */}
          <div className="flex items-center bg-white border-[1.5px] border-gray-200 rounded-full px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus-within:border-[#1B5E4B] transition-colors">
            <ListFilter
              size={18}
              className="text-gray-400 shrink-0 mr-3"
              strokeWidth={2.5}
            />
            <input
              className="flex-1 text-[14px] outline-none placeholder:text-gray-400 text-gray-900 font-medium"
              placeholder="Filter by clinic name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>
        </div>

        {/* 3. Map Element */}
        <div className="h-52 mx-6 mb-4 rounded-3xl overflow-hidden border-[1.5px] border-gray-200 relative z-0 shrink-0 shadow-sm">
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

        {/* 4. Tab Toggles */}
        <div className="px-6 flex gap-3 mb-4 shrink-0">
          <button className="bg-[#1B5E4B] text-white px-5 py-2 rounded-full text-[13px] font-extrabold flex items-center gap-2 shadow-sm">
            <Crosshair size={16} strokeWidth={2.5} /> All nearby
          </button>
          <button className="bg-white border-[1.5px] border-gray-200 text-gray-500 px-5 py-2 rounded-full text-[13px] font-extrabold flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Bookmark size={16} strokeWidth={2.5} /> Saved (1)
          </button>
        </div>

        {/* 5. Scrollable list */}
        <div className="px-6 flex flex-col gap-4">
          {filteredClinics.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedClinic(c)}
              className="bg-white p-5 rounded-3xl border-[1.5px] border-[#E8F5F0] hover:border-[#1B5E4B]/40 transition-all cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div className="font-extrabold text-[16px] text-gray-900 leading-tight">
                  {c.name}
                </div>
                <button className="bg-[#FFF6E5] text-orange-500 p-2 rounded-full shrink-0">
                  <PhoneCall size={16} strokeWidth={2.5} />
                </button>
              </div>

              <div className="inline-block bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[11px] font-bold mt-2 self-start uppercase tracking-wider">
                {c.dist || "2.5 km"}
              </div>

              <div className="flex items-center gap-2 text-[13px] text-gray-500 mt-3 font-medium">
                <MapPin size={14} className="text-gray-400 shrink-0" />
                <span className="truncate">{c.address}</span>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                <span className="bg-[#E8F5F0] text-[#1B5E4B] px-3 py-1 rounded-full text-[11px] font-extrabold">
                  Clinic
                </span>
                <span className="bg-[#FFE8EC] text-[#8B1D3B] px-3 py-1 rounded-full text-[11px] font-extrabold">
                  Prenatal Care
                </span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[11px] font-extrabold">
                  Outpatient
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
    </div>
  );
}
