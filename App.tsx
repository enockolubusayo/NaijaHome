
import React, { useState, useEffect } from 'react';
import { User, UserRole, Property } from './types';
import PropertyCard from './components/PropertyCard';
import ImageGallery from './components/ImageGallery';
import { getPropertyAIInsights } from './services/geminiService';

// Enhanced Mock Data with more images for gallery demonstration
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern 3 Bedroom Flat',
    description: 'Beautiful apartment in the heart of Lekki Phase 1 with 24/7 power, industrial grade security, and premium finishing. This home features high ceilings, floor-to-ceiling windows, and a gourmet kitchen equipped with high-end appliances.',
    price: 3500000,
    currency: 'NGN',
    location: 'Lekki, Lagos',
    type: 'Flat',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Gym', 'Pool', 'Security'],
    ownerId: 'landlord_1',
    status: 'Available'
  },
  {
    id: '2',
    title: 'Prime Commercial Shop',
    description: 'High traffic area in Wuse 2 market, perfect for retail or office space. Comes with a storage room and a dedicated washroom.',
    price: 1200000,
    currency: 'NGN',
    location: 'Wuse II, Abuja',
    type: 'Shop',
    images: [
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Parking', 'AC'],
    ownerId: 'landlord_2',
    status: 'Available'
  },
  {
    id: '3',
    title: 'Luxury 5 Bedroom Duplex',
    description: 'Fully detached house with BQ in GRA Phase 2. This property boasts massive rooms, a private study, and a lush green backyard for family gatherings.',
    price: 8000000,
    currency: 'NGN',
    location: 'Port Harcourt, Rivers',
    type: 'House',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687940-47a000df3cc9?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['CCTV', 'Garden'],
    ownerId: 'landlord_1',
    status: 'Available'
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'onboarding' | 'dashboard' | 'listings' | 'details'>('landing');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (role: UserRole) => {
    setUser({
      id: 'user_123',
      name: 'Olawale Adeyemi',
      email: 'ola@example.com',
      role: role,
      verified: true
    });
    setView('dashboard');
  };

  const analyzeProperty = async (prop: Property) => {
    setLoading(true);
    try {
      const insight = await getPropertyAIInsights(`${prop.title} in ${prop.location}. Price: ${prop.price} NGN`);
      setAiAnalysis(insight);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProperty) {
      analyzeProperty(selectedProperty);
    }
  }, [selectedProperty]);

  const renderLanding = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white px-6">
      <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center">NaijaHome</h1>
      <p className="text-xl md:text-2xl mb-12 text-center max-w-2xl opacity-90">
        The smartest way to rent, sell, and manage properties in Nigeria. 
        Powered by AI, built for you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <RoleButton 
          title="I'm a Tenant" 
          desc="Find your dream home" 
          icon="🏠" 
          onClick={() => handleLogin(UserRole.TENANT)} 
        />
        <RoleButton 
          title="I'm a Landlord" 
          desc="Manage your property" 
          icon="🔑" 
          onClick={() => handleLogin(UserRole.LANDLORD)} 
        />
        <RoleButton 
          title="I'm an Agent" 
          desc="List and earn commission" 
          icon="💼" 
          onClick={() => handleLogin(UserRole.AGENT)} 
        />
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h2 className="text-xl font-bold text-indigo-600">NaijaHome</h2>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-sm text-slate-600">Welcome, {user?.name}</span>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
              {user?.name[0]}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {user?.role === UserRole.TENANT ? 'Find your next home' : 'Dashboard'}
            </h1>
            <p className="text-slate-500">Explore premium listings across Nigeria</p>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Search location..." 
              className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PROPERTIES.map(p => (
            <PropertyCard 
              key={p.id} 
              property={p} 
              onClick={(id) => {
                const found = MOCK_PROPERTIES.find(x => x.id === id);
                if(found) {
                  setSelectedProperty(found);
                  setView('details');
                }
              }} 
            />
          ))}
        </div>
      </main>
    </div>
  );

  const renderDetails = () => (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button 
          onClick={() => {
            setView('dashboard');
            setAiAnalysis(null);
          }}
          className="mb-6 text-indigo-600 font-medium flex items-center hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Replaced static image grid with new Responsive ImageGallery */}
          <div className="order-1 lg:order-1">
            <ImageGallery images={selectedProperty?.images || []} />
          </div>

          <div className="space-y-8 order-2 lg:order-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedProperty?.type}
                </span>
                <span className="text-emerald-500 font-semibold">● {selectedProperty?.status}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">{selectedProperty?.title}</h1>
              <p className="text-slate-500 mt-2 text-lg">📍 {selectedProperty?.location}</p>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-indigo-600">₦{selectedProperty?.price.toLocaleString()}</span>
              <span className="text-slate-400">/year</span>
            </div>

            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden transition-all duration-500">
              <div className="absolute top-0 right-0 p-2 bg-indigo-200 text-indigo-700 text-[10px] font-bold rounded-bl-xl">AI INSIGHTS</div>
              <h4 className="font-bold text-indigo-900 mb-3 flex items-center">
                ✨ Gemini Analysis
              </h4>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                  <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-3 text-sm text-indigo-800 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p><strong>Market Value:</strong> {aiAnalysis.suggestedPriceRange}</p>
                  <p><strong>Fraud Risk:</strong> 
                    <span className={`ml-2 px-2 py-0.5 rounded font-bold ${aiAnalysis.fraudRiskScore < 30 ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'}`}>
                      {aiAnalysis.fraudRiskScore}/100
                    </span>
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {aiAnalysis.tips.map((tip: string, idx: number) => (
                      <li key={idx} className="opacity-90">{tip}</li>
                    ))}
                  </ul>
                </div>
              ) : <p className="text-xs text-indigo-600">Generating property insights...</p>}
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-xl font-bold border-b border-slate-100 pb-2">About this property</h3>
              <p className="text-slate-600 leading-relaxed text-lg">{selectedProperty?.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 sticky bottom-4 bg-white/80 backdrop-blur py-4 z-10 border-t border-slate-50">
              <button className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
                Contact Owner
              </button>
              <button className="flex-1 border-2 border-indigo-600 text-indigo-600 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all active:scale-95">
                Book Inspection (₦5,000)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="antialiased">
      {view === 'landing' && renderLanding()}
      {view === 'dashboard' && renderDashboard()}
      {view === 'details' && renderDetails()}
    </div>
  );
};

// Helper Components
const RoleButton = ({ title, desc, icon, onClick }: { title: string, desc: string, icon: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md p-8 rounded-3xl transition-all group text-left flex flex-col items-start active:scale-95"
  >
    <span className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{icon}</span>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm opacity-70">{desc}</p>
  </button>
);

export default App;
