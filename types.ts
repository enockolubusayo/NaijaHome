
export enum UserRole {
  TENANT = 'TENANT',
  LANDLORD = 'LANDLORD',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  verified?: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  type: 'House' | 'Flat' | 'Shop' | 'Land';
  images: string[];
  amenities: string[];
  ownerId: string;
  agentId?: string;
  status: 'Available' | 'Rented' | 'Pending';
  coordinates?: { lat: number; lng: number };
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'Rent' | 'Inspection' | 'Commission';
  date: string;
  status: 'Success' | 'Pending' | 'Failed';
  payerId: string;
  receiverId: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}
