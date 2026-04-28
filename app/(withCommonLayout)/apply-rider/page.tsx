/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { applyForRiderApi } from "@/app/modules/rider/rider.api";
import { IRider } from "@/app/modules/rider/rider.interface";
import { toast } from "react-hot-toast";
import SingleHero from "@/components/shared/SingleHero";
import { countries } from "countries-list";

const RiderApplyForm = () => {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<IRider>>({
    phoneNumber: "",
    vehicleType: "" as any,
    licenseNumber: "",
    identityCard: "",
    area: "",
  });
  const [countryCode, setCountryCode] = useState("+880");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const countryCodeOptions = Object.values(countries)
    .map((country) => ({
      name: country.name,
      dialCode: country.phone?.[0] ? `+${country.phone[0]}` : "",
    }))
    .filter((country) => country.dialCode)
    .sort((a, b) => a.name.localeCompare(b.name));
  const selectedCountry =
    countryCodeOptions.find((country) => country.dialCode === countryCode) ||
    countryCodeOptions[0];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "loading") {
      toast.error("Please wait, checking your session...");
      return;
    }

    if (status !== "authenticated") {
      toast.error("Please login to apply for a rider!");
      signIn();
      return;
    }

    const userId = (session?.user as any)?.id || (session?.user as any)?._id;

    if (!userId) {
      toast.error("Please login to apply for a rider!");
      return;
    }

    if (!formData.vehicleType) {
      toast.error("Please select a vehicle type!");
      return;
    }

    try {
      setIsSubmitting(true);
      // Align with dashboard-style fresh session access before protected API hits.
      await fetch("/api/auth/session", { cache: "no-store" });

      const response = await applyForRiderApi({
        ...formData,
        phoneNumber: `${countryCode}${formData.phoneNumber}`,
        userId,
      });

      if (response.success) {
        toast.success("Application Submitted Successfully!");
        setFormData({
          phoneNumber: "",
          vehicleType: "" as any,
          licenseNumber: "",
          identityCard: "",
          area: "",
        });
        setCountryCode("+880");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#324a1f] focus:ring-2 focus:ring-[#324a1f]/20 outline-none text-sm transition-all";

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white pb-16">
      <SingleHero />

      {/* CARD */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white shadow-lg border border-gray-100 rounded-2xl p-8 md:p-10 mt-10">
          {/* HEADER */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1f2d13]">
              Rider Application
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Fill up the form to become a delivery partner
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PHONE */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Phone Number
              </label>
              <div className="w-full h-[56px] flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#324a1f] focus-within:ring-2 focus-within:ring-[#324a1f]/20 transition-all">
                <div
                  ref={countryDropdownRef}
                  className="relative h-full w-40 md:w-48 shrink-0 border-r border-gray-200 z-20"
                >
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen((prev) => !prev)}
                    className="h-full w-full bg-gray-100 px-2 text-left text-xs md:text-sm outline-none flex items-center justify-between gap-2"
                  >
                    <span className="truncate">
                      {selectedCountry?.name} ({countryCode})
                    </span>
                    <span className="text-gray-500">▼</span>
                  </button>
                  {isCountryOpen && (
                    <div className="absolute top-full left-0 mt-1 w-72 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {countryCodeOptions.map((country) => (
                        <button
                          type="button"
                          key={`${country.name}-${country.dialCode}`}
                          onClick={() => {
                            setCountryCode(country.dialCode);
                            setIsCountryOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs md:text-sm hover:bg-gray-50"
                        >
                          {country.name} ({country.dialCode})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  value={formData.phoneNumber}
                  placeholder="01700000000"
                  className="w-full min-w-0 h-full px-4 bg-transparent outline-none text-sm"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 11),
                    })
                  }
                />
              </div>
            </div>

            {/* VEHICLE */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Vehicle Type
              </label>

              <div className="relative">
                <select
                  required
                  value={formData.vehicleType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehicleType: e.target.value as any,
                    })
                  }
                  className={inputClass + " appearance-none"}
                >
                  <option value="">Select vehicle</option>
                  <option value="bike">Bike</option>
                  <option value="cycle">Cycle</option>
                  <option value="car">Car</option>
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  ▼
                </div>
              </div>
            </div>

            {/* LICENSE */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                License Number
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                placeholder="Enter license number"
                className={inputClass}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    licenseNumber: e.target.value,
                  })
                }
              />
            </div>

            {/* AREA */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Operation Area
              </label>
              <input
                required
                type="text"
                value={formData.area}
                placeholder="e.g. Dhaka, Dhanmondi"
                className={inputClass}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    area: e.target.value,
                  })
                }
              />
            </div>

            {/* NID */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Identity Card (NID)
              </label>
              <input
                required
                type="text"
                value={formData.identityCard}
                placeholder="NID number"
                className={inputClass}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    identityCard: e.target.value,
                  })
                }
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || status === "loading"}
              className="w-full mt-6 bg-[#324a1f] hover:bg-[#243515] text-white py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              {isSubmitting ? "Submitting..." : "Apply as Rider"}
            </button>

            <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
              By applying, you agree to our Terms & Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RiderApplyForm;
