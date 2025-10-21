'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Fuel, Settings, Crown } from "lucide-react"
import Link from "next/link"
import { useAuth } from '@/lib/auth-context'
import { api, Listing } from '@/lib/api'
import { Header } from '@/components/header'
import Image from 'next/image'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [regularListings, setRegularListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const [featuredResponse, regularResponse] = await Promise.all([
        api.getListings({ featured: true, limit: 3 }),
        api.getListings({ featured: false, limit: 10 }) // Get more to filter out sold ones
      ]);
      
      // Filter out sold listings
      const activeFeatured = featuredResponse.items.filter(listing => !listing.title.includes('SOLD'));
      const activeRegular = regularResponse.items.filter(listing => !listing.title.includes('SOLD'));
      
      setFeaturedListings(activeFeatured);
      setRegularListings(activeRegular.slice(0, 4)); // Take first 4 active regular listings
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/browse?q=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = '/browse';
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

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="home" />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-card via-background to-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Find Your Perfect Car or
              <span className="text-primary"> Sell with Confidence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Connect with thousands of buyers and sellers in the most trusted car marketplace. Premium listings get 5x
              more visibility.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-3 p-2 bg-card rounded-lg border shadow-lg">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by make, model, or keyword..."
                    className="pl-10 border-0 bg-transparent focus-visible:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex gap-2">
                  <Link href="/browse">
                    <Button variant="outline" size="sm">
                      Filters
                    </Button>
                  </Link>
                  <Button size="sm" className="px-8" onClick={handleSearch}>
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">25K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Dealers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Listings Section */}
      <section className="py-16 bg-gradient-to-r from-accent/10 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-accent" />
              <h2 className="text-3xl font-bold text-foreground">Premium Featured Cars</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These premium listings get priority placement and 5x more visibility.
              <Link href="/premium" className="text-accent hover:underline ml-1">
                Upgrade your listing →
              </Link>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardHeader>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))
            ) : featuredListings.length > 0 ? (
              featuredListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow border-accent/20">
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
                      <Link href={`/car/${listing.id}`} className="hover:text-primary transition-colors">
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{listing.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No premium listings available
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/browse?featured=true">
              <Button
                size="lg"
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
              >
                View All Premium Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Regular Featured Cars */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Popular Cars</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the most viewed and favorited cars from our community of sellers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Regular Car Cards */}
            {loading ? (
              // Loading skeleton
              [...Array(4)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="w-full h-40 bg-muted animate-pulse" />
                  <CardHeader className="pb-2">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : regularListings.length > 0 ? (
              regularListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image 
                      src={getImageUrl(listing.images, listing.make, listing.model, listing.year)} 
                      alt={`${listing.year} ${listing.make} ${listing.model}`} 
                      width={300}
                      height={160}
                      className="w-full h-40 object-cover" 
                    />
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                      {formatPrice(listing.price, listing.currency)}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      <Link
                        href={`/car/${listing.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {listing.year} {listing.make} {listing.model}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Settings className="w-3 h-3" />
                        {listing.mileage.toLocaleString()} miles
                      </span>
                      <span className="flex items-center gap-1">
                        <Fuel className="w-3 h-3" />
                        Gas
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{listing.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <p>No popular cars available at the moment</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/browse">
              <Button size="lg">Browse All Cars</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-balance">Ready to Sell Your Car?</h2>
          <p className="text-xl mb-8 text-pretty max-w-2xl mx-auto opacity-90">
            List your car in minutes and reach thousands of potential buyers. Premium listings get featured placement
            and sell 3x faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" variant="secondary">
                Browse Cars
              </Button>
            </Link>
            <Link href="/premium">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Upgrade to Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold text-foreground">CarMarket</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The most trusted platform for buying and selling used cars.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">For Buyers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/browse" className="hover:text-foreground transition-colors">
                    Browse Cars
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://www.lkf.ee/et" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Insurance
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">For Sellers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/sell" className="hover:text-foreground transition-colors">
                    Sell Your Car
                  </Link>
                </li>
                <li>
                  <Link href="/premium" className="hover:text-foreground transition-colors">
                    Premium Listings
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 CarMarket. All rights reserved. Built for educational purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
