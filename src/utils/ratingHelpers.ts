export interface Rating {
  rating_id: number;
  id_customer: number;
  id_produk: number;
  id_toko: number;
  invoice: string;
  rating: number;
  comment: string;
  foto_depan: string | null;
  foto_belakang: string | null;
  foto_kanan: string | null;
  foto_kiri: string | null;
  video: string | null;
  date_created: string;
  respon: string | null;
  date_respon: string | null;
}

export interface RatingStats {
  average: number;
  total: number;
  breakdown: Array<{
    stars: number;
    count: number;
    percentage: number;
  }>;
}

export interface Review {
  name: string;
  date: string;
  rating: number;
  comment: string;
  likes: number;
  images?: string[];
  invoice?: string;
}

export function processRatingsData(ratings: Rating[]): RatingStats {
  if (!ratings || ratings.length === 0) {
    return {
      average: 0,
      total: 0,
      breakdown: [
        { stars: 5, count: 0, percentage: 0 },
        { stars: 4, count: 0, percentage: 0 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
      ],
    };
  }

  const total = ratings.length;
  const breakdown = [
    { stars: 5, count: 0, percentage: 0 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  // Count ratings
  let totalRating = 0;
  ratings.forEach((rating) => {
    totalRating += rating.rating;
    const index = 5 - rating.rating;
    if (index >= 0 && index < 5) {
      breakdown[index].count++;
    }
  });

  breakdown.forEach((item) => {
    item.percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
  });

  const average = total > 0 ? Number((totalRating / total).toFixed(1)) : 0;

  return {
    average,
    total,
    breakdown,
  };
}

export function transformRatingsToReviews(ratings: Rating[]): Review[] {
  const imageBaseUrl = "https://seller.jaja.id/asset/images/rating/";

  return ratings.map((rating) => {
    const images: string[] = [];

    if (rating.foto_depan) images.push(`${imageBaseUrl}${rating.foto_depan}`);
    if (rating.foto_belakang)
      images.push(`${imageBaseUrl}${rating.foto_belakang}`);
    if (rating.foto_kanan) images.push(`${imageBaseUrl}${rating.foto_kanan}`);
    if (rating.foto_kiri) images.push(`${imageBaseUrl}${rating.foto_kiri}`);

    const date = new Date(rating.date_created);
    const formattedDate = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return {
      name: getCustomerDisplayName(rating.id_customer, false),
      date: formattedDate,
      rating: rating.rating,
      comment: rating.comment,
      likes: 0,
      images: images.length > 0 ? images : undefined,
      invoice: rating.invoice,
    };
  });
}

export function getCustomerDisplayName(
  customerId: number,
  maskName: boolean = true,
): string {
  if (maskName) {
    return `Customer #${customerId}`;
  }
  return `Customer ${customerId}`;
}

export function formatRatingDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "#10b981"; 
  if (rating >= 3.5) return "#3b82f6"; 
  if (rating >= 2.5) return "#f59e0b"; 
  return "#ef4444"; 
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return "Sangat Baik";
  if (rating >= 3.5) return "Baik";
  if (rating >= 2.5) return "Cukup";
  if (rating >= 1.5) return "Kurang";
  return "Sangat Kurang";
}
