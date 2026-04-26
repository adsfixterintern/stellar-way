"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getAllGalleryItems } from '../../../../app/modules/gallery/gallery.api';
import { IGalleryItem } from '../../../../app/modules/gallery/gallery.interface';

const Gallery = () => {
    const [items, setItems] = useState<IGalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllGalleryItems();
                setItems(res); 
            } catch (error) {
                console.error("Gallery fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const midPoint = Math.ceil(items.length / 2);
    const firstRow = items.slice(0, midPoint);
    const secondRow = items.slice(midPoint);

    // --- Skeleton Component ---
    const GallerySkeleton = () => (
        <div className="flex flex-col gap-6 w-full animate-pulse">
            {[1, 2].map((row) => (
                <div key={row} className="flex gap-6 overflow-hidden">
                    {[1, 2, 3, 4].map((skeleton) => (
                        <div 
                            key={skeleton} 
                            className="w-[300px] md:w-[400px] h-[250px] md:h-[300px] bg-gray-200 rounded-[30px] flex-shrink-0"
                        />
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <section className="max-w-7xl mx-auto py-20 bg-white overflow-hidden">
            <div className="text-center mb-16 px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-[#3A4D39] mb-4 tracking-tight">
                    Our Gallery
                </h2>
                <p className="text-gray-500 max-w-lg mx-auto italic">
                    Every corner, every dish, a memory in the making.
                </p>
            </div>

            {loading ? (
                <GallerySkeleton />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* First Row: Scroll Left */}
                    <div className="flex overflow-hidden relative group">
                        <div className="flex gap-6 animate-scroll-left group-hover:pause">
                            {[...firstRow, ...firstRow].map((item, index) => (
                                <div key={`${item._id}-${index}`} className="relative w-[300px] md:w-[400px] h-[250px] md:h-[300px] rounded-[30px] overflow-hidden flex-shrink-0 shadow-lg bg-gray-100">
                                    <Image 
                                        src={item.image} 
                                        alt="gallery" 
                                        fill 
                                        className="object-cover hover:scale-110 transition-transform duration-700" 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Second Row: Scroll Right */}
                    <div className="flex overflow-hidden relative group">
                        <div className="flex gap-6 animate-scroll-right group-hover:pause">
                            {[...secondRow, ...secondRow].map((item, index) => (
                                <div key={`${item._id}-${index}`} className="relative w-[300px] md:w-[400px] h-[250px] md:h-[300px] rounded-[30px] overflow-hidden flex-shrink-0 shadow-lg bg-gray-100">
                                    <Image 
                                        src={item.image} 
                                        alt="gallery" 
                                        fill 
                                        className="object-cover hover:scale-110 transition-transform duration-700" 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scroll-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-scroll-left {
                    animation: scroll-left 40s linear infinite;
                }
                .animate-scroll-right {
                    animation: scroll-right 40s linear infinite;
                }
                .pause {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default Gallery;