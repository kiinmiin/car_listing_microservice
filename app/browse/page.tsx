'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  Crown,
  Heart,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { api, Listing } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/header'
import Image from 'next/image'

export default function BrowsePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    make: 'any',
    yearMin: 'any',
    yearMax: 'any',
    priceMin: '',
    priceMax: '',
    featured: false,
    sort: 'newest' as const,
  });
  const { user } = useAuth();

  useEffect(() => {
    // Read URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    const featuredParam = urlParams.get('featured');
    
    if (searchQuery || featuredParam) {
      setFilters(prev => ({
        ...prev,
        ...(searchQuery && { search: searchQuery }),
        ...(featuredParam === 'true' && { featured: true })
      }));
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (filters.search) params.q = filters.search;
      if (filters.make && filters.make !== 'any') params.make = filters.make;
      if (filters.yearMin && filters.yearMin !== 'any') params.yearMin = parseInt(filters.yearMin);
      if (filters.yearMax && filters.yearMax !== 'any') params.yearMax = parseInt(filters.yearMax);
      if (filters.priceMin) params.priceMin = parseInt(filters.priceMin); // Store as whole dollars
      if (filters.priceMax) params.priceMax = parseInt(filters.priceMax); // Store as whole dollars
      if (filters.featured) params.featured = true;
      if (filters.sort) params.sort = filters.sort;
      
      params.limit = 20;
      
      const response = await api.getListings(params);
      setListings(response.items);
    } catch (err) {
      setError('Failed to load listings');
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (price >= 10000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: false,
      }).format(price);
    }
  };

  const getImageUrl = (images: string[], make: string, model: string, year: number) => {
    if (images.length > 0) {
      // Use the actual uploaded image URL
      return images[0];
    }
    return `/abstract-geometric-shapes.png?height=200&width=350&query=${year} ${make} ${model}`;
  };

  // Filter out sold listings first
  const activeListings = listings.filter(listing => !listing.title.includes('SOLD'));
  
  // If featured filter is active, show only featured listings
  // Otherwise, separate into premium and regular sections
  const premiumListings = filters.featured 
    ? activeListings.filter(listing => listing.featured)
    : activeListings.filter(listing => listing.featured);
  const regularListings = filters.featured 
    ? [] // Don't show regular listings when filtering for featured only
    : activeListings.filter(listing => !listing.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="browse" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>

              {/* Search */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      placeholder="Make, model, keyword..." 
                      className="pl-10"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Make */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Make</label>
                  <Select value={filters.make} onValueChange={(value) => setFilters(prev => ({ ...prev, make: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Make</SelectItem>
                      <SelectItem value="BMW">BMW</SelectItem>
                      <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                      <SelectItem value="Tesla">Tesla</SelectItem>
                      <SelectItem value="Honda">Honda</SelectItem>
                      <SelectItem value="Toyota">Toyota</SelectItem>
                      <SelectItem value="Ford">Ford</SelectItem>
                      <SelectItem value="Nissan">Nissan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Year</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={filters.yearMin} onValueChange={(value) => setFilters(prev => ({ ...prev, yearMin: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Min Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {Array.from({ length: 26 }, (_, i) => 2025 - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filters.yearMax} onValueChange={(value) => setFilters(prev => ({ ...prev, yearMax: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Max Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {Array.from({ length: 26 }, (_, i) => 2025 - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Featured Only */}
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="featured" 
                      checked={filters.featured}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, featured: !!checked }))}
                    />
                    <label htmlFor="featured" className="text-sm text-foreground cursor-pointer">
                      Premium listings only
                        </label>
                  </div>
                </div>

                <Button className="w-full" onClick={fetchListings}>
                  Apply Filters
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent"
                  onClick={() => setFilters({
                    search: '',
                    make: 'any',
                    yearMin: 'any',
                    yearMax: 'any',
                    priceMin: '',
                    priceMax: '',
                    featured: false,
                    sort: 'newest',
                  })}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {filters.search ? `Search Results for "${filters.search}"` : 
                   filters.featured ? 'Premium Listings' : 'Browse Cars'}
                </h1>
                <p className="text-muted-foreground">
                  {loading ? 'Loading...' : `Showing ${activeListings.length} results`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={filters.sort} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sort: value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="mileage_asc">Mileage: Lowest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Premium Listings Banner - only show when not filtering for featured only */}
            {premiumListings.length > 0 && !filters.featured && (
            <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20 p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-accent" />
                    Premium Listings
                  </h3>
                  <p className="text-muted-foreground">
                    These featured cars get priority placement and 5x more visibility
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                  onClick={() => window.location.href = '/premium'}
                >
                  Learn More
                </Button>
              </div>
            </div>
            )}

            {/* Car Listings Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 bg-muted animate-pulse" />
                    <CardHeader>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-8 bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* All Listings - when featured filter is active, show all in one section */}
                {filters.featured ? (
                  // Show all listings as premium when filtering for featured only
                  activeListings.map((listing) => (
                <Card
                      key={listing.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border-accent/20"
                >
                  <div className="relative">
                    <Image 
                      src={getImageUrl(listing.images, listing.make, listing.model, listing.year)} 
                      alt={`${listing.year} ${listing.make} ${listing.model}`} 
                      width={350}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                          {formatPrice(listing.price, listing.currency)}
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      <Link
                            href={`/car/${listing.id}`}
                        className="hover:text-primary transition-colors"
                      >
                            {listing.year} {listing.make} {listing.model}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                            {listing.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                            {listing.mileage.toLocaleString()} miles
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{listing.location}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/car/${listing.id}`}>
                            <Button size="sm" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  // Show separated premium and regular listings when not filtering
                  <>
                    {/* Premium Listings */}
                    {premiumListings.map((listing) => (
                      <Card
                        key={listing.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow border-accent/20"
                      >
                        <div className="relative">
                    <Image 
                      src={getImageUrl(listing.images, listing.make, listing.model, listing.year)} 
                      alt={`${listing.year} ${listing.make} ${listing.model}`} 
                      width={350}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                            {formatPrice(listing.price, listing.currency)}
                          </div>
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">
                            <Link
                              href={`/car/${listing.id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {listing.year} {listing.make} {listing.model}
                            </Link>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {listing.year}
                      </span>
                      <span className="flex items-center gap-1">
                              <Settings className="w-4 h-4" />
                              {listing.mileage.toLocaleString()} miles
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{listing.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                            <Link href={`/car/${listing.id}`}>
                              <Button size="sm" className="w-full">
                        View Details
                      </Button>
                            </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}

                    {/* Regular Listings */}
                    {regularListings.map((listing) => (
                      <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image 
                      src={getImageUrl(listing.images, listing.make, listing.model, listing.year)} 
                      alt={`${listing.year} ${listing.make} ${listing.model}`} 
                      width={350}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                            {formatPrice(listing.price, listing.currency)}
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      <Link
                              href={`/car/${listing.id}`}
                        className="hover:text-primary transition-colors"
                      >
                              {listing.year} {listing.make} {listing.model}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                              {listing.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                              {listing.mileage.toLocaleString()} miles
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{listing.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                            <Link href={`/car/${listing.id}`}>
                              <Button size="sm" className="w-full">
                        View Details
                      </Button>
                            </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
                  </>
                )}
            </div>
            )}

            {!loading && listings.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-foreground mb-2">No cars found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}