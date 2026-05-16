'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

function FeaturedSectionView({ section, products = [], collections = [] }: { section: any, products: any[], collections: any[] }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  let displayedProducts = [];
  if (section.type === 'category' && section.categoryId) {
    const categoryName = collections.find(c => c.id === section.categoryId)?.name;
    displayedProducts = products.filter(p => p.category === categoryName);
  } else if (section.type === 'products' && section.productIds) {
    displayedProducts = products.filter(p => (section.productIds || []).includes(p.id));
  }

  if (displayedProducts.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-white relative">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-8 relative">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] pr-24">{section.title}</h2>
          <Link href="/shop" className="text-xs uppercase tracking-widest font-semibold pb-1 border-b border-[#1a1a1a] hover:text-primary hover:border-primary transition-colors whitespace-nowrap">
            VIEW ALL
          </Link>
        </div>

        <div className="relative group/carousel">
          <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-[1px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style dangerouslySetInnerHTML={{ __html: `::-webkit-scrollbar { display: none; }` }} />
            {displayedProducts.map(product => (
              <div key={product.id} className="w-[calc(50%-8px)] lg:w-[calc(25%-12px)] flex-shrink-0 snap-start group flex flex-col">
                <Link href={`/product/${product.id}`} className="relative aspect-[4/5] mb-3 bg-gray-100 border border-gray-200 overflow-hidden block">
                  <Image 
                    src={product.image?.data || 'https://picsum.photos/600/800'} 
                    alt={product.name} 
                    fill 
                    className={`object-cover transition-opacity duration-500 ${(Array.isArray(product.images) && product.images.length > 0) ? 'group-hover:opacity-0' : 'group-hover:opacity-90'}`}
                    referrerPolicy="no-referrer"
                  />
                  {(Array.isArray(product.images) && product.images.length > 0) && (
                    <Image
                      src={product.images[0].data || 'https://picsum.photos/600/800'}
                      alt={`${product.name} alternate`}
                      fill
                      className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  
                  {/* NEW Badge */}
                  <div className="absolute top-3 left-3 bg-white px-2 py-1">
                    <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-[#1a1a1a]">New</span>
                  </div>

                  {/* Heart Icon (Mock for Add to Wishlist) */}
                  <button onClick={(e) => e.preventDefault()} className="absolute bottom-3 right-3 bg-white p-2 hover:bg-gray-50 transition-colors z-10" aria-label="Add to wishlist">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                     </svg>
                  </button>
                </Link>

                {/* Color Swatches */}
                {(Array.isArray(product.images) && product.images.length > 0) && (
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <div className="w-6 h-6 border border-black relative overflow-hidden cursor-pointer transition-colors">
                       <Image src={product.image?.data || 'https://picsum.photos/50/50'} fill alt="Main" className="object-cover" />
                    </div>
                    {product.images.slice(0, 3).map((img: any, idx: number) => (
                      <div key={idx} className="w-6 h-6 border border-gray-300 relative overflow-hidden cursor-pointer hover:border-black transition-colors opacity-80 hover:opacity-100">
                         <Image src={img.data || 'https://picsum.photos/50/50'} fill alt={`swatch ${idx}`} className="object-cover" />
                      </div>
                    ))}
                    {product.images.length > 3 && (
                      <span className="text-xs text-gray-500 ml-1">+ {product.images.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Product Details */}
                <div className="flex flex-col mt-2">
                  <Link href={`/product/${product.id}`} className="block hover:underline mb-1 w-full">
                    <h3 className="font-semibold text-sm sm:text-base text-[#1a1a1a] leading-tight line-clamp-2 break-words" title={product.name}>{product.name}</h3>
                    <p className="text-gray-500 text-[10px] sm:text-xs tracking-wide mt-1 truncate" title={product.category}>{product.category}</p>
                  </Link>
                  <span className="font-medium text-sm sm:text-base tracking-wide mt-0.5">
                    {Number(product.price || 0).toLocaleString('id-ID')} IDR
                    <span className="text-[10px] text-gray-400 ml-1 font-normal tracking-normal lowercase">
                      / {product.uom?.replace(/per /i, '') || 'pcs'}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          {displayedProducts.length > 4 && (
            <>
              <button 
                onClick={() => scroll('left')} 
                className="absolute left-0 top-[40%] md:top-[35%] -translate-y-1/2 bg-white/90 p-2 shadow-sm border border-gray-100 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 hover:bg-white"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} strokeWidth={1} />
              </button>
              <button 
                onClick={() => scroll('right')} 
                className="absolute right-0 top-[40%] md:top-[35%] -translate-y-1/2 bg-white/90 p-2 shadow-sm border border-gray-100 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 hover:bg-white"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} strokeWidth={1} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { state } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [profileSlideIndex, setProfileSlideIndex] = useState(0);

  // Auto-advance hero slides
  useEffect(() => {
    if (!state.heroSlides || state.heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % state.heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [state.heroSlides]);

  // Auto-advance profile slides
  useEffect(() => {
    if (!state.storyImages || state.storyImages.length <= 1) return;
    const timer = setInterval(() => {
      setProfileSlideIndex((prev) => (prev + 1) % state.storyImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [state.storyImages]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % (state.heroSlides?.length || 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + (state.heroSlides?.length || 1)) % (state.heroSlides?.length || 1));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Carousel */}
      <section className="relative w-full aspect-[16/10] sm:aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[3.2/1] bg-black overflow-hidden group">
        <AnimatePresence initial={false}>
          {(state.heroSlides || []).map((slide, index) => {
             if (index !== currentSlide) return null;
             const imgSrc = slide.image?.data || 'https://picsum.photos/1920/1080';
             return (
               <motion.div
                 key={slide.id || index}
                 initial={{ opacity: 0, scale: 1.05 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                 className="absolute inset-0"
               >
                 <Image 
                   src={imgSrc} 
                   alt={slide.title} 
                   fill 
                   className="object-cover opacity-80"
                   referrerPolicy="no-referrer"
                   priority={index === 0}
                 />
                 {!slide.hideContent && (
                   <>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                     
                     <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                       <div className="max-w-4xl space-y-6">
                          {slide.subtitle && (
                            <motion.h2 
                              initial={{ y: 30, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.3, duration: 0.8 }}
                              className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-primary font-semibold drop-shadow-md"
                            >
                              {slide.subtitle}
                            </motion.h2>
                          )}
                          {slide.title && (
                            <motion.h1 
                              initial={{ y: 40, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.5, duration: 0.9 }}
                              className="text-5xl md:text-7xl lg:text-8xl font-serif text-white uppercase tracking-tight drop-shadow-lg"
                            >
                              {slide.title}
                            </motion.h1>
                          )}
                          {slide.ctaText && (
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.8, duration: 0.6 }}
                              className="pt-8"
                            >
                               <Link href="/shop" className="inline-block border border-white text-white px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-white hover:text-black transition-colors duration-300">
                                 {slide.ctaText}
                               </Link>
                            </motion.div>
                          )}
                       </div>
                     </div>
                   </>
                 )}
               </motion.div>
             )
          })}
        </AnimatePresence>

        {/* Controls */}
        {(state.heroSlides?.length || 0) > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-10 hidden md:block">
              <ChevronLeft size={40} strokeWidth={1} />
            </button>
            <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-10 hidden md:block">
              <ChevronRight size={40} strokeWidth={1} />
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10 justify-center items-center">
              {(state.heroSlides || []).map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                  aria-label={`Go to slide ${i+1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Featured Sections */}
      {(state.featuredSections || []).map(section => (
        <FeaturedSectionView key={section.id} section={section} products={state.products} collections={state.collections} />
      ))}

      {/* Brand Profile Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
             <div className="order-2 lg:order-1 space-y-8">
               <h4 className="text-xs uppercase tracking-widest text-accent font-semibold">Profil Kami</h4>
               <h2 className="font-serif text-4xl md:text-6xl leading-[1.1] tracking-tight">
                 {state.storyTitle ? (
                   <span dangerouslySetInnerHTML={{ __html: state.storyTitle.replace(/\n/g, '<br/>') }} />
                 ) : (
                   <>Warisan<br/>Tenun Sengkang</>
                 )}
               </h2>
               <div className="space-y-4 opacity-70 text-base leading-relaxed">
                 {state.storyDescription ? (
                   state.storyDescription.split('\n').map((paragraph: string, i: number) => (
                     <p key={i}>{paragraph}</p>
                   ))
                 ) : (
                   <>
                     <p>
                       Terletak di jantung Sulawesi Selatan, Sengkang telah lama dikenal sebagai kota sutra. Sejak tahun 1990, Kain Sutra Sengkang telah berkomitmen untuk melestarikan tradisi luhur ini melalui keahlian dan dedikasi.
                     </p>
                     <p>
                       Kami bekerja berdampingan dengan para pengrajin lokal, memastikan setiap helai benang ditenun dengan presisi dan cinta, menghasilkan karya seni yang tak lekang oleh waktu dan menghargai nilai sejarah. Misi kami adalah menghadirkan kemewahan sutra Sengkang ke seluruh penjuru negeri, menggabungkan desain klasik dengan sentuhan modern.
                     </p>
                   </>
                 )}
               </div>
               <div className="pt-8 block">
                  <Link href="/profile" className="inline-flex items-center gap-2 group">
                    <span className="uppercase text-sm font-semibold tracking-widest border-b border-black group-hover:border-primary group-hover:text-primary transition-colors">Pelajari Lebih Lanjut</span>
                    <ChevronRight className="w-4 h-4 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
               </div>
             </div>

             <div className="order-1 lg:order-2 relative aspect-auto lg:h-[700px] w-full">
               <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-primary/20 translate-x-4 translate-y-4 rounded-sm" />
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.8 }}
                 className="relative h-full w-full aspect-[4/5] z-10 overflow-hidden rounded-sm"
                >
                  <AnimatePresence initial={false}>
                    {state.storyImages && state.storyImages.length > 0 ? (
                      <motion.div
                         key={profileSlideIndex}
                         initial={{ opacity: 0, scale: 1.05 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 1.2 }}
                         className="absolute inset-0"
                      >
                       <Image 
                         src={state.storyImages[profileSlideIndex % state.storyImages.length]?.image?.data || 'https://picsum.photos/seed/brandprofile/800/1000'} 
                         fill 
                         className="object-cover" 
                         alt="Pengrajin Tenun Sengkang" 
                         referrerPolicy="no-referrer" 
                       />
                      </motion.div>
                    ) : (
                      <Image src="https://picsum.photos/seed/brandprofile/800/1000" fill className="object-cover" alt="Pengrajin Tenun Sengkang" referrerPolicy="no-referrer" />
                    )}
                  </AnimatePresence>
               </motion.div>
             </div>
           </div>
        </div>
      </section>

      {/* Removed Featured Products */}
    </div>
  );
}
