import React, { useState } from 'react';
import { insforge } from '../lib/insforge';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { motion } from 'motion/react';

export default function CreateListing({ user }: { user: any | null }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    listingType: 'buy', // buy or sell (means the lister is selling, or wanting to buy) actually listingType should be 'sell' for things they are selling, and 'buy' if they want. Let's assume standard 'sell' for offering, 'buy' for looking
    propertyType: 'apartment',
    location: '',
    imageUrl: '',
    features: ''
  });

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-display font-medium">Authentication Required</h2>
        <p className="text-zinc-500">You must be signed in to create a listing. Click "Sign in" or "Guest" above.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newProperty = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        listingType: formData.listingType,
        propertyType: formData.propertyType,
        location: formData.location,
        imageUrl: formData.imageUrl || 'default',
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        createdAt: new Date().toISOString(),
        ownerId: user.id
      };

      const { error: insertError } = await insforge.database
        .from('properties')
        .insert(newProperty);
        
      if (insertError) throw insertError;
      
      navigate('/');
    } catch (err: any) {
      setLoading(false);
      setError('Failed to create listing: ' + (err.message || 'Ensure all required fields are filled and valid.'));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-16 border-b border-neutral-900 pb-8">
        <h1 className="text-4xl font-light tracking-tight mb-2">Create Listing</h1>
        <p className="text-neutral-500 font-serif italic text-lg">Publish your exclusive property securely.</p>
      </div>

      {error && (
        <div className="p-4 mb-8 bg-red-950/20 border border-red-900/50 text-red-400 text-sm font-light">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div className="space-y-3 md:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block">Title</label>
            <Input name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Modern Minimalist Apartment" maxLength={150} />
          </div>

          <div className="space-y-3 md:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block">Description</label>
            <Textarea name="description" required value={formData.description} onChange={handleChange} placeholder="Describe the property..." className="min-h-[160px] border-b border-neutral-800 bg-transparent text-white focus-visible:border-white font-light text-sm p-3 block w-full resize-y placeholder:text-neutral-600 focus:outline-none" maxLength={5000} />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block">Price (USD)</label>
            <Input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} placeholder="e.g. 500000" />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block">Location</label>
            <Input name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. New York, NY" maxLength={200} />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block">Listing Context</label>
            <select 
              name="listingType" 
              value={formData.listingType} 
              onChange={handleChange}
              className="flex h-12 w-full rounded-none border-b border-neutral-800 bg-transparent px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:border-white transition-colors appearance-none font-light"
            >
              <option value="sell" className="bg-neutral-900 text-white">For Sale</option>
              <option value="buy" className="bg-neutral-900 text-white">Wanted</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block">Property Category</label>
            <select 
              name="propertyType" 
              value={formData.propertyType} 
              onChange={handleChange}
              className="flex h-12 w-full rounded-none border-b border-neutral-800 bg-transparent px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:border-white transition-colors appearance-none font-light"
            >
              <option value="apartment" className="bg-neutral-900 text-white">Apartment</option>
              <option value="house" className="bg-neutral-900 text-white">House</option>
              <option value="land" className="bg-neutral-900 text-white">Land</option>
              <option value="commercial" className="bg-neutral-900 text-white">Commercial</option>
            </select>
          </div>

          <div className="space-y-3 md:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block">Image URL <span className="font-normal lowercase tracking-normal">(Optional)</span></label>
            <Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" maxLength={1000} />
          </div>

          <div className="space-y-3 md:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block">Features <span className="font-normal lowercase tracking-normal">(Optional)</span></label>
            <Input name="features" value={formData.features} onChange={handleChange} placeholder="Comma separated (e.g. Pool, Gym, Balcony)" />
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <Button type="submit" size="lg" className="w-full md:w-auto" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Listing'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
