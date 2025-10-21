'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Crown,
  Share2,
  MessageCircle,
  Shield,
  CheckCircle,
  Car,
  Users,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { api, Listing } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/header'
import Image from 'next/image'
import Head from 'next/head'

export default function CarDetailPage({ params }: { params: { slug: string } }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchListing();
  }, [params.slug]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const data = await api.getListing(params.slug);
      setListing(data);
    } catch (err) {
      setError('Failed to load listing');
      console.error('Error fetching listing:', err);
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

  const getImageUrl = (images: string[], make: string, model: string, year: number, index: number = 0) => {
    if (images.length > 0 && images[index]) {
      // Use the actual uploaded image URL
      return images[index];
    }
    return `/abstract-geometric-shapes.png?height=400&width=700&query=${year} ${make} ${model}`;
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-muted rounded" />
                <div className="h-64 bg-muted rounded" />
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-muted rounded" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    notFound();
  }

  const metaTitle = `${listing.year} ${listing.make} ${listing.model} - ${formatPrice(listing.price, listing.currency)}`
  const metaDescription = `${listing.title} - ${listing.year} ${listing.make} ${listing.model} with ${listing.mileage.toLocaleString()} miles. Located in ${listing.location}. ${listing.description.substring(0, 150)}...`
  const metaImage = listing.images.length > 0 ? listing.images[0] : `/abstract-geometric-shapes.png?height=400&width=700&query=${listing.year} ${listing.make} ${listing.model}`

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />
      </Head>
    <div className="min-h-screen bg-background">
      <Header currentPage="car" />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-foreground transition-colors">
            Browse Cars
          </Link>
          <span>/</span>
          <span className="text-foreground">
            {listing.year} {listing.make} {listing.model}
          </span>
        </div>

        {/* Back Button */}
        <Button variant="outline" size="sm" className="mb-6 bg-transparent" asChild>
          <Link href="/browse">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {listing.year} {listing.make} {listing.model}
                  </h1>
                  {listing.featured && (
                    <Badge className="bg-accent text-accent-foreground">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {listing.location}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  {shareCopied ? 'Copied!' : 'Share'}
                </Button>
              </div>
            </div>

            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <Image 
                  src={getImageUrl(listing.images, listing.make, listing.model, listing.year, currentImageIndex)} 
                  alt={`${listing.year} ${listing.make} ${listing.model}`} 
                  width={700}
                  height={400}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                  <span className="text-2xl font-bold">{formatPrice(listing.price, listing.currency)}</span>
                </div>
                {listing.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {listing.images.slice(0, 5).map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt={`${listing.make} ${listing.model} view ${index + 1}`}
                          width={80}
                          height={64}
                          className={`w-20 h-16 object-cover rounded border-2 cursor-pointer transition-colors ${
                            currentImageIndex === index 
                              ? 'border-white' 
                              : 'border-white/50 hover:border-white'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                      {listing.images.length > 5 && (
                        <div className="w-20 h-16 bg-black/50 rounded border-2 border-white/50 flex items-center justify-center text-white text-sm cursor-pointer hover:bg-black/70 transition-colors">
                          +{listing.images.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Car Details Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Key Specs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      Key Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Year</span>
                          <span className="font-medium">{listing.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mileage</span>
                          <span className="font-medium">{listing.mileage.toLocaleString()} miles</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Make</span>
                          <span className="font-medium">{listing.make}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Model</span>
                          <span className="font-medium">{listing.model}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price</span>
                          <span className="font-medium">{formatPrice(listing.price, listing.currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location</span>
                          <span className="font-medium">{listing.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Listed</span>
                          <span className="font-medium">{new Date(listing.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <span className="font-medium">{listing.featured ? 'Premium' : 'Standard'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                {/* Vehicle Details */}
                {(listing.fuel || listing.transmission || listing.exterior || listing.interior) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="w-5 h-5" />
                        Vehicle Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {listing.fuel && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Fuel Type</p>
                            <p className="text-sm">{listing.fuel}</p>
                          </div>
                        )}
                        {listing.transmission && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Transmission</p>
                            <p className="text-sm">{listing.transmission}</p>
                          </div>
                        )}
                        {listing.exterior && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Exterior</p>
                            <p className="text-sm">{listing.exterior}</p>
                          </div>
                        )}
                        {listing.interior && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Interior</p>
                            <p className="text-sm">{listing.interior}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Vehicle Features */}
                {listing.features && listing.features.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Vehicle Features & Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {listing.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Vehicle Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Vehicle ID</p>
                        <p className="font-mono text-sm">{listing.id}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Currency</p>
                        <p className="font-medium">{listing.currency.toUpperCase()}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Images</p>
                        <p className="font-medium">{listing.images.length} photos</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{new Date(listing.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Seller Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {listing.user ? (
                      <>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Seller Name</p>
                          <p className="font-medium">{listing.user.name || 'Not provided'}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{listing.user.email}</p>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                          <Button className="w-full" size="lg" asChild>
                            <a href={`mailto:${listing.user.email}`}>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </a>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground">Seller information not available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Seller */}
            {listing.user && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Contact Seller
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{listing.user.name || 'Car Seller'}</p>
                      <p className="text-sm text-muted-foreground">{listing.user.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <Button className="w-full" size="lg" asChild>
                      <a href={`mailto:${listing.user.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Price & Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Price & Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{formatPrice(listing.price, listing.currency)}</p>
                  <p className="text-sm text-muted-foreground">Listed price</p>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Currency</span>
                    <span className="font-medium">{listing.currency.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mileage</span>
                    <span className="font-medium">{listing.mileage.toLocaleString()} miles</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety & Trust */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Safety & Trust
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Verified listing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Contact seller directly</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure communication</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}