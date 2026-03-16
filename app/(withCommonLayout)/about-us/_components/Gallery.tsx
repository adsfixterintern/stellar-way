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
            const data = await getAllGalleryItems();
            setItems(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center py-20 font-medium">Loading Gallery...</div>;

    const midPoint = Math.ceil(items.length / 2);
    const firstRow = items.slice(0, midPoint);
    const secondRow = items.slice(midPoint);

    return (
        <section className="max-w-7xl mx-auto py-20 bg-white overflow-hidden">
            <div className="text-center mb-16 px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-[#3A4D39] mb-4 tracking-tight">
                    Our Gallery
                </h2>
                <p className="text-gray-500 max-w-lg mx-auto italic">
                    "Every corner, every dish, a memory in the making."
                </p>
            </div>

            <div className="flex flex-col gap-6 w-full">
                
                <div className="flex overflow-hidden relative group">
                    <div className="flex gap-6 animate-scroll-left group-hover:pause">
                        {[...firstRow, ...firstRow].map((item, index) => (
                            <div key={`${item._id}-${index}`} className="relative w-[300px] md:w-[400px] h-[250px] md:h-[300px] rounded-[30px] overflow-hidden flex-shrink-0 shadow-lg">
                                <Image src={item.image} alt="gallery" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex overflow-hidden relative group">
                    <div className="flex gap-6 animate-scroll-right group-hover:pause">
                        {[...secondRow, ...secondRow].map((item, index) => (
                            <div key={`${item._id}-${index}`} className="relative w-[300px] md:w-[400px] h-[250px] md:h-[300px] rounded-[30px] overflow-hidden flex-shrink-0 shadow-lg">
                                <Image src={item.image} alt="gallery" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

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