"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Car,
  Crown,
  Eye,
  Heart,
  MessageCircle,
  Settings,
  TrendingUp,
  Star,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  MapPin,
} from "lucide-react"
import Link from "next/link"

// Mock data - in real app this would come from your backend
const mockUser = {
  name: "John Smith",
  email: "john.smith@email.com",
  phone: "(555) 123-4567",
  location: "Los Angeles, CA",
  memberSince: "January 2024",
  rating: 4.8,
  reviews: 23,
  verified: true,
}

const mockListings = [
  {
    id: 1,
    title: "2023 BMW 3 Series",
    price: "$45,999",
    status: "active",
    isPremium: true,
    views: 1247,
    inquiries: 18,
    favorites: 34,
    daysListed: 5,
    image: "luxury red BMW 3 series sedan",
  },
  {
    id: 2,
    title: "2022 Honda Civic",
    price: "$24,999",
    status: "active",
    isPremium: false,
    views: 432,
    inquiries: 7,
    favorites: 12,
    daysListed: 12,
    image: "silver Honda Civic compact car",
  },
  {
    id: 3,
    title: "2021 Ford F-150",
    price: "$42,999",
    status: "sold",
    isPremium: true,
    views: 2156,
    inquiries: 31,
    favorites: 67,
    daysListed: 8,
    image: "blue Ford F-150 pickup truck",
  },
]

const mockAnalytics = {
  totalViews: 3835,
  totalInquiries: 56,
  totalFavorites: 113,
  averageDaysToSell: 8,
  conversionRate: 12.5,
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold text-foreground">CarMarket</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/browse" className="text-foreground hover:text-primary transition-colors">
                Browse Cars
              </Link>
              <Link href="/sell" className="text-foreground hover:text-primary transition-colors">
                Sell Your Car
              </Link>
              <Link href="/premium" className="text-accent hover:text-accent/80 transition-colors font-medium">
                Premium Listings
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {mockUser.name}!</h1>
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
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.totalViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.totalInquiries}</div>
                  <p className="text-xs text-muted-foreground">+8 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cars Sold</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Avg. 8 days to sell</p>
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
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New inquiry on BMW 3 Series</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Honda Civic added to 3 favorites</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">BMW 3 Series upgraded to Premium</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Ford F-150 marked as sold</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>How your listings are performing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Listing Views</span>
                      <span>1,679 / 2,000 goal</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Inquiry Rate</span>
                      <span>3.3% (Industry avg: 2.1%)</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Response Time</span>
                      <span>2.4 hours (Target: &lt;4h)</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mt-4">
                    <p className="text-sm text-foreground font-medium">Great performance!</p>
                    <p className="text-xs text-muted-foreground">
                      Your listings are performing 58% better than average
                    </p>
                  </div>
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
              {mockListings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={`/abstract-geometric-shapes.png?height=120&width=180&query=${listing.image}`}
                        alt={listing.title}
                        className="w-full md:w-44 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">{listing.title}</h3>
                              {listing.isPremium && (
                                <Badge className="bg-accent text-accent-foreground">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                              <Badge
                                variant={listing.status === "active" ? "default" : "secondary"}
                                className={
                                  listing.status === "sold"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    : ""
                                }
                              >
                                {listing.status === "active" ? "Active" : "Sold"}
                              </Badge>
                            </div>
                            <p className="text-2xl font-bold text-primary">{listing.price}</p>
                            <p className="text-sm text-muted-foreground">Listed {listing.daysListed} days ago</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
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

                        {listing.status === "active" && !listing.isPremium && (
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
                              >
                                Upgrade
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {mockAnalytics.totalViews.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">+12% vs last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{mockAnalytics.conversionRate}%</div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Above average (8.2%)</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Avg. Days to Sell</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{mockAnalytics.averageDaysToSell}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">3x faster than average</span>
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
                  {mockListings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={`/abstract-geometric-shapes.png?height=40&width=60&query=${listing.image}`}
                          alt={listing.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{listing.title}</p>
                          <p className="text-sm text-muted-foreground">{listing.price}</p>
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
                            {((listing.inquiries / listing.views) * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Rate</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <AvatarFallback className="text-2xl">JS</AvatarFallback>
                  </Avatar>
                  <CardTitle>{mockUser.name}</CardTitle>
                  <CardDescription>Member since {mockUser.memberSince}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-medium">{mockUser.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({mockUser.reviews} reviews)</span>
                  </div>
                  {mockUser.verified && (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Verified Seller</span>
                    </div>
                  )}
                  <Button className="w-full bg-transparent" variant="outline">
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
                        <span className="text-sm">{mockUser.email}</span>
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{mockUser.phone}</span>
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{mockUser.location}</span>
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Notification Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Email notifications</p>
                          <p className="text-xs text-muted-foreground">Receive updates about your listings</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Enabled
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">SMS notifications</p>
                          <p className="text-xs text-muted-foreground">Get instant alerts for inquiries</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Disabled
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Marketing emails</p>
                          <p className="text-xs text-muted-foreground">Tips and promotional offers</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Enabled
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
