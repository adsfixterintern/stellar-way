
import LatestBlog from "@/components/LatestBlog";
import SingleHero from "@/components/shared/SingleHero";
import Testimonial from "@/components/Testimonial";
import React from "react";
import BlogInitialPage from "./_components/BlogInitialPage";

export default function page() {
  return (
    <div>
      <SingleHero
        isCenter={true}
        subtitle="Blog"
        title="Savory Nest Blog"
        description="Explore our blog for culinary tips, recipes, and the latest news from Savory Nest."
        buttonTitle="Order Now"
        buttonLink="/menu"
      />
      <LatestBlog></LatestBlog>
      <BlogInitialPage></BlogInitialPage>
      <Testimonial></Testimonial>
    </div>
  );
}
