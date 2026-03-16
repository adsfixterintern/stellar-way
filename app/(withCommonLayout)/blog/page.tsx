import SingleHero from "@/components/shared/SingleHero";
import React from "react";

export default function page() {
  return (
    <div>
      <SingleHero
        isCenter={true}
        subtitle="Blog"
        title="Savory Nest Blog"
        description="Explore our blog for culinary tips, recipes, and the latest news from Savory Nest."
        buttonTitle="Order Now"
        buttonLink="/blog"
      />
    </div>
  );
}
