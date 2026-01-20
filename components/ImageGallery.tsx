
import React, { useState, useRef, useEffect } from 'react';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const galleryImages = images.length > 0 ? images : ['https://picsum.photos/seed/house/800/600'];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const startAR = async () => {
    setIsARActive(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Camera access denied. Please enable permissions to use AR view.");
    }
  };

  const stopAR = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsARActive(false);
  };

  useEffect(() => {
    return () => {
      if (isARActive) stopAR();
    };
  }, [isARActive]);

  return (
    <div className="space-y-4">
      {/* Main Feature Image / AR View Area */}
      <div 
        className="relative h-96 w-full rounded-3xl overflow-hidden shadow-lg bg-slate-100 group"
      >
        {!isARActive ? (
          <>
            <img 
              src={galleryImages[activeImage]} 
              alt="Property view"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />
            
            {/* AR Trigger Button */}
            <button 
              onClick={startAR}
              className="absolute top-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg hover:bg-indigo-700 transition-colors z-10"
            >
              <span className="mr-2">🕶️</span> View in AR
            </button>

            {/* Navigation Overlays */}
            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <button 
                onClick={prevImage}
                className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md hover:bg-white transition-colors text-slate-900 pointer-events-auto"
              >
                ←
              </button>
              <button 
                onClick={nextImage}
                className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md hover:bg-white transition-colors text-slate-900 pointer-events-auto"
              >
                →
              </button>
            </div>
          </>
        ) : (
          <div className="relative w-full h-full bg-black">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover opacity-60"
            />
            {/* Simulated 3D Asset Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <img 
                 src={galleryImages[activeImage]} 
                 className="w-64 h-64 object-contain drop-shadow-2xl transform rotate-12 animate-pulse"
                 alt="AR Preview"
               />
            </div>
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md">
                AR Preview Mode
              </span>
              <button 
                onClick={stopAR}
                className="bg-white/90 text-slate-900 px-4 py-1 rounded-full text-sm font-bold shadow-md"
              >
                Exit AR
              </button>
            </div>
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-slate-900/80 text-white">
                <p>{cameraError}</p>
              </div>
            )}
          </div>
        )}

        {!isARActive && (
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
            {activeImage + 1} / {galleryImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {galleryImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveImage(idx);
              if (isARActive) stopAR();
            }}
            className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all ${
              activeImage === idx ? 'border-indigo-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Full Screen Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-10 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white text-4xl font-light hover:text-slate-300 transition-colors"
            onClick={() => setIsLightboxOpen(false)}
          >
            &times;
          </button>

          <div className="relative w-full max-w-5xl h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={prevImage}
              className="absolute left-0 z-10 p-4 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <span className="text-4xl">‹</span>
            </button>
            
            <img 
              src={galleryImages[activeImage]} 
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg select-none"
            />

            <button 
              onClick={nextImage}
              className="absolute right-0 z-10 p-4 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <span className="text-4xl">›</span>
            </button>
          </div>
          
          <div className="mt-6 text-white font-medium">
            {activeImage + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
