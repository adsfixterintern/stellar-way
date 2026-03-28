/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import CommonHero from "@/components/shared/CommonHero";
import { useEvents } from "@/app/hooks/useEvent";
import { IEvent } from "@/types/event";
import privateEvent1 from "@/assets/img/privateEvent1.jpg";
import privateEvent2 from "@/assets/img/privateEvent2.jpg";
import privateEvent3 from "@/assets/img/privateEvent3.jpg";
import eventHero from "@/assets/img/eventHero.jpg";
import upcomingEvent_bg from "@/assets/img/upcomingEvent_bg.png";
import leaf from "@/assets/img/leaf.png";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";

const EventsPage = () => {
  const { data: eventResponse, isLoading } = useEvents("?status=active");
  const events = eventResponse?.data || [];

  console.log(events);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="bg-white font-sans">
      <CommonHero
        isAboutPage={true}
        title={
          <span>
            Events at <br /> Savory Nest
          </span>
        }
        description="Join us at Savory Nest for exciting culinary events, live music nights, and special dining experiences. Reserve your spot and enjoy unforgettable moments."
        mainImage={eventHero}
        buttonText="Book Event"
        buttonPath="/event-booking"
      />

      <section
        className="py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(228, 245, 220, 0.9), rgba(228, 245, 220, 0.9)), url(${upcomingEvent_bg.src})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="superTitle">Event</p>
              <h2 className="secTitle">Upcoming Events</h2>
            </div>

            {/* Custom Navigation Arrows */}
            <div className="flex gap-2">
              <button
                ref={prevRef}
                className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                ref={nextRef}
                className="w-10 h-10 rounded bg-[#1D3A15] text-white flex items-center justify-center hover:bg-black transition-all"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={25}
            slidesPerView={1}
            onInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {events?.map((item: IEvent) => (
              <SwiperSlide key={item._id}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
                  <div className="h-56 w-full relative">
                    <img
                      src={
                        item.image.includes("http") &&
                        !item.image.includes("create-event")
                          ? item.image
                          : "https://via.placeholder.com/400x300"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex gap-4 text-[13px] font-medium text-gray-600">
                      <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                        <Calendar size={14} className="text-primary" />{" "}
                        {item.date}
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 border rounded-full">
                        <Clock size={14} className="text-primary" /> {item.time}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#1E1E1E]">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {item.subTitle}
                    </p>

                    {/* Avatars like your image */}
                    <div className="flex items-center pt-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <img
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white object-cover"
                            src={`https://i.pravatar.cc/100?img=${i + 10}`}
                            alt="user"
                          />
                        ))}
                      </div>
                      <span className="ml-3 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                        +15
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 relative overflow-hidden">
        {/* --- Top Left Leaf Image --- */}
        <div className="absolute -left-12 -top-12 w-48 h-48 md:w-64 md:h-64 pointer-events-none ">
          <Image
            src={leaf}
            alt="leaf decoration"
            fill
            className="object-contain -rotate-90"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="superTitle">Event</p>
              <p className="secTitle">Private Events</p>
            </div>
            <p className="description">
              Host your private events at Savory Nest. From intimate gatherings
              to grand celebrations, our team is dedicated to creating a
              memorable dining experience for you and your guests.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="blockBtn">Learn More</button>
              <Link href={"/contact"}>
                <button className="px-8 py-3 rounded-lg border border-gray-300 font-bold hover:bg-gray-50 transition-all text-sm md:text-base">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4 h-80 md:h-112">
            <div className="col-span-1 relative h-full">
              <Image
                src={privateEvent1}
                alt="Private Event Large"
                fill
                className="rounded-2xl object-cover shadow-lg"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>

            <div className="col-span-1 grid grid-rows-2 gap-4 h-full">
              <div className="relative">
                <Image
                  src={privateEvent2}
                  alt="Event Detail 1"
                  fill
                  className="rounded-2xl object-cover shadow-md"
                  sizes="(max-width: 768px) 100vw, 15vw"
                />
              </div>

              <div className="relative">
                <Image
                  src={privateEvent3}
                  alt="Event Detail 2"
                  fill
                  className="rounded-2xl object-cover shadow-md"
                  sizes="(max-width: 768px) 100vw, 15vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;


