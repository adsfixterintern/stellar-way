import SingleHero from "@/components/shared/SingleHero";
import React from "react";

export default function page() {
  return (
    <div>
      <SingleHero
        isCenter={true}
        subtitle="MENU"
        title="Our Exquisite Menu"
        description="Enjoy Savory Nest From The Comfort Of Your Home"
        buttonTitle="Order Now"
        buttonLink="/menu"
      />
    </div>
  );
}
