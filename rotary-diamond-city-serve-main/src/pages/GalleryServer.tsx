import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { getGallery } from '../lib/api-gallery';

const GalleryServer = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
    
    // Connect to WebSocket with reconnection
    let ws: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    
    const connectWebSocket = () => {
      try {
        ws = new WebSocket('ws://localhost:3031');
        
        ws.onopen = () => {
          // Connection established
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'GALLERY_CREATED' || data.type === 'GALLERY_UPDATED' || data.type === 'GALLERY_DELETED') {
              fetchGallery();
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        ws.onerror = () => {}; // Ignore errors, handled by onclose
        
        ws.onclose = () => {
          // Reconnect after 2 seconds
          if (reconnectTimer) window.clearTimeout(reconnectTimer);
          reconnectTimer = window.setTimeout(connectWebSocket, 2000);
        };
      } catch (error) {
        // If connection fails, try again after 2 seconds
        if (reconnectTimer) window.clearTimeout(reconnectTimer);
        reconnectTimer = window.setTimeout(connectWebSocket, 2000);
      }
    };
    
    // Initial connection
    connectWebSocket();
    
    return () => {
      if (ws) ws.close();
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
    };
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await getGallery();
      const apiImages = (response.data || []).map((item: any) => ({
        src: item.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        title: item.title || 'Gallery Image',
        description: item.description || 'Rotary club activity'
      }));
      
      setGalleryImages(apiImages);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      setGalleryImages([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (src: string) => {
    const index = galleryImages.findIndex(img => img.src === src);
    setCurrentImageIndex(index);
    setSelectedImage(src);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % galleryImages.length
      : (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex].src);
  };

  const currentImage = galleryImages[currentImageIndex];

  return (
    <div>
      <Hero 
        title="Gallery"
        subtitle="Capturing Moments • Celebrating Service • Preserving Memories"
        backgroundImage="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
      />

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map((image, index) => (
                <div 
                  key={index}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                  onClick={() => openModal(image.src)}
                >
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                      <p className="text-sm text-gray-200">{image.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && galleryImages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No gallery images found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal for Image Preview with Navigation */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage} 
              alt={currentImage?.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Navigation Controls */}
            <button 
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 transition-colors"
            >
              ←
            </button>
            <button 
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 transition-colors"
            >
              →
            </button>
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-colors"
            >
              ✕
            </button>
            
            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white bg-black bg-opacity-50 rounded-lg p-4">
              <h3 className="font-bold text-lg">{currentImage?.title}</h3>
              <p className="text-sm">{currentImage?.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryServer;