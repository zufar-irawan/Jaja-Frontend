'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableDescriptionProps {
  text: string;
  maxLength?: number;
}

export default function ExpandableDescription({ 
  text, 
  maxLength = 200
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate 
    ? text 
    : text.slice(0, maxLength) + '...';
  
  return (
    <div className="mb-4 max-w-2xl">
      <p className="text-white/80 text-sm mb-2 whitespace-pre-line leading-relaxed">
        {displayText}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white font-semibold text-sm flex items-center gap-1 hover:text-white/90 transition-colors mt-1"
        >
          {isExpanded ? (
            <>
              Lebih Sedikit <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Selengkapnya <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}