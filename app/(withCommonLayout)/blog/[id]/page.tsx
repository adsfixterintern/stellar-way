import SingleHero from "@/components/shared/SingleHero";
import React from "react";

export default function page() {
  return (
    <div>
      <SingleHero
        isCenter={true}
        subtitle="dada"
        title="Savoring Excellence: Chef Alex's Top Culinary Tips"
        description="At Savory Nest, we believe in culinary excellence. Join us as Chef Alex shares his top tips for creating unforgettable dishes at home"
        buttonTitle="Order Now"
        buttonLink="/blog"
      />
    </div>
  );
}
    