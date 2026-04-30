'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { ImageInput, HeroSlide, Collection, Product } from '@/lib/types';
import Image from 'next/image';
import { Settings, Image as ImageIcon, Layout, Box, FolderPlus, ToggleLeft, Trash2, Plus, GripVertical, LogOut, Save, RotateCcw } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const handleImageUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

type Tab = 'logo' | 'hero' | 'featuredSections' | 'megaMenu' | 'profile' | 'collections' | 'products' | 'catalog';

export default function AdminDashboard() {
  const { state, savedState, setState, saveToDb, discardChanges } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('logo');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = JSON.stringify(state) !== JSON.stringify(savedState);

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'azkarmsd@gmail.com') {
        setIsAuthenticated(true);
      } else {
        if (user) signOut(auth);
        setIsAuthenticated(false);
      }
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out', err);
    }
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

  if (isAuthChecking) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Checking admin status...</p></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm">
          <h1 className="font-serif text-2xl text-center mb-2">Admin Access</h1>
          <p className="text-xs text-gray-500 text-center mb-6 uppercase tracking-widest">Restricted Area</p>
          
          <div className="space-y-4">
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button 
              onClick={handleLogin}
              className="w-full bg-black text-white py-3 text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Sign In with Google
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">Only authorized administrators may log in.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-serif text-xl">Admin Panel</h2>
          <p className="text-xs text-gray-500 mt-1">Kain Sutra Sengkang</p>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <TabButton active={activeTab === 'logo'} onClick={() => setActiveTab('logo')} icon={<ImageIcon size={18} />} label="Logo Manager" />
          <TabButton active={activeTab === 'hero'} onClick={() => setActiveTab('hero')} icon={<Layout size={18} />} label="Homepage Slides" />
          <TabButton active={activeTab === 'featuredSections'} onClick={() => setActiveTab('featuredSections')} icon={<Layout size={18} />} label="Featured Sections" />
          <TabButton active={activeTab === 'megaMenu'} onClick={() => setActiveTab('megaMenu')} icon={<Layout size={18} />} label="Mega Menu Cards" />
          <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<ImageIcon size={18} />} label="Profile Slides" />
          <TabButton active={activeTab === 'collections'} onClick={() => setActiveTab('collections')} icon={<FolderPlus size={18} />} label="Collections/Category" />
          <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Box size={18} />} label="Products" />
          <TabButton active={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} icon={<ToggleLeft size={18} />} label="Catalog Control" />
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-2">
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
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {activeTab === 'logo' && <LogoManager state={state} setState={setState} />}
          {activeTab === 'hero' && <HeroManager state={state} setState={setState} />}
          {activeTab === 'featuredSections' && <FeaturedSectionManager state={state} setState={setState} />}
          {activeTab === 'megaMenu' && <MegaMenuManager state={state} setState={setState} />}
          {activeTab === 'profile' && <ProfileSlideManager state={state} setState={setState} />}
          {activeTab === 'collections' && <CollectionManager state={state} setState={setState} />}
          {activeTab === 'products' && <ProductManager state={state} setState={setState} />}
          {activeTab === 'catalog' && <CatalogManager state={state} setState={setState} />}
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
         {state.heroSlides.map((slide: HeroSlide, index: number) => (
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

function ProfileSlideManager({ state, setState }: any) {
  const slides = state.profileSlides || [];

  const addSlide = () => {
    setState((s: any) => ({ ...s, profileSlides: [...slides, { type: 'url', data: 'https://picsum.photos/seed/brandprofile/800/1000' }] }));
  };

  const updateSlideImage = async (index: number, type: 'url' | 'base64', data: string | File) => {
    let imageData = data as string;
    if (type === 'base64') {
      imageData = await handleImageUpload(data as File);
    }
    const newSlides = [...slides];
    newSlides[index] = { type, data: imageData };
    setState((s: any) => ({ ...s, profileSlides: newSlides }));
  };

  const deleteSlide = (index: number) => {
    setState((s: any) => ({ ...s, profileSlides: slides.filter((_: any, i: number) => i !== index) }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
         <div>
           <h3 className="text-lg font-semibold">Profile Slides</h3>
           <p className="text-sm text-gray-500">Manage the automated slideshow for the Brand Profile section.</p>
           <p className="text-xs text-primary font-medium mt-1">Recommended ratio: 4:5 portrait (e.g., 800x1000px).</p>
         </div>
         <button onClick={addSlide} className="flex items-center gap-2 bg-primary text-secondary px-4 py-2 rounded-md font-medium text-sm hover:brightness-105">
           <Plus size={16} /> Add Slide
         </button>
      </div>

      <div className="space-y-6">
        {slides.map((slide: ImageInput, index: number) => (
          <div key={index} className="border border-gray-200 rounded-md p-6 relative bg-gray-50 flex flex-col md:flex-row gap-6 items-start">
            <button onClick={() => deleteSlide(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors">
              <Trash2 size={18} />
            </button>
            
            <div className="flex-1 w-full space-y-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Slide Image {index + 1}</label>
              <div className="flex gap-4">
                <div className="relative">
                  <input type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) updateSlideImage(index, 'base64', e.target.files[0]) }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">Upload File</button>
                </div>
                <div className="flex-1 flex gap-2">
                  <input type="text" placeholder="Or enter image URL..." onBlur={e => e.target.value && updateSlideImage(index, 'url', e.target.value)} className="flex-1 border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-black" />
                </div>
              </div>
            </div>

            <div className="w-full md:w-32 aspect-[4/5] bg-gray-200 rounded overflow-hidden border border-gray-300 mt-4 md:mt-0 flex-shrink-0">
               <img src={slide.data} className="w-full h-full object-cover" alt={`Slide preview ${index + 1}`} />
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
         {state.collections.map((col: Collection) => (
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

   return (
     <div className="space-y-8">
       <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Products</h3>
            <p className="text-xs text-gray-500">Manage manual products.</p>
            <p className="text-xs text-primary font-medium mt-1">Recommended ratio: 4:5 or 3:4 portrait (e.g., 800x1000px).</p>
          </div>
          <button onClick={addProd} className="bg-primary text-secondary px-4 py-2 rounded font-medium text-sm">Add Product</button>
       </div>
       <div className="space-y-4">
         {state.products.map((prod: Product) => (
           <div key={prod.id} className="flex flex-col md:flex-row border border-gray-200 rounded p-4 relative gap-6">
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
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Category</label>
                    <select value={prod.category} onChange={e => updateProd(prod.id, 'category', e.target.value)} className="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-primary bg-white">
                      <option value="">-- Select Category --</option>
                      {state.collections?.map((col: any) => (
                        <option key={col.id} value={col.name}>{col.name}</option>
                      ))}
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
                        {prod.images.map((img, idx) => (
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
                    {state.products.map((p: any) => (
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
