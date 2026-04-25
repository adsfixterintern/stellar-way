import CommonHero from "@/components/shared/CommonHero";
import React from "react";
import ChefsP from "./_components/ChefsP";
import Gallery from "./_components/Gallery";
import StatsSection from "./_components/StatsSection";

export default function page() {
  return (
    <div>
      <CommonHero
        buttonPath="/reservation"
        buttonText="Reserve Your Table"
        isAboutPage={true}
        title="About Savory Nest"
        description="Savory Nest is a place where passion for food meets a warm and welcoming dining experience. Since our beginning, we have been dedicated to creating delicious meals that bring people together."
        mainImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
        youtubeVideoId="14QoPp2Wl7E"
      />
      <ChefsP></ChefsP>
      <Gallery></Gallery>
      <StatsSection/>
    </div>
  );
}
