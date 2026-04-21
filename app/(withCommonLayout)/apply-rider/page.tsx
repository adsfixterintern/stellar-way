/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { applyForRiderApi } from "@/app/modules/rider/rider.api";
import { IRider } from "@/app/modules/rider/rider.interface";
import { toast } from "react-hot-toast";
import SingleHero from "@/components/shared/SingleHero";

const RiderApplyForm = () => {
  const { data: session } = useSession();

  const [formData, setFormData] = useState<Partial<IRider>>({
    phoneNumber: "",
    vehicleType: "" as any,
    licenseNumber: "",
    identityCard: "",
    area: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const response = await applyForRiderApi({
        ...formData,
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
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
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
              <input
                required
                type="text"
                value={formData.phoneNumber}
                placeholder="+880 1XXXXXXXXX"
                className={inputClass}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phoneNumber: e.target.value,
                  })
                }
              />
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
              className="w-full mt-6 bg-[#324a1f] hover:bg-[#243515] text-white py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Apply as Rider
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
