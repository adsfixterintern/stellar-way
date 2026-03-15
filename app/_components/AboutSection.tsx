"use client"; 

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import aboutImage from '@/public/assets/home/homeAbout.png'; 
import qualityIcon from '@/public/assets/home/icon1.png'; 
import reputationIcon from '@/public/assets/home/icon2.png';

const AboutSection: React.FC = () => {

  const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -100 }, 
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const contentContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const textItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Single Image */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative w-full h-[350px] md:h-[550px]"
        >
          <Image
            src={aboutImage}
            alt="About Our Restaurant"
            fill
            className="object-contain lg:object-left" 
            priority
          />
        </motion.div>

        {/* Right Side: Content */}
        <motion.div
          className="flex flex-col gap-6"
          variants={contentContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span className="superTitle" variants={textItemVariants}>
            About Us
          </motion.span>
          
          <motion.h2 className="secTitle text-black" variants={textItemVariants}>
            About Savory Nest
          </motion.h2>
          
          <motion.p className="description" variants={textItemVariants}>
            At SavoryNest, we believe great food brings people together. Our chefs blend tradition with innovation to create dishes that are rich in flavor and beautifully presented.
          </motion.p>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-4" variants={textItemVariants}>
            
            {/* Feature 1: Super Quality Food */}
            <div className="flex gap-4 items-start">
              <div className="relative w-12 h-12 flex-shrink-0">
                 <Image 
                    src={qualityIcon} 
                    alt="Quality Icon" 
                    fill 
                    className="object-contain"
                 />
              </div>
              <div>
                <h4 className="cardTitle !mb-1 !text-[20px]">Super Quality Food</h4>
                <p className="cardDescription !text-sm !mb-0 text-gray">
                   A group of visionaries and action takers creating original interactive art and music.
                </p>
              </div>
            </div>

            {/* Feature 2: Well Reputation */}
            <div className="flex gap-4 items-start">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image 
                    src={reputationIcon} 
                    alt="Reputation Icon" 
                    fill 
                    className="object-contain"
                 />
              </div>
              <div>
                <h4 className="cardTitle !mb-1 !text-[20px]">Well Reputation</h4>
                <p className="cardDescription !text-sm !mb-0 text-gray">
                   A group of visionaries and action takers creating original interactive art and music.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={textItemVariants}>
            <button className="blockBtn">Explore More</button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;