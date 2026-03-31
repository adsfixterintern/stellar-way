"use client";

import React from "react";
import SingleHero from "@/components/shared/SingleHero";
import Contact from "@/components/shared/Contact";


const ContactPage = () => {
  return (
    <div className="bg-white min-h-screen">

      <SingleHero
        subtitle="Contact"
        title="Contact Us"
        description="We're Here To Assist You. Reach Out With Any Inquiries Or Feedback, And We'll Respond Promptly."
        buttonTitle=""
        buttonLink=""
        isCenter={true}
      /> 
      <div className="py-6 md:py-20">
        <Contact />
      </div>

 
    </div>
  );
};

export default ContactPage;