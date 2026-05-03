'use client';

import { useStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useState } from 'react';
import { X } from 'lucide-react';
import { StoryImage } from '@/lib/types';

export default function ProfilePage() {
  const { state } = useStore();
  const [selectedImage, setSelectedImage] = useState<StoryImage | null>(null);

  const heroImageUrl = state.storyImages && state.storyImages.length > 0 && state.storyImages[0].image?.data 
    ? state.storyImages[0].image.data 
    : 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'; // fallback silk image

  return (
    <div className="min-h-screen bg-[#fcfbf9] overflow-x-hidden">
      
      {/* Profil Kami Hero Section (Reflecting the 2nd Screenshot) */}
      <div className="flex flex-col lg:flex-row min-h-[85vh]">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-[#fcfbf9]">
          <div className="max-w-xl w-full">
            <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-8 leading-[1.1]">
              {state.storyTitle || 'Warisan\nTenun Sengkang'}
            </h1>
            <div className="text-gray-700 text-sm md:text-base leading-relaxed space-y-6">
              {state.storyDescription || 'Terletak di jantung Sulawesi Selatan, Sengkang telah lama dikenal sebagai kota sutra...'}
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-full">
          <Image 
            src={heroImageUrl} 
            alt="Profil Kami" 
            fill 
            className="object-cover" 
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Our Story Grid Section (Reflecting the 1st Screenshot) */}
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-8">Our Story</h2>
        <div className="text-gray-700 text-sm md:text-base leading-relaxed space-y-6 text-justify md:text-center whitespace-pre-wrap">
          {'Setiap motif memiliki cerita, dan setiap warna membawa makna. Perjalanan kami bermula dari cinta dan kebanggaan terhadap kain sutra Sengkang..'}
        </div>
      </div>

      {/* Masonry/Grid of Images */}
      <div className="px-4 md:px-8 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-12">
          {state.storyImages?.map((item) => (
            <div 
              key={item.id} 
              className="group relative flex flex-col cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                {item.image?.data ? (
                  <Image 
                    src={item.image.data} 
                    alt={item.caption || "Story image"} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-serif text-sm">No Image</div>
                )}
              </div>
              {item.title && (
                <p className="text-xs text-black font-medium tracking-wide text-left">{item.title}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pop-out overlay */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedImage(null)} 
            className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity z-10"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row bg-white overflow-hidden shadow-2xl">
              {/* Left Side: Detail Image */}
              <div className="relative w-full md:w-2/3 aspect-square md:aspect-auto md:min-h-[60vh] bg-gray-100">
                {selectedImage.image?.data && (
                  <Image 
                    src={selectedImage.image.data} 
                    alt={selectedImage.caption || "Image Detail"} 
                    fill 
                    className="object-contain md:object-cover" 
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              
              {/* Right Side: Caption Description */}
              <div className="w-full md:w-1/3 p-8 flex flex-col justify-center bg-white">
                <h3 className="font-serif text-2xl mb-4">{selectedImage.title || "Momen Ini"}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedImage.caption || "Sebuah cerita tanpa kata-kata."}
                </p>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
