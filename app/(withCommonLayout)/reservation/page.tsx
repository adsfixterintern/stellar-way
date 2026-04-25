/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import CommonHero from "@/components/shared/CommonHero";
import Contact from "@/components/shared/Contact";
import reservationImg from "@/assets/img/reservationHero.jpg";
import bookingtableHero from "@/assets/img/bookingtableHero.png";
import { createBooking } from "@/app/modules/booking/booking.api"; 
import { Table } from "lucide-react";
import TableReservationForm from "./_components/TableReservationForm";
import ViewAllTables from "./_components/ViewAllTables";

const ReservationPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const user = session?.user as any;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

      if (status === "unauthenticated" || !user) {
      toast.error("Please login to book a table");
      router.push("/login");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);


    const payload: any = {
      userId: user.id || user._id, 
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      email: user.email,
      phone: formData.get("phone") as string,
      address: (formData.get("address") as string) || "Not Specified",
      guest: Number(formData.get("guest")),
      time: formData.get("time") as string,
      date: formData.get("date") as string,
      specialRequest: "", 
    };

    try {
      const res = await createBooking(payload);
      
      if (res.success) {
        toast.success("Table reserved successfully!");
        (e.target as HTMLFormElement).reset();
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1D3A15]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <CommonHero
        isAboutPage={true}
        title={
          <span>
            Reserve Your <br /> Table
          </span>
        }
        description="Book your table at Savory Nest and enjoy a delightful dining experience with friends and family."
        mainImage={reservationImg.src}
        buttonText=""
        buttonPath=""
        youtubeVideoId="14QoPp2Wl7E"
      />
<ViewAllTables></ViewAllTables>
      <TableReservationForm />

      <div className="py-20 bg-white">
        <Contact />
      </div>
    </div>
  );
};

export default ReservationPage;