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
    vehicleType: "bike",
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

    try {
  
      const payload = {
        ...formData,
        userId: userId,
      };

      const response = await applyForRiderApi(payload);

      if (response.success) {
        toast.success("Application Submitted Successfully!");
        setFormData({
          phoneNumber: "",
          vehicleType: "bike",
          licenseNumber: "",
          identityCard: "",
          area: "",
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <SingleHero />
      <div className="max-w-lg mx-auto p-8 bg-white text-[#333] font-sans my-10 shadow-sm border border-gray-100 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Section */}
          <section>
            <h3 className="text-lg font-medium mb-4 text-[#324a1f]">Contact</h3>
            <input
              required
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              placeholder="Phone Number (+880)"
              className="w-full py-3 border-b border-gray-200 focus:border-[#324a1f] outline-none transition-colors text-sm bg-transparent"
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
          </section>

          {/* Vehicle Info */}
          <section>
            <h3 className="text-lg font-medium mb-4 text-[#324a1f]">Vehicle Information</h3>
            <select
              className="w-full py-3 border-b border-gray-200 focus:border-[#324a1f] outline-none bg-transparent text-sm mb-4"
              value={formData.vehicleType}
              onChange={(e) =>
                setFormData({ ...formData, vehicleType: e.target.value as any })
              }
            >
              <option value="bike">Bike</option>
              <option value="cycle">Cycle</option>
              <option value="car">Car</option>
            </select>

            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              placeholder="License Number"
              className="w-full py-3 border-b border-gray-200 focus:border-[#324a1f] outline-none text-sm bg-transparent"
              onChange={(e) =>
                setFormData({ ...formData, licenseNumber: e.target.value })
              }
            />
          </section>

          {/* Area Section */}
          <section>
            <h3 className="text-lg font-medium mb-4 text-[#324a1f]">Operation Area</h3>
            <input
              required
              type="text"
              name="area"
              value={formData.area}
              placeholder="Area (e.g. Dhaka, Dhanmondi)"
              className="w-full py-3 border-b border-gray-200 focus:border-[#324a1f] outline-none text-sm bg-transparent"
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            />
          </section>

          {/* Identity Link */}
          <section>
            <h3 className="text-lg font-medium mb-2 text-[#324a1f]">Verification</h3>
            <p className="text-xs text-gray-500 mb-2">Identity Card </p>
            <input
              required
              type="text"
              name="identityCard"
              value={formData.identityCard}
              placeholder="NID Card No"
              className="w-full py-3 border-b border-gray-200 focus:border-[#324a1f] outline-none text-sm bg-transparent"
              onChange={(e) =>
                setFormData({ ...formData, identityCard: e.target.value })
              }
            />
          </section>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="blockBtn w-full"
            >
              Apply to be a Rider
            </button>

            <p className="text-[10px] text-gray-400 mt-4 text-center leading-relaxed">
              Your info will be saved to a Stellar account. By continuing, you
              agree to Stellar's Terms of Service and acknowledge the Privacy
              Policy.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiderApplyForm;