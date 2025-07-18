import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { getGallery } from '../lib/gallery-local';
import { addWebSocketListener } from '../lib/websocket';

const GalleryWithWebSocket = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
    
    // Listen for WebSocket events
    const removeListener = addWebSocketListener((data) => {
      if (data.type === 'GALLERY_CREATED' || data.type === 'gallery_CREATED' || 
          data.type === 'GALLERY_DELETED' || data.type === 'gallery_DELETED' ||
          data.type === 'GALLERY_UPDATED' || data.type === 'gallery_UPDATED') {
        console.log('Received gallery update via WebSocket:', data);
        fetchGallery();
      }
    });
    
    return () => removeListener();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await getGallery();
      const apiImages = (response.data || []).map((item: any) => ({
        src: item.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        title: item.title || 'Gallery Image',
        description: item.description || 'Rotary club activity'
      }));
      
      if (apiImages.length > 0) {
        // If we have images from the API, use only those
        setGalleryImages(apiImages);
      } else {
        // Fallback to static images if no API images
        setGalleryImages(staticGalleryImages);
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      setGalleryImages(staticGalleryImages);
    } finally {
      setLoading(false);
    }
  };

  const staticGalleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'Community Volunteering',
      description: 'Members volunteering at local community center'
    },
    {
      src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'Blood Donation Drive',
      description: 'Annual blood donation camp 2024'
    },
    {
      src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'Charity Gala Evening',
      description: 'Annual fundraising gala event'
    },
    {
      src: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'School Visit Program',
      description: 'Educational support program in rural schools'
    },
    {
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'Tree Plantation Drive',
      description: 'Environmental conservation initiative'
    },
    {
      src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'Free Medical Camp',
      description: 'Healthcare services in rural areas'
    }
  ];

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

export default GalleryWithWebSocket;