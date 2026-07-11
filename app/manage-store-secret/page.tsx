'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { ImageInput, HeroSlide, Collection, Product } from '@/lib/types';
import Image from 'next/image';
import { Settings, Image as ImageIcon, Layout, Box, FolderPlus, ToggleLeft, Trash2, Plus, GripVertical, LogOut, Save, RotateCcw, Menu, X, ShoppingBag, Loader2 } from 'lucide-react';

const handleImageUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

type Tab = 'general' | 'logo' | 'hero' | 'featuredSections' | 'megaMenu' | 'hamburgerMenu' | 'profile' | 'collections' | 'products' | 'catalog' | 'orders';

export default function AdminDashboard() {
  const { state, savedState, setState, saveToDb, discardChanges } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('logo');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pinEntry, setPinEntry] = useState('');
  const [isPinCorrect, setIsPinCorrect] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasChanges = JSON.stringify(state) !== JSON.stringify(savedState);

  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Only show auth prompt if user knows the exact secret key via hash
    if (window.location.hash === '#authorized-admin-access') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowAuth(true);
    }
  }, []);

  const handleLogout = async () => {
    setIsPinCorrect(false);
    setPinEntry('');
    window.location.hash = '';
    setShowAuth(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveToDb();
      alert('Changes saved successfully!');
    } catch (err: any) {
      alert('Failed to save changes: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!showAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <h1 className="text-2xl font-serif mb-2">404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  if (!isPinCorrect) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm">
          <h1 className="font-serif text-2xl text-center mb-6">Restricted Area</h1>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            if (pinEntry === 'admin123') setIsPinCorrect(true); 
            else { alert('Invalid PIN'); setPinEntry(''); }
          }}>
            <input 
              type="password" 
              placeholder="Enter Access PIN" 
              value={pinEntry}
              onChange={e => setPinEntry(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-center tracking-widest text-lg"
            />
            <button 
              type="submit"
              className="w-full bg-black text-white py-3 text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden absolute inset-0 w-full">
      {isSaving && (
        <div className="absolute inset-0 bg-white/80 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
            <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">Menyimpan Perubahan...</p>
          </div>
        </div>
      )}
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 flex-shrink-0 relative z-20">
        <div>
          <h2 className="font-serif text-lg">Admin Panel</h2>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
           <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40 w-72 md:w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out h-full shadow-2xl md:shadow-none`}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white relative z-10">
          <div>
            <h2 className="font-serif text-xl">Admin Panel</h2>
            <p className="text-xs text-gray-500 mt-1">Kain Sutra Sengkang</p>
          </div>
          <button className="md:hidden text-gray-500 hover:text-gray-700 p-2" onClick={() => setIsMobileMenuOpen(false)}>
             <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto w-full relative z-10 bg-white">
          <TabButton active={activeTab === 'general'} onClick={() => { setActiveTab('general'); setIsMobileMenuOpen(false); }} icon={<Settings size={18} />} label="General Settings" />
          <TabButton active={activeTab === 'logo'} onClick={() => { setActiveTab('logo'); setIsMobileMenuOpen(false); }} icon={<ImageIcon size={18} />} label="Logo Manager" />
          <TabButton active={activeTab === 'hero'} onClick={() => { setActiveTab('hero'); setIsMobileMenuOpen(false); }} icon={<Layout size={18} />} label="Homepage Slides" />
          <TabButton active={activeTab === 'featuredSections'} onClick={() => { setActiveTab('featuredSections'); setIsMobileMenuOpen(false); }} icon={<Layout size={18} />} label="Featured Sections" />
          <TabButton active={activeTab === 'megaMenu'} onClick={() => { setActiveTab('megaMenu'); setIsMobileMenuOpen(false); }} icon={<Layout size={18} />} label="Mega Menu Cards" />
          <TabButton active={activeTab === 'hamburgerMenu'} onClick={() => { setActiveTab('hamburgerMenu'); setIsMobileMenuOpen(false); }} icon={<Layout size={18} />} label="Hamburger Menu" />
          <TabButton active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }} icon={<ImageIcon size={18} />} label="About Page Settings" />
          <TabButton active={activeTab === 'collections'} onClick={() => { setActiveTab('collections'); setIsMobileMenuOpen(false); }} icon={<FolderPlus size={18} />} label="Collections/Category" />
          <TabButton active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }} icon={<Box size={18} />} label="Products" />
          <TabButton active={activeTab === 'catalog'} onClick={() => { setActiveTab('catalog'); setIsMobileMenuOpen(false); }} icon={<ToggleLeft size={18} />} label="Catalog Control" />
          <TabButton active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }} icon={<ShoppingBag size={18} />} label="Order Management" />
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0 bg-white relative z-10">
          {hasChanges && (
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mb-4 space-y-2">
               <p className="text-xs text-amber-800 font-medium">Unsaved changes!</p>
               <button onClick={handleSave} disabled={isSaving} className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-2 rounded text-xs font-semibold hover:bg-amber-600 transition-colors">
                  <Save size={14} /> {isSaving ? 'Saving...' : 'Save Changes'}
               </button>
               <button onClick={discardChanges} disabled={isSaving} className="w-full flex items-center justify-center gap-2 bg-white border border-amber-300 text-amber-800 py-2 rounded text-xs font-semibold hover:bg-amber-100 transition-colors">
                  <RotateCcw size={14} /> Discard
               </button>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto relative w-full">
        {/* Mobile quick save widget when there are changes */}
        <div className="md:hidden mb-6">
           {hasChanges && (
             <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex items-center gap-3 shadow-sm">
                <div className="flex-1 flex gap-2 w-full">
                  <button onClick={handleSave} disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white py-2.5 rounded text-sm font-semibold hover:bg-amber-600 transition-colors">
                     <Save size={16} /> Save
                  </button>
                  <button onClick={discardChanges} disabled={isSaving} className="px-4 flex items-center justify-center gap-2 bg-white border border-amber-300 text-amber-800 py-2.5 rounded text-sm font-semibold hover:bg-amber-100 transition-colors">
                     <RotateCcw size={16} />
                  </button>
                </div>
             </div>
           )}
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-8 w-full">
          {activeTab === 'general' && <GeneralSettingsManager state={state} setState={setState} />}
          {activeTab === 'logo' && <LogoManager state={state} setState={setState} />}
          {activeTab === 'hero' && <HeroManager state={state} setState={setState} />}
          {activeTab === 'featuredSections' && <FeaturedSectionManager state={state} setState={setState} />}
          {activeTab === 'megaMenu' && <MegaMenuManager state={state} setState={setState} />}
          {activeTab === 'hamburgerMenu' && <HamburgerMenuManager state={state} setState={setState} />}
          {activeTab === 'profile' && <AboutPageManager state={state} setState={setState} />}
          {activeTab === 'collections' && <CollectionManager state={state} setState={setState} />}
          {activeTab === 'products' && <ProductManager state={state} setState={setState} />}
          {activeTab === 'catalog' && <CatalogManager state={state} setState={setState} />}
          {activeTab === 'orders' && <OrderManager />}
        </div>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
    >
      {icon} {label}
    </button>
  );
}

// Subcomponents for each tab
function GeneralSettingsManager({ state, setState }: any) {
  const [ogUrl, setOgUrl] = useState('');

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const base64 = await handleImageUpload(e.target.files[0]);
      setState((s: any) => ({ ...s, openGraphImage: { type: 'base64', data: base64 } }));
    }
  };

  const saveOgUrl = () => {
    if (ogUrl) {
      setState((s: any) => ({ ...s, openGraphImage: { type: 'url', data: ogUrl } }));
      setOgUrl('');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-1">General Settings</h3>
        <p className="text-sm text-gray-500 mb-6">Manage global store links and contacts.</p>
      </div>

      <div className="space-y-6 max-w-xl">
        <div className="space-y-2">
          <label className="block text-sm font-semibold">WhatsApp Link/Number</label>
          <div className="text-xs text-gray-500 mb-2">
            Example: <code className="bg-gray-100 px-1 py-0.5 rounded">6281234567890</code> or a full URL like <code className="bg-gray-100 px-1 py-0.5 rounded">https://wa.me/6281234567890</code>
          </div>
          <input 
            type="text" 
            value={state.whatsappNumber || ''} 
            onChange={(e) => setState((s: any) => ({ ...s, whatsappNumber: e.target.value }))}
            placeholder="e.g., 6281234567890"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Link Google Maps Toko Offline</label>
          <div className="text-xs text-gray-500 mb-2">
            Peta offline store (Google Maps Link) atau tautan internal (misalnya /locations).
          </div>
          <input 
            type="text" 
            value={state.offlineStoreLink || ''} 
            onChange={(e) => setState((s: any) => ({ ...s, offlineStoreLink: e.target.value }))}
            placeholder="e.g., /locations or https://maps.google.com/..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Instagram Link</label>
          <input 
            type="text" 
            value={state.instagramLink || ''} 
            onChange={(e) => setState((s: any) => ({ ...s, instagramLink: e.target.value }))}
            placeholder="https://instagram.com/..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Facebook Link</label>
          <input 
            type="text" 
            value={state.facebookLink || ''} 
            onChange={(e) => setState((s: any) => ({ ...s, facebookLink: e.target.value }))}
            placeholder="https://facebook.com/..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-1">SEO & Social Sharing Metadata</h3>
        <p className="text-sm text-gray-500 mb-6">Manage how your site appears on search engines and social media platforms (like WhatsApp, Twitter, Facebook).</p>

        <div className="space-y-6 max-w-xl">
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Metadata Title</label>
            <input 
              type="text" 
              value={state.metaTitle || ''} 
              onChange={(e) => setState((s: any) => ({ ...s, metaTitle: e.target.value }))}
              placeholder="e.g., Kain Sutra Sengkang | Luxury Silk"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold">Metadata Description</label>
            <textarea 
              rows={3}
              value={state.metaDescription || ''} 
              onChange={(e) => setState((s: any) => ({ ...s, metaDescription: e.target.value }))}
              placeholder="e.g., Keindahan Kain Sutra Asli dari Sengkang"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-4">
            <label className="block text-sm font-semibold mb-2">Social Share Image (OpenGraph)</label>
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center min-h-[160px] mb-4">
              {state.openGraphImage ? (
                <img src={state.openGraphImage.data} alt="OpenGraph Preview" className="max-h-32 object-contain" />
              ) : (
                <p className="text-sm text-gray-400">No image set. Will fallback to site logo or default image.</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Upload File</span>
                <input type="file" accept="image/*" onChange={handleOgUpload} className="mt-1 w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-black" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Or Paste URL</span>
                <div className="flex gap-2 mt-1">
                  <input type="text" value={ogUrl} onChange={e => setOgUrl(e.target.value)} placeholder="https://..." className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs" />
                  <button onClick={saveOgUrl} className="bg-black text-white px-3 py-1 rounded text-xs">Set</button>
                </div>
              </div>
            </div>

            {state.openGraphImage && (
              <button 
                onClick={() => setState((s: any) => { const newState = {...s}; delete newState.openGraphImage; return newState; })} 
                className="mt-3 text-xs text-red-600 font-medium flex items-center gap-1 hover:underline"
              >
                <Trash2 size={12} /> Remove Social Image
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoManager({ state, setState }: any) {
  const [url, setUrl] = useState('');
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const base64 = await handleImageUpload(e.target.files[0]);
      setState((s: any) => ({ ...s, logo: { type: 'base64', data: base64 } }));
    }
  };

  const saveUrl = () => {
    if (url) {
      setState((s: any) => ({ ...s, logo: { type: 'url', data: url } }));
      setUrl('');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-1">Logo Manager</h3>
        <p className="text-sm text-gray-500 mb-2">Manage the main website logo. Uploaded files take priority.</p>
        <p className="text-xs text-primary font-medium mb-6">Recommended: Transparent PNG or SVG with a horizontal layout.</p>
      </div>

      <div className="p-6 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center min-h-[160px]">
         {state.logo ? (
           <img src={state.logo.data} alt="Logo" className="max-h-24 object-contain" />
         ) : (
           <p className="text-sm text-gray-400">No logo set. Default text will be used.</p>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border border-gray-200 rounded-md">
          <h4 className="text-sm font-semibold mb-4">Upload from PC</h4>
          <input type="file" accept="image/*" onChange={handleUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
        </div>
        <div className="p-6 border border-gray-200 rounded-md">
           <h4 className="text-sm font-semibold mb-4">Paste Image URL</h4>
           <div className="flex gap-2">
             <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
             <button onClick={saveUrl} className="bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black">Save</button>
           </div>
        </div>
      </div>
      
      {state.logo && (
         <button onClick={() => setState((s: any) => ({ ...s, logo: undefined }))} className="text-sm text-red-600 font-medium flex items-center gap-2 hover:underline">
           <Trash2 size={16} /> Remove Logo
         </button>
      )}
    </div>
  );
}

function HeroManager({ state, setState }: any) {
   const addSlide = () => {
     const newSlide: HeroSlide = {
       id: Math.random().toString(36).substring(7),
       title: 'New Slide',
       subtitle: 'Subtitle',
       ctaText: 'Read More'
     };
     setState((s: any) => ({ ...s, heroSlides: [...s.heroSlides, newSlide] }));
   };

   const updateSlide = (id: string, field: keyof HeroSlide, value: any) => {
     setState((s: any) => ({
       ...s, heroSlides: s.heroSlides.map((slide: HeroSlide) => slide.id === id ? { ...slide, [field]: value } : slide)
     }));
   };

   const updateSlideImage = async (id: string, type: 'url' | 'base64', data: string | File) => {
     let imageData = data as string;
     if (type === 'base64') {
       imageData = await handleImageUpload(data as File);
     }
     setState((s: any) => ({
       ...s, heroSlides: s.heroSlides.map((slide: HeroSlide) => slide.id === id ? { ...slide, image: { type, data: imageData } } : slide)
     }));
   };

   const deleteSlide = (id: string) => {
     setState((s: any) => ({ ...s, heroSlides: s.heroSlides.filter((sl: HeroSlide) => sl.id !== id) }));
   };

   return (
     <div className="space-y-8">
       <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Homepage Slides</h3>
            <p className="text-sm text-gray-500">Manage the hero carousel on the homepage.</p>
            <p className="text-xs text-primary font-medium mt-1">Recommended ratio: Wide banner (e.g., 1920x600px or approximately 3:1 ratio).</p>
          </div>
          <button onClick={addSlide} className="flex items-center gap-2 bg-primary text-secondary px-4 py-2 rounded-md font-medium text-sm hover:brightness-105">
            <Plus size={16} /> Add Slide
          </button>
       </div>

       <div className="space-y-6">
         {(state.heroSlides || []).map((slide: HeroSlide, index: number) => (
           <div key={slide.id} className="border border-gray-200 rounded-md p-6 relative bg-gray-50">
             <button onClick={() => deleteSlide(slide.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors">
               <Trash2 size={18} />
             </button>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Title</label>
                    <input type="text" value={slide.title} onChange={e => updateSlide(slide.id, 'title', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Subtitle</label>
                    <input type="text" value={slide.subtitle} onChange={e => updateSlide(slide.id, 'subtitle', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">CTA Text</label>
                    <input type="text" value={slide.ctaText} onChange={e => updateSlide(slide.id, 'ctaText', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Background Image</label>
                  {slide.image && (
                     <div className="relative aspect-video bg-gray-200 rounded overflow-hidden mb-4 border border-gray-300">
                       <img src={slide.image.data} className="w-full h-full object-cover" alt="Slide Preview" />
                     </div>
                  )}
                  <div className="flex flex-col gap-3">
                     <input 
                       type="file" 
                       accept="image/*" 
                       onChange={e => e.target.files?.[0] && updateSlideImage(slide.id, 'base64', e.target.files[0])} 
                       className="text-xs text-gray-500 w-full"
                     />
                     <div className="flex gap-2">
                       <input 
                         type="text" 
                         placeholder="Or paste URL..." 
                         className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs"
                         onBlur={e => e.target.value && updateSlideImage(slide.id, 'url', e.target.value)}
                       />
                     </div>
                  </div>
                  
                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!slide.hideContent} 
                        onChange={e => updateSlide(slide.id, 'hideContent', !e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      Show Text Overlay & CTA
                    </label>
                  </div>
                </div>
             </div>
           </div>
         ))}
       </div>
     </div>
   );
}

function AboutPageManager({ state, setState }: any) {
  const images = state.storyImages || [];

  const addImage = () => {
    if (images.length >= 20) return;
    setState((s: any) => ({ 
      ...s, 
      storyImages: [...images, { id: Math.random().toString(), title: '', caption: '', image: { type: 'url', data: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809' } }] 
    }));
  };

  const updateImage = async (id: string, type: 'url' | 'base64', data: string | File) => {
    let imageData = data as string;
    if (type === 'base64') {
      imageData = await handleImageUpload(data as File);
    }
    setState((s: any) => ({
      ...s,
      storyImages: s.storyImages.map((img: any) => img.id === id ? { ...img, image: { type, data: imageData } } : img)
    }));
  };

  const updateTitle = (id: string, title: string) => {
    setState((s: any) => ({
      ...s,
      storyImages: s.storyImages.map((img: any) => img.id === id ? { ...img, title } : img)
    }));
  };

  const updateCaption = (id: string, caption: string) => {
    setState((s: any) => ({
      ...s,
      storyImages: s.storyImages.map((img: any) => img.id === id ? { ...img, caption } : img)
    }));
  };

  const deleteImage = (id: string) => {
    setState((s: any) => ({ 
      ...s, 
      storyImages: s.storyImages.filter((img: any) => img.id !== id) 
    }));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 p-6 border border-gray-200 rounded-md bg-gray-50">
         <div>
           <h3 className="text-lg font-semibold mb-1">About Page Text</h3>
           <p className="text-sm text-gray-500 mb-4">Edit the title and content for the profile page.</p>
         </div>
         <div className="space-y-4">
           <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Title</label>
             <input 
               type="text" 
               value={state.storyTitle || ''} 
               onChange={e => setState((s: any) => ({ ...s, storyTitle: e.target.value }))}
               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
             />
           </div>
           <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Description (Story)</label>
             <textarea 
               rows={6}
               value={state.storyDescription || ''} 
               onChange={e => setState((s: any) => ({ ...s, storyDescription: e.target.value }))}
               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
             />
           </div>
         </div>
      </div>

      <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
         <div>
           <h3 className="text-lg font-semibold">Story Timeline Images ({images.length}/20)</h3>
           <p className="text-sm text-gray-500">Manage the collection of images shown on the profile page.</p>
           <p className="text-xs text-primary font-medium mt-1">Recommended ratio: 3:4 portrait.</p>
         </div>
         <button onClick={addImage} disabled={images.length >= 20} className="flex items-center gap-2 bg-primary text-secondary px-4 py-2 rounded-md font-medium text-sm hover:brightness-105 disabled:opacity-50">
           <Plus size={16} /> Add Image
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((img: any, index: number) => (
          <div key={img.id} className="border border-gray-200 rounded-md p-6 relative bg-white flex flex-col gap-4 shadow-sm">
            <button onClick={() => deleteImage(img.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">
              <Trash2 size={16} />
            </button>
            
            <div className="w-full aspect-[3/4] bg-gray-100 rounded overflow-hidden border border-gray-200 relative">
               {img.image?.data ? (
                 <img src={img.image.data} className="w-full h-full object-cover" alt={`Story ${index + 1}`} />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
               )}
            </div>

            <div className="w-full space-y-4">
              <div className="flex flex-col gap-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">Image Source</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) updateImage(img.id, 'base64', e.target.files[0]) }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-xs hover:bg-gray-100 text-center">Upload File</button>
                  </div>
                  <input type="text" placeholder="Or URL..." value={img.image?.type === 'url' ? img.image.data : ''} onChange={e => updateImage(img.id, 'url', e.target.value)} className="flex-1 border border-gray-300 px-3 py-1 text-xs rounded focus:outline-none focus:border-black" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Momen Ini..."
                  value={img.title || ''} 
                  onChange={e => updateTitle(img.id, e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 mb-3 text-sm rounded focus:outline-none focus:border-black" 
                />
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Caption</label>
                <textarea
                  rows={2}
                  placeholder="Tell a story about this moment..."
                  value={img.caption || ''} 
                  onChange={e => updateCaption(img.id, e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-black resize-none" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectionManager({ state, setState }: any) {
  // Similar to HeroManager but for Collections
  const addCol = () => {
     const newC: Collection = { id: Math.random().toString(), name: 'New Collection', description: 'Description' };
     setState((s: any) => ({ ...s, collections: [...s.collections, newC] }));
   };

   const updateCol = (id: string, field: keyof Collection, value: any) => {
     setState((s: any) => ({
       ...s, collections: s.collections.map((c: Collection) => c.id === id ? { ...c, [field]: value } : c)
     }));
   };

   const updateColImage = async (id: string, type: 'url' | 'base64', data: string | File) => {
     let imageData = data as string;
     if (type === 'base64') { imageData = await handleImageUpload(data as File); }
     setState((s: any) => ({
       ...s, collections: s.collections.map((c: Collection) => c.id === id ? { ...c, image: { type, data: imageData } } : c)
     }));
   };

   const deleteCol = (id: string) => setState((s: any) => ({ ...s, collections: s.collections.filter((c: Collection) => c.id !== id) }));

   return (
     <div className="space-y-8">
       <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Collections/Category</h3>
          </div>
          <button onClick={addCol} className="bg-primary text-secondary px-4 py-2 rounded font-medium text-sm">Add Collection/Category</button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {(state.collections || []).map((col: Collection) => (
           <div key={col.id} className="border border-gray-200 rounded p-4 relative">
              <button onClick={() => deleteCol(col.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
              <input type="text" value={col.name} onChange={e => updateCol(col.id, 'name', e.target.value)} className="w-full text-lg font-serif font-semibold border-b border-transparent hover:border-gray-300 focus:border-primary mb-2 focus:outline-none" />
           </div>
         ))}
       </div>
     </div>
   );
}


function ProductManager({ state, setState }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', ...Array.from(new Set([
    ...(state.collections || []).map((c: any) => c.name),
    ...(state.products || []).map((p: Product) => p.category)
  ].filter(Boolean)))];

  const addProd = () => {
     const newP: Product = { id: Math.random().toString(), name: 'New Product', price: 0, description: '', category: 'General', isManual: true };
     setState((s: any) => ({ ...s, products: [newP, ...s.products] }));
   };

   const updateProd = (id: string, field: keyof Product, value: any) => {
     setState((s: any) => ({
       ...s, products: s.products.map((c: Product) => c.id === id ? { ...c, [field]: value } : c)
     }));
   };

   const updateProdImage = async (id: string, type: 'url' | 'base64', data: string | File) => {
     let imageData = data as string;
     if (type === 'base64') { imageData = await handleImageUpload(data as File); }
     setState((s: any) => ({
       ...s, products: s.products.map((c: Product) => c.id === id ? { ...c, image: { type, data: imageData } } : c)
     }));
   };

   const addProdImage = async (id: string, type: 'url' | 'base64', data: string | File) => {
     let imageData = data as string;
     if (type === 'base64') { imageData = await handleImageUpload(data as File); }
     setState((s: any) => ({
       ...s, products: s.products.map((c: Product) => c.id === id ? { ...c, images: [...(c.images || []), { type, data: imageData }] } : c)
     }));
   };

   const removeProdImage = (id: string, index: number) => {
     setState((s: any) => ({
       ...s, products: s.products.map((c: Product) => c.id === id ? { ...c, images: (c.images || []).filter((_: any, i: number) => i !== index) } : c)
     }));
   };

   const deleteProd = (id: string) => setState((s: any) => ({ ...s, products: s.products.filter((c: Product) => c.id !== id) }));

   let processedProducts = [...(state.products || [])].filter((prod: Product) => {
     const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (prod.category && prod.category.toLowerCase().includes(searchTerm.toLowerCase()));
     const matchesCategory = filterCategory === 'All' || prod.category === filterCategory;
     return matchesSearch && matchesCategory;
   });

   if (sortBy === 'name-asc') {
     processedProducts.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
   } else if (sortBy === 'price-asc') {
     processedProducts.sort((a: Product, b: Product) => (a.price || 0) - (b.price || 0));
   } else if (sortBy === 'price-desc') {
     processedProducts.sort((a: Product, b: Product) => (b.price || 0) - (a.price || 0));
   }

   return (
     <div className="space-y-8">
       <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">Products</h3>
            <p className="text-xs text-gray-500">Manage manual products.</p>
            <p className="text-xs text-primary font-medium mt-1">Recommended ratio: 4:5 or 3:4 portrait (e.g., 800x1000px).</p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-64"
              />
              <button onClick={addProd} className="bg-primary text-secondary px-4 py-2 rounded font-medium text-sm flex-shrink-0 whitespace-nowrap">Add Product</button>
            </div>
            <div className="flex gap-3">
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-auto bg-white flex-1"
              >
                {categories.map((cat: any) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-auto bg-white flex-1"
              >
                <option value="newest">Newest</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
          </div>
       </div>
       <div className="space-y-4">
         {processedProducts.length === 0 ? (
           <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded border border-gray-100">
             No products found matching your filters.
           </div>
         ) : null}
         {processedProducts.map((prod: Product) => (
           <div key={prod.id} className="flex flex-col md:flex-row border border-gray-200 rounded p-4 relative gap-6 hover:border-gray-300 transition-colors bg-white">
               <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                  {prod.image && <img src={prod.image.data} className="w-full h-full object-cover" alt="Preview"/>}
               </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Name</label>
                    <input type="text" value={prod.name} onChange={e => updateProd(prod.id, 'name', e.target.value)} className="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Price (IDR)</label>
                    <input type="number" value={prod.price} onChange={e => updateProd(prod.id, 'price', parseInt(e.target.value) || 0)} className="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Stock (Optional)</label>
                    <input type="number" value={prod.stock !== undefined ? prod.stock : ''} onChange={e => updateProd(prod.id, 'stock', e.target.value ? parseInt(e.target.value) : undefined)} className="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-primary" placeholder="Unlimited" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Category</label>
                    <select value={prod.category} onChange={e => updateProd(prod.id, 'category', e.target.value)} className="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-primary bg-white">
                      <option value="">-- Select Category --</option>
                      {state.collections?.map((col: any) => (
                        <option key={col.id} value={col.name}>{col.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Jenis Pembelian</label>
                    <select value={prod.productType || 'jadi'} onChange={e => updateProd(prod.id, 'productType', e.target.value)} className="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-primary bg-white">
                      <option value="jadi">Produk Jadi (Satuan)</option>
                      <option value="kain">Kain (Meter / Desimal)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Unit of Measure (UOM)</label>
                    <select value={prod.uom || ''} onChange={e => updateProd(prod.id, 'uom', e.target.value)} className="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-primary bg-white">
                      <option value="">-- Default (Per Pcs) --</option>
                      <option value="Per Pcs">Per Pcs</option>
                      <option value="Per Meter">Per Meter</option>
                      <option value="Per Pasang">Per Pasang</option>
                      <option value="Per Set">Per Set</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Primary Image</label>
                    <div className="flex flex-col gap-2">
                      <input type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) updateProdImage(prod.id, 'base64', e.target.files[0]) }} className="text-xs text-gray-500 w-full"/>
                      <input type="text" placeholder="URL..." onBlur={e => { if(e.target.value) updateProdImage(prod.id, 'url', e.target.value) }} className="w-full border border-gray-200 text-xs px-2 py-1 rounded" />
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Additional Photos (Variations)</label>
                    <div className="flex flex-col gap-2 mb-2">
                       <input type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) addProdImage(prod.id, 'base64', e.target.files[0]) }} className="text-xs text-gray-500 w-full"/>
                       <input type="text" placeholder="Add image URL..." onBlur={e => { if (e.target.value) addProdImage(prod.id, 'url', e.target.value); e.target.value = ''; }} className="w-full border border-gray-200 text-xs px-2 py-1 rounded" />
                    </div>
                    {prod.images && prod.images.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-2">
                        {(prod.images || []).map((img, idx) => (
                           <div key={idx} className="relative w-12 h-12 border border-gray-200 rounded overflow-hidden group">
                              <img src={img.data} className="w-full h-full object-cover" alt={`Variation ${idx+1}`} />
                              <button onClick={() => removeProdImage(prod.id, idx)} className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                 <Trash2 size={12} />
                              </button>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Tokopedia Link</label>
                    <input type="text" value={prod.tokopediaLink || ''} onChange={e => updateProd(prod.id, 'tokopediaLink', e.target.value)} placeholder="https://tokopedia.com/..." className="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Shopee Link</label>
                    <input type="text" value={prod.shopeeLink || ''} onChange={e => updateProd(prod.id, 'shopeeLink', e.target.value)} placeholder="https://shopee.co.id/..." className="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Informasi Deskripsi Produk</label>
                    <textarea rows={3} value={prod.description || ''} onChange={e => updateProd(prod.id, 'description', e.target.value)} className="w-full border border-gray-200 py-2 px-3 text-sm focus:outline-none focus:border-primary rounded mt-1 resize-y" placeholder="Product description..."></textarea>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Rincian Bahan & Material</label>
                    <textarea rows={2} value={prod.material || ''} onChange={e => updateProd(prod.id, 'material', e.target.value)} className="w-full border border-gray-200 py-2 px-3 text-sm focus:outline-none focus:border-primary rounded mt-1 resize-y" placeholder="e.g. 100% Cotton, Handwoven..."></textarea>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Panduan Perawatan</label>
                    <textarea rows={2} value={prod.careInstructions || ''} onChange={e => updateProd(prod.id, 'careInstructions', e.target.value)} className="w-full border border-gray-200 py-2 px-3 text-sm focus:outline-none focus:border-primary rounded mt-1 resize-y" placeholder="e.g. Dry clean only..."></textarea>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Informasi Panduan Ukuran</label>
                    <textarea rows={2} value={prod.sizeGuide || ''} onChange={e => updateProd(prod.id, 'sizeGuide', e.target.value)} className="w-full border border-gray-200 py-2 px-3 text-sm focus:outline-none focus:border-primary rounded mt-1 resize-y" placeholder="e.g. Lebar standar adalah 115cm..."></textarea>
                  </div>
              </div>
              <button onClick={() => deleteProd(prod.id)} className="h-fit align-top text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
           </div>
         ))}
       </div>
     </div>
   );
}


function FeaturedSectionManager({ state, setState }: any) {
  const addSection = () => {
    setState((s: any) => ({
      ...s,
      featuredSections: [
        ...(s.featuredSections || []),
        { id: Math.random().toString(36).substring(7), title: 'New Featured Section', type: 'products', productIds: [] }
      ]
    }));
  };

  const updateSection = (id: string, field: string, value: any) => {
    setState((s: any) => ({
      ...s,
      featuredSections: s.featuredSections.map((fs: any) => fs.id === id ? { ...fs, [field]: value } : fs)
    }));
  };

  const deleteSection = (id: string) => {
    setState((s: any) => ({
      ...s,
      featuredSections: s.featuredSections.filter((fs: any) => fs.id !== id)
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Featured Sections</h3>
          <p className="text-sm text-gray-500">Manage the product sections on the homepage (like &quot;New Designs&quot;, &quot;Classics&quot;).</p>
        </div>
        <button onClick={addSection} className="flex items-center gap-2 bg-primary text-secondary px-4 py-2 rounded-md font-medium text-sm hover:brightness-105">
          <Plus size={16} /> Add Section
        </button>
      </div>

      <div className="space-y-6">
        {(state.featuredSections || []).map((section: any) => (
          <div key={section.id} className="border border-gray-200 rounded-md p-6 relative bg-gray-50">
            <button onClick={() => deleteSection(section.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors">
              <Trash2 size={18} />
            </button>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Section Title</label>
                <input type="text" value={section.title} onChange={e => updateSection(section.id, 'title', e.target.value)} className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Source Type</label>
                <select value={section.type} onChange={e => updateSection(section.id, 'type', e.target.value)} className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                  <option value="category">Fetch by Category</option>
                  <option value="products">Select Specific Products</option>
                </select>
              </div>

              {section.type === 'category' ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Select Category</label>
                  <select value={section.categoryId || ''} onChange={e => updateSection(section.id, 'categoryId', e.target.value)} className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                    <option value="">-- Select Category --</option>
                    {state.collections?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Select Products (Ctrl/Cmd+Click to multi-select)</label>
                  <select multiple value={section.productIds || []} onChange={e => {
                    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                    updateSection(section.id, 'productIds', selected);
                  }} className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 text-sm bg-white min-h-[140px]">
                    {(state.products || []).map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MegaMenuManager({ state, setState }: any) {
  const updateCard = (id: string, field: string, value: any) => {
    setState((s: any) => ({
      ...s,
      megaMenuCards: s.megaMenuCards.map((c: any) => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const updateCardImage = async (id: string, type: 'url' | 'base64', data: string | File) => {
    let imageData = data as string;
    if (type === 'base64') { imageData = await handleImageUpload(data as File); }
    setState((s: any) => ({
      ...s,
      megaMenuCards: s.megaMenuCards.map((c: any) => c.id === id ? { ...c, image: { type, data: imageData } } : c)
    }));
  };

  const addCard = () => {
    setState((s: any) => ({
      ...s,
      megaMenuCards: [
        ...(s.megaMenuCards || []),
        { id: Math.random().toString(36).substring(7), title: 'New Category', link: '/shop' }
      ]
    }));
  };

  const deleteCard = (id: string) => {
    setState((s: any) => ({
      ...s,
      megaMenuCards: s.megaMenuCards.filter((c: any) => c.id !== id)
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Mega Menu Cards</h3>
          <p className="text-sm text-gray-500">Manage the featured cards shown in the navigation mega menu.</p>
          <p className="text-xs text-primary font-medium mt-1">Recommended ratio: 16:9 or 3:2 landscape (e.g., 800x500px).</p>
        </div>
        <button onClick={addCard} className="flex items-center gap-2 bg-primary text-secondary px-4 py-2 rounded-md font-medium text-sm hover:brightness-105" disabled={(state.megaMenuCards?.length || 0) >= 4}>
          <Plus size={16} /> Add Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(state.megaMenuCards || []).map((card: any, idx: number) => (
          <div key={card.id} className="border border-gray-200 rounded-md p-4 space-y-4 bg-gray-50 relative">
            <button onClick={() => deleteCard(card.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-white rounded p-1 shadow-sm"><Trash2 size={14}/></button>
            <h4 className="font-semibold text-sm pr-8">Card {idx + 1}</h4>
            
            <div className="aspect-[3/2] border border-gray-200 rounded overflow-hidden relative bg-gray-100 flex items-center justify-center">
              {card.image?.data ? (
                <img src={card.image.data} alt="card" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400">No image</span>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase font-semibold text-gray-400 mb-1 block">Image</label>
              <div className="flex flex-col gap-2">
                <input type="file" accept="image/*" onChange={e => { if(e.target.files?.[0]) updateCardImage(card.id, 'base64', e.target.files[0]) }} className="text-xs text-gray-500 w-full"/>
                <input type="text" placeholder="Or URL..." onBlur={e => { if(e.target.value) updateCardImage(card.id, 'url', e.target.value) }} className="w-full border border-gray-200 text-xs px-2 py-1 rounded" />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-semibold text-gray-400 mb-1 block">Title</label>
              <input type="text" value={card.title} onChange={e => updateCard(card.id, 'title', e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1 text-sm bg-white" />
            </div>

            <div>
              <label className="text-[10px] uppercase font-semibold text-gray-400 mb-1 block">Link</label>
              <input type="text" value={card.link} onChange={e => updateCard(card.id, 'link', e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1 text-sm bg-white" placeholder="/shop" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HamburgerMenuManager({ state, setState }: any) {
  const updateHamburgerSelections = (field: 'hamburgerProducts' | 'hamburgerCollections', selectedIds: string[]) => {
    setState((s: any) => ({
      ...s,
      [field]: selectedIds
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-1">Hamburger Menu Configuration</h3>
        <p className="text-sm text-gray-500 mb-6">Select which products and categories should appear directly under the hamburger menu options.</p>
      </div>

      <div className="space-y-8">
        <div className="p-6 border border-gray-200 rounded-md bg-gray-50">
          <h4 className="font-semibold text-gray-800 mb-2">Products in Hamburger Menu</h4>
          <p className="text-xs text-gray-500 mb-4">Select the specific products you want to show in the &quot;Products&quot; dropdown in the hamburger menu.</p>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Select Products (Ctrl/Cmd+Click to multi-select)</label>
          <select 
            multiple 
            value={state.hamburgerProducts || []} 
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
              updateHamburgerSelections('hamburgerProducts', selected);
            }} 
            className="w-full md:w-2/3 border border-gray-300 rounded px-3 py-2 text-sm bg-white min-h-[160px]"
          >
            {(state.products || []).map((p: any) => (
              <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
            ))}
          </select>
        </div>

        <div className="p-6 border border-gray-200 rounded-md bg-gray-50">
          <h4 className="font-semibold text-gray-800 mb-2">Collections in Hamburger Menu</h4>
          <p className="text-xs text-gray-500 mb-4">Select the categories you want to show in the &quot;Collections&quot; dropdown in the hamburger menu.</p>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Select Collections (Ctrl/Cmd+Click to multi-select)</label>
          <select 
            multiple 
            value={state.hamburgerCollections || []} 
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
              updateHamburgerSelections('hamburgerCollections', selected);
            }} 
            className="w-full md:w-2/3 border border-gray-300 rounded px-3 py-2 text-sm bg-white min-h-[160px]"
          >
            {(state.collections || []).map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function CatalogManager({ state, setState }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Catalog System Toggle</h3>
        <p className="text-sm text-gray-500 mb-6">Switch between pure manual mode or hybrid mode (integrating with Olsera POS via API in the future).</p>
      </div>

      <div className="p-6 border border-gray-200 rounded flex justify-between items-center bg-gray-50">
        <div>
           <h4 className="font-semibold text-gray-800">Show Olsera Products</h4>
           <p className="text-xs text-gray-500">If enabled, the frontend will mix API products with manual ones.</p>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={state.showOlsera}
            onChange={(e) => setState((s: any) => ({ ...s, showOlsera: e.target.checked }))}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-100 text-blue-800 text-sm rounded">
         <p><strong>Note:</strong> Olsera integration is mocked for this prototype. Activating this toggle simulates the hybrid environment.</p>
      </div>
    </div>
  );
}
function OrderManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders/admin');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/orders/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-serif mb-6">Order Management</h2>
      {loading ? (
        <p className="text-sm text-gray-500">Memuat pesanan...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada pesanan.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-200 p-4 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-sm">{order.id}</h3>
                  <p className="text-xs text-gray-500">{order.user_email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-primary">Rp {Number(order.total).toLocaleString('id-ID')}</p>
                  <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                </div>
              </div>
              <div className="mb-4">
                {(() => {
    try {
      const parsed = JSON.parse(order.items);
      return (
        <div>
          <p className="text-sm font-medium">{parsed.summary || order.items}</p>
          {parsed.list && parsed.list.length > 0 && (
             <ul className="text-xs text-gray-500 mt-2 space-y-1">
               {parsed.list.map((item: any, i: number) => (
                  <li key={i}>• {item.name} x {item.quantity} {item.isKain ? 'Meter' : 'Pcs'}</li>
               ))}
             </ul>
          )}
        </div>
      );
    } catch {
      let fallbackStr = 'Detail produk';
      if (typeof order.items === 'string') {
        const match = order.items.match(/"summary"\s*:\s*"([^"]+)"/);
        if (match) {
          fallbackStr = match[1];
        } else {
          fallbackStr = order.items.length > 50 ? order.items.substring(0, 50) + '...' : order.items;
        }
      }
      return <p className="text-sm">{fallbackStr}</p>;
    }
  })()}
              </div>
              <div className="flex items-center gap-4">
                
                <div className="flex flex-wrap items-center gap-2 w-full mt-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 mr-4 min-w-[120px]">
                    Status: {(() => {
                              switch (order.status) {
                                case 'Pending': return <span className="inline-block bg-yellow-100 text-yellow-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold ml-2">Belum Bayar</span>;
                                case 'Paid': return <span className="inline-block bg-blue-100 text-blue-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold ml-2">Menunggu Pengiriman</span>;
                                case 'Processing': return <span className="inline-block bg-indigo-100 text-indigo-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold ml-2">Diproses</span>;
                                case 'Shipped': return <span className="inline-block bg-purple-100 text-purple-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold ml-2">Dikirim</span>;
                                case 'Delivered': return <span className="inline-block bg-green-100 text-green-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold ml-2">Selesai</span>;
                                case 'Cancelled': return <span className="inline-block bg-red-100 text-red-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold ml-2">Dibatalkan</span>;
                                default: return <span className="inline-block bg-gray-100 text-gray-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold ml-2">{order.status}</span>;
                              }
                            })()}
                  </span>
                  
                  {order.status !== 'Shipped' && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Shipped')}
                      className="px-3 py-1.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Kirim Pesanan
                    </button>
                  )}
                  {order.status === 'Shipped' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Delivered')}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-green-700 transition-colors"
                    >
                      Selesaikan
                    </button>
                  )}
                  {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Cancelled')}
                      className="px-3 py-1.5 border border-red-200 text-red-600 text-xs uppercase tracking-widest font-semibold hover:bg-red-50 transition-colors"
                    >
                      Batalkan
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
