"use client";

import { MapPin, Package, CheckCircle, Truck } from "lucide-react";
import type { TrackingManifest } from "@/utils/trackingService";

interface TrackingTimelineProps {
  manifest: TrackingManifest[];
  delivered: boolean;
}

export default function TrackingTimeline({
  manifest,
  delivered,
}: TrackingTimelineProps) {
  const formatDate = (date: string) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  const formatTime = (time: string) => {
    try {
      // Format: HH:MM:SS
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    } catch {
      return time;
    }
  };

  const getIconForStatus = (index: number, total: number) => {
    // Item terakhir (terbaru) mendapat icon khusus
    if (index === total - 1) {
      if (delivered) {
        return (
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        );
      }
      return (
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg animate-pulse">
          <Truck className="w-6 h-6 text-white" />
        </div>
      );
    }

    if (index > total - 4) {
      return (
        <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
          <Package className="w-5 h-5 text-blue-600" />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
        <MapPin className="w-5 h-5 text-gray-500" />
      </div>
    );
  };

  const reversedManifest = [...manifest].reverse();

  return (
    <div className="space-y-0">
      {reversedManifest.map((item, index) => {
        const isLast = index === reversedManifest.length - 1;
        const isRecent = index < 3;

        return (
          <div key={index} className="relative">
            {/* Timeline Line */}
            {!isLast && (
              <div
                className={`absolute left-5 top-10 w-0.5 h-full ${
                  isRecent ? "bg-blue-200" : "bg-gray-200"
                }`}
                style={{ height: "calc(100% + 0.5rem)" }}
              />
            )}

            {/* Timeline Item */}
            <div className="flex gap-4 pb-6">
              {/* Icon */}
              <div className="relative z-10 shrink-0">
                {getIconForStatus(index, reversedManifest.length)}
              </div>

              {/* Content */}
              <div
                className={`flex-1 pt-1 ${
                  isRecent
                    ? "bg-blue-50 border border-blue-100 rounded-xl p-4 -mt-1"
                    : ""
                }`}
              >
                {/* Date & Time */}
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold ${
                      isRecent ? "text-blue-700" : "text-gray-500"
                    }`}
                  >
                    {formatDate(item.manifest_date)}
                  </span>
                  <span
                    className={`text-xs ${
                      isRecent ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    •
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      isRecent ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {formatTime(item.manifest_time)}
                  </span>
                </div>

                {/* Description */}
                <p
                  className={`text-sm leading-relaxed ${
                    isRecent
                      ? "text-gray-800 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {item.manifest_description}
                </p>

                {/* City Name (if available) */}
                {item.city_name && (
                  <div className="mt-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {item.city_name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
