import React from 'react';

interface ProductImagesProps {
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  discount: number;
}

export default function ProductImages({ images, selectedImage, setSelectedImage, discount }: ProductImagesProps) {
  return (
    <div style={{ width: '100%', height: '484px' }}> {/* Height sama dengan ProductInfo */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.04)',
        position: 'relative',
        height: '380px' // Sesuaikan agar total height = 484px
      }}>
        {discount > 0 && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '700',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(238, 90, 111, 0.3)'
          }}>
            {discount}% OFF
          </div>
        )}
        <img 
          src={images[selectedImage]} 
          alt="Lenovo Slim 5"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            borderRadius: '12px'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {images.map((img, idx) => (
          <div 
            key={idx}
            onClick={() => setSelectedImage(idx)}
            style={{ 
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '6px',
              cursor: 'pointer',
              border: selectedImage === idx ? '2px solid #55B4E5' : '2px solid transparent',
              boxShadow: selectedImage === idx ? '0 4px 12px rgba(85, 180, 229, 0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
              flex: 1,
              transition: 'all 0.2s ease'
            }}
          >
            <img 
              src={img} 
              alt={`Preview ${idx + 1}`}
              style={{ 
                width: '100%', 
                height: '70px', 
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}