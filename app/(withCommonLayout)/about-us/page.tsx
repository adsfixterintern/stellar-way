import CommonHero from "@/components/shared/CommonHero";
import React from "react";
import ChefsP from "./_components/ChefsP";

export default function page() {
  return (
    <div>
      <CommonHero
        isAboutPage={true}
        title="About Savory Nest"
        description="Savory Nest is a place where passion for food meets a warm and welcoming dining experience. Since our beginning, we have been dedicated to creating delicious meals that bring people together."
        buttonText="Reserve Your Table"
        mainImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
      />
      <ChefsP></ChefsP>
    </div>
  );
}
