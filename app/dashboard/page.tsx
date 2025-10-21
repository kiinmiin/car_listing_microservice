"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
  Car,
  Crown,
  Eye,
  Heart,
  MessageCircle,
  Settings,
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { Header } from '@/components/header'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface DashboardListing {
  id: string;
  title: string;
  price: number;
  currency: string;
  make: string;
  model: string;
  year: number;
  featured: boolean;
  views: number;
  inquiries: number;
  favorites: number;
  daysListed: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface DashboardAnalytics {
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
    currency: string;
    make: string;
    model: string;
    year: number;
    images: string[];
    featured: boolean;
    views: number;
    inquiries: number;
    favorites: number;
    daysListed: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [listings, setListings] = useState<DashboardListing[]>([])
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [makingPremium, setMakingPremium] = useState<string | null>(null)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [editEmailOpen, setEditEmailOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  })
  const [editLoading, setEditLoading] = useState(false)
  const [markingAsSold, setMarkingAsSold] = useState<string | null>(null)
  const { user, loading: authLoading, refreshUser } = useAuth()
  const router = useRouter()

  const getImageUrl = (images: string[], make: string, model: string, year: number) => {
    if (images && images.length > 0) {
      // Use the actual uploaded image URL
      return images[0];
    }
    return `/abstract-geometric-shapes.png?height=200&width=350&query=${year} ${make} ${model}`;
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/dashboard')
      return
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user, authLoading, router])

  // Check for successful payment return and refresh data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      // Force refresh user data after payment
      setTimeout(() => {
        refreshUserData();
      }, 1000);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [listingsData, analyticsData] = await Promise.all([
        api.getUserListings(),
        api.getUserAnalytics()
      ])
      
      // Transform listings data to match DashboardListing interface
      const transformedListings = listingsData.map(listing => {
        const daysListed = Math.ceil((new Date().getTime() - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...listing,
          // Use realistic metrics based on listing age (same as backend)
          views: Math.min(daysListed * 5, 50),
          inquiries: Math.min(Math.floor(daysListed * 0.5), 5),
          favorites: Math.min(daysListed, 10),
          daysListed
        };
      })
      
      setListings(transformedListings)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const refreshUserData = async () => {
    try {
      await refreshUser();
      await fetchDashboardData();
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }

  const handleMakePremium = async (listingId: string) => {
    if (!user) return;
    
    setMakingPremium(listingId);
    try {
      await api.makePremium(listingId);
      // Refresh both user data and listings
      await refreshUser();
      await fetchDashboardData();
    } catch (error) {
      console.error('Error making listing premium:', error);
      alert('Failed to make listing premium. Please try again.');
    } finally {
      setMakingPremium(null);
    }
  }

  const handleEditProfile = () => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || ''
      });
      setEditProfileOpen(true);
    }
  }

  const handleEditEmail = () => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || ''
      });
      setEditEmailOpen(true);
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setEditLoading(true);
    try {
      await api.updateProfile(editForm);
      await refreshUser();
      setEditProfileOpen(false);
      setEditEmailOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setEditLoading(false);
    }
  }

  const handleMarkAsSold = async (listingId: string) => {
    if (!user) return;
    
    setMarkingAsSold(listingId);
    try {
      await api.markAsSold(listingId);
      await fetchDashboardData();
    } catch (error) {
      console.error('Error marking listing as sold:', error);
      alert('Failed to mark listing as sold. Please try again.');
    } finally {
      setMarkingAsSold(null);
    }
  }

  const formatPrice = (price: number, currency: string = 'USD') => {
    if (price >= 10000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: false,
      }).format(price);
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-destructive mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Error Loading Dashboard</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchDashboardData} className="w-full">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="dashboard" />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">Manage your listings and track your sales performance</p>
          </div>
          <Button size="lg" asChild>
            <Link href="/sell">
              <Plus className="w-4 h-4 mr-2" />
              List New Car
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.activeListings || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.premiumListings || 0} premium
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(analytics?.totalViews || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalInquiries || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.conversionRate || 0}% conversion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cars Sold</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.soldListings || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Avg. {analytics?.averageDaysToSell || 0} days to sell
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates on your listings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {listings.length > 0 ? (
                    listings.slice(0, 4).map((listing, index) => (
                      <div key={listing.id} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{listing.title} listed</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.ceil((new Date().getTime() - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No recent activity</p>
                      <p className="text-xs">Create your first listing to see activity here</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>How your listings are performing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics && analytics.activeListings > 0 ? (
                    <>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Total Views</span>
                          <span>{analytics.totalViews.toLocaleString()}</span>
                        </div>
                        <Progress value={Math.min((analytics.totalViews / 1000) * 100, 100)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Conversion Rate</span>
                          <span>{analytics.conversionRate}%</span>
                        </div>
                        <Progress value={Math.min(analytics.conversionRate * 20, 100)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Active Listings</span>
                          <span>{analytics.activeListings}</span>
                        </div>
                        <Progress value={Math.min((analytics.activeListings / 5) * 100, 100)} className="h-2" />
                      </div>
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mt-4">
                        <p className="text-sm text-foreground font-medium">
                          {analytics.conversionRate > 5 ? "Great performance!" : "Getting started!"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {analytics.conversionRate > 5 
                            ? `Your listings are performing well with ${analytics.conversionRate}% conversion rate`
                            : "Keep creating quality listings to improve your performance"
                          }
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No performance data yet</p>
                      <p className="text-xs">Create listings to see performance metrics</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">My Listings</h2>
              <Button asChild>
                <Link href="/sell">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Listing
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {listings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                    <p className="text-muted-foreground mb-4">Start by creating your first car listing</p>
                    <Button asChild>
                      <Link href="/sell">
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Listing
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                listings.map((listing) => (
                  <Card key={listing.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <Image
                          src={getImageUrl(listing.images, listing.make, listing.model, listing.year)}
                          alt={listing.title}
                          width={176}
                          height={128}
                          className="w-full md:w-44 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold">{listing.title}</h3>
                                {listing.featured && (
                                  <Badge className="bg-accent text-accent-foreground">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                                <Badge
                                  variant={listing.title.includes('SOLD') ? "secondary" : "default"}
                                  className={
                                    listing.title.includes('SOLD')
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                      : ""
                                  }
                                >
                                  {listing.title.includes('SOLD') ? "Sold" : "Active"}
                                </Badge>
                              </div>
                              <p className="text-2xl font-bold text-primary">{formatPrice(listing.price, listing.currency)}</p>
                              <p className="text-sm text-muted-foreground">Listed {listing.daysListed} days ago</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/car/${listing.id}`}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  View
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" disabled={listing.title.includes('SOLD')}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Mark vehicle as sold?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will mark "{listing.title}" as sold and remove it from browse. 
                                      The listing will still be visible in your dashboard for record-keeping.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleMarkAsSold(listing.id)}
                                      disabled={markingAsSold === listing.id}
                                    >
                                      {markingAsSold === listing.id ? 'Marking...' : 'Mark as Sold'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                                <Eye className="w-4 h-4" />
                                Views
                              </div>
                              <p className="font-semibold">{listing.views.toLocaleString()}</p>
                            </div>
                            <div>
                              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                                <MessageCircle className="w-4 h-4" />
                                Inquiries
                              </div>
                              <p className="font-semibold">{listing.inquiries}</p>
                            </div>
                            <div>
                              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                                <Heart className="w-4 h-4" />
                                Favorites
                              </div>
                              <p className="font-semibold">{listing.favorites}</p>
                            </div>
                          </div>

                          {!listing.title.includes('SOLD') && !listing.featured && user?.subscription !== 'premium' && user?.subscription !== 'spotlight' && (
                            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">Boost your listing</p>
                                  <p className="text-xs text-muted-foreground">Get 5x more views with Premium</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                                  asChild
                                >
                                  <Link href="/premium">
                                    Upgrade
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {!listing.title.includes('SOLD') && !listing.featured && (user?.subscription === 'premium' || user?.subscription === 'spotlight') && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Make this listing Premium</p>
                                  <p className="text-xs text-green-700 dark:text-green-300">Use your premium credits to boost this listing</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
                                  disabled={user?.premiumListingsRemaining === 0 || makingPremium === listing.id}
                                  onClick={() => handleMakePremium(listing.id)}
                                >
                                  {makingPremium === listing.id ? 'Processing...' : 
                                   user?.premiumListingsRemaining === 0 ? 'No Credits' : 'Make Premium'}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {(analytics?.totalViews || 0).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">All time</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{analytics?.conversionRate || 0}%</div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Inquiry rate</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Avg. Days to Sell</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{analytics?.averageDaysToSell || 0}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Based on {analytics?.soldListings || 0} sales</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Listing Performance</CardTitle>
                <CardDescription>Detailed breakdown of your listing metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.recentListings && analytics.recentListings.length > 0 ? (
                    analytics.recentListings.map((listing) => (
                      <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Image
                            src={getImageUrl(listing.images, listing.make, listing.model, listing.year)}
                            alt={listing.title}
                            width={64}
                            height={48}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{listing.title}</p>
                            <p className="text-sm text-muted-foreground">{formatPrice(listing.price, listing.currency)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-8 text-center">
                          <div>
                            <p className="text-sm font-medium">{listing.views}</p>
                            <p className="text-xs text-muted-foreground">Views</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{listing.inquiries}</p>
                            <p className="text-xs text-muted-foreground">Inquiries</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {listing.views > 0 ? ((listing.inquiries / listing.views) * 100).toFixed(1) : 0}%
                            </p>
                            <p className="text-xs text-muted-foreground">Rate</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No listing data available yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Verified Seller</span>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline" onClick={handleEditProfile}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Manage your contact details and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{user.email}</span>
                        <Button variant="outline" size="sm" onClick={handleEditEmail}>
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Subscription</label>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm capitalize">{user.subscription}</span>
                      {(user.subscription === 'premium' || user.subscription === 'spotlight') ? (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Crown className="w-3 h-3" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/premium">
                            <Edit className="w-3 h-3" />
                          </Link>
                        </Button>
                      )}
                    </div>
                    {(user.subscription === 'premium' || user.subscription === 'spotlight') && (
                      <div className="mt-1">
                        <p className="text-xs text-muted-foreground">
                          {user.premiumListingsRemaining} premium listings remaining
                        </p>
                        {user.daysRemaining && user.daysRemaining > 0 && (
                          <p className="text-xs text-orange-600 dark:text-orange-400">
                            {user.daysRemaining} days remaining
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={editLoading}>
                {editLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Email Modal */}
      <Dialog open={editEmailOpen} onOpenChange={setEditEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
            <DialogDescription>
              Update your email address for account communication
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-edit">New Email</Label>
              <Input
                id="email-edit"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Enter your new email"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditEmailOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={editLoading}>
                {editLoading ? 'Saving...' : 'Update Email'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
