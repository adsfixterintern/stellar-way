/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import CommonHero from "@/components/shared/CommonHero";
import Contact from "@/components/shared/Contact";
import reservationImg from "@/assets/img/reservationHero.jpg";
import TableReservationForm from "./_components/TableReservationForm";
import ViewAllTables from "./_components/ViewAllTables";

const ReservationPage = () => {
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
