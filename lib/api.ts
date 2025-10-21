const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  location: string;
  images: string[];
  features: string[];
  featured: boolean;
  exterior?: string;
  interior?: string;
  transmission?: string;
  fuel?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
}

export interface ListingsResponse {
  items: Listing[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  subscription: string;
  premiumListingsRemaining: number;
  createdAt?: string;
  subscriptionExpiresAt?: string;
  daysRemaining?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Listings endpoints
  async getListings(params?: {
    make?: string;
    model?: string;
    yearMin?: number;
    yearMax?: number;
    priceMin?: number;
    priceMax?: number;
    q?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'mileage_asc';
  }): Promise<ListingsResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request<ListingsResponse>(`/listings${queryString ? `?${queryString}` : ''}`);
  }

  async getListing(id: string): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}`);
  }

  async createListing(data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Listing> {
    return this.request<Listing>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateListing(id: string, data: Partial<Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteListing(id: string): Promise<void> {
    return this.request<void>(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  async getUploadUrl(listingId: string, contentType: string): Promise<{ url: string; key: string }> {
    return this.request<{ url: string; key: string }>(`/listings/${listingId}/upload-url?contentType=${contentType}`, {
      method: 'POST',
    });
  }

  async attachImage(listingId: string, key: string): Promise<Listing> {
    return this.request<Listing>(`/listings/${listingId}/attach-image`, {
      method: 'POST',
      body: JSON.stringify({ key }),
    });
  }

  // Stripe endpoints
  async createCheckoutSession(listingId: string, priceCents?: number, currency?: string): Promise<{ url: string }> {
    return this.request<{ url: string }>('/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ listingId, priceCents, currency }),
    });
  }

  // Dashboard endpoints
  async getUserListings(): Promise<Listing[]> {
    return this.request<Listing[]>('/listings/user/my-listings');
  }

  async getUserAnalytics(): Promise<{
    totalViews: number;
    totalInquiries: number;
    totalFavorites: number;
    averageDaysToSell: number;
    conversionRate: number;
    activeListings: number;
    soldListings: number;
    premiumListings: number;
    recentListings: Array<{
      id: string;
      title: string;
      price: number;
      featured: boolean;
      views: number;
      inquiries: number;
      favorites: number;
      daysListed: number;
      createdAt: string;
      updatedAt: string;
    }>;
  }> {
    return this.request('/listings/user/analytics');
  }

  async makePremium(listingId: string): Promise<Listing> {
    return this.request(`/listings/${listingId}/make-premium`, {
      method: 'POST',
    });
  }

  async updateProfile(data: { name?: string; email?: string }): Promise<{ success: boolean }> {
    return this.request('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async markAsSold(listingId: string): Promise<Listing> {
    return this.request(`/listings/${listingId}/mark-sold`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
