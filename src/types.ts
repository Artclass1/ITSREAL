import { Timestamp } from 'firebase/firestore';

export interface Property {
  id: string; // Document ID
  title: string;
  description: string;
  price: number;
  listingType: 'buy' | 'sell'; 
  propertyType: string;
  location: string;
  imageUrl: string;
  features: string[];
  createdAt: Timestamp; // Using firestore timestamp
  ownerId: string;
}
