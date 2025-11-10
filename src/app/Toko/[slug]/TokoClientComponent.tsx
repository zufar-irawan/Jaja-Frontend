'use client';

import React, { useState } from 'react';
import { MessageCircle, Share2 } from 'lucide-react';

export default function TokoClientComponent() {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
    }

    const handleChat = () => {
        console.log('Open Chat')
    };

    const handleShare = () => {
        if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link berhasil disalin');
        }
    };
    return (
    <div className="flex flex-col gap-3 lg:w-48">
      <button 
        onClick={handleFollow}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
          isFollowing 
            ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30' 
            : 'bg-white text-[#55B4E5] hover:shadow-xl shadow-lg'
        }`}
      >
        {isFollowing ? '✓ Mengikuti' : '+ Ikuti Toko'}
      </button>
      
      <button 
        onClick={handleChat}
        className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl font-semibold text-white hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-5 h-5" />
        Chat
      </button>

      <button 
        onClick={handleShare}
        className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl font-semibold text-white hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
}