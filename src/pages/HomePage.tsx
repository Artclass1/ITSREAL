import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Property } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    
    getDocs(q)
      .then((snapshot) => {
        const propsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        setProperties(propsData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        handleFirestoreError(err, OperationType.LIST, 'properties');
      });
  }, []);

  if (loading) {
    return <div className="text-neutral-500 animate-pulse text-[11px] uppercase tracking-widest font-bold">Loading...</div>;
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-neutral-800 p-12">
        <h2 className="text-2xl font-light tracking-tight mb-4">No properties listed yet.</h2>
        <p className="text-neutral-500 font-serif italic text-lg mb-8 max-w-md">Be the first to list an exclusive property.</p>
        <Link to="/list" className="px-8 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">
          Apply Now
        </Link>
      </div>
    );
  }

  const featured = properties[0];
  const restProperties = properties.slice(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
      <section className="col-span-1 md:col-span-7 flex flex-col">
        <Link to={`/property/${featured.id}`} className="group block focus:outline-none">
          <div className="w-full aspect-[4/3] bg-neutral-900 border border-neutral-800 relative mb-8 flex items-center justify-center overflow-hidden">
            <div className="absolute top-6 left-6 bg-white text-black px-3 py-1 text-[10px] font-bold uppercase tracking-tighter z-10">
              Featured - {featured.listingType === 'buy' ? 'Wanted' : 'Sale'}
            </div>
            {featured.imageUrl && featured.imageUrl !== 'default' ? (
              <img 
                src={featured.imageUrl} 
                alt={featured.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <div className="w-24 h-[1px] bg-neutral-700 transition-transform duration-700 group-hover:scale-y-150 group-hover:bg-neutral-500"></div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-light tracking-tight group-hover:text-neutral-300 transition-colors">{featured.title}</h1>
              <p className="text-neutral-500 font-serif italic text-lg">{featured.location}</p>
            </div>
            <div className="sm:text-right shrink-0">
              <div className="text-3xl font-light tracking-tighter">${featured.price.toLocaleString()}</div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/property/${featured.id}`);
                }}
                className="mt-4 px-8 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors w-full sm:w-auto"
              >
                Apply Now
              </button>
            </div>
          </div>
        </Link>
      </section>

      <section className="col-span-1 md:col-span-5 flex flex-col md:border-l border-neutral-900 md:pl-16 mt-12 md:mt-0">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-600 mb-10">Latest Listings</h2>
        <div className="space-y-12">
          {restProperties.map((property, idx) => (
            <motion.div 
              key={property.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <Link to={`/property/${property.id}`} className="group block focus:outline-none">
                <div className="flex justify-between items-end pb-4 border-b border-neutral-800 group-hover:border-neutral-500 transition-colors">
                  <div className="space-y-1 overflow-hidden pr-4">
                    <div className="text-lg font-light truncate group-hover:text-neutral-300 transition-colors">{property.title}</div>
                    <div className="text-[11px] uppercase tracking-widest text-neutral-500 truncate">{property.location}</div>
                  </div>
                  <div className="text-lg font-light tracking-tight shrink-0">${(property.price >= 1000 ? (property.price / 1000).toFixed(0) + 'k' : property.price)}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 md:mt-auto pb-4">
          <Link to="/list" className="p-8 border border-dashed border-neutral-800 flex flex-col items-center justify-center text-center group hover:bg-neutral-900/30 transition-colors">
            <div className="text-[11px] uppercase tracking-widest text-neutral-500 mb-4 group-hover:text-neutral-400 mt-2">Have a property?</div>
            <div className="text-[11px] font-bold border-b border-neutral-400 pb-1 group-hover:border-white uppercase tracking-widest transition-colors mb-2">List with us</div>
          </Link>
        </div>
      </section>
    </div>
  );
}
