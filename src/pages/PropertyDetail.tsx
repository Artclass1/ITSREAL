import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import { Property } from '../types';
import { MapPin, Tag, Box, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => setUserId(data?.user?.id || null));
  }, []);

  useEffect(() => {
    if (!id) return;
    insforge.database
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (data) {
          setProperty(data as Property);
        } else if (error) {
           console.error(error);
        }
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!id || !property) return;
    const confirmation = window.confirm('Are you sure you want to delete this listing?');
    if (!confirmation) return;

    setDeleting(true);
    try {
      const { error } = await insforge.database
        .from('properties')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      navigate('/');
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  if (loading) return <div className="text-neutral-500 animate-pulse text-[11px] font-bold uppercase tracking-widest text-center mt-20">Loading...</div>;
  if (!property) return <div className="text-neutral-500 text-center mt-20 text-[11px] uppercase tracking-widest">Property not found.</div>;

  const isOwner = userId === property.ownerId;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-16"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-6 border-b border-neutral-900">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>
          <div className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-4">{property.listingType === 'buy' ? 'Wanted to Buy in' : 'Listed in'} {property.location}</div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight">{property.title}</h1>
          <p className="text-neutral-500 font-serif italic text-lg mt-2">{property.location}</p>
        </div>
        
        <div className="sm:text-right shrink-0">
          <div className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-4 text-left sm:text-right">Price Value</div>
          <div className="text-3xl font-light tracking-tighter">${property.price.toLocaleString()}</div>
        </div>
      </div>

      <div className="aspect-[21/9] w-full bg-neutral-900 border border-neutral-800 overflow-hidden relative">
        {property.imageUrl && property.imageUrl !== 'default' ? (
          <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-[1px] bg-neutral-700"></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8 space-y-12">
          <section className="space-y-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-600">The Details</h2>
            <p className="text-neutral-300 font-light leading-relaxed whitespace-pre-wrap">{property.description}</p>
          </section>

          {property.features && property.features.length > 0 && typeof property.features[0] === 'string' && (
            <section className="space-y-6">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-600">Key Features</h2>
              <ul className="grid grid-cols-2 gap-y-4 gap-x-8 text-neutral-400 font-light text-sm">
                {property.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 border-b border-neutral-900 pb-2">
                    <div className="w-1.5 h-1.5 bg-white shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="md:col-span-4 space-y-12">
          <div className="p-8 border border-neutral-800 bg-neutral-900/10 space-y-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest">Inquire Now</h3>
            <p className="text-sm font-light text-neutral-400 leading-relaxed">Schedule a private viewing or make an official offer.</p>
            <Button className="w-full">Apply Now</Button>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-600">Overview</h3>
            <ul className="space-y-4 font-light text-sm">
              <li className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-neutral-500">Type</span>
                <span className="capitalize text-white">{property.propertyType}</span>
              </li>
              <li className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-neutral-500">Status</span>
                <span className="capitalize text-white">{property.listingType}</span>
              </li>
              <li className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-neutral-500">Reference ID</span>
                <span className="text-white uppercase font-mono tracking-tighter">{property.id.slice(0, 8)}</span>
              </li>
            </ul>
          </div>

          {isOwner && (
            <div className="pt-8 border-t border-neutral-900 space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-600">Administration</h3>
              <Button 
                variant="outline" 
                className="w-full flex justify-center items-center gap-3 border-red-900/50 text-red-500 hover:bg-neutral-900"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? 'Deleting...' : 'Delist Property'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
