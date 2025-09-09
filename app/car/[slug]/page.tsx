import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  MapPin,
  Crown,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Shield,
  CheckCircle,
  Car,
  Users,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock data - in real app this would come from your backend
const getCarData = (slug: string) => {
  const cars = {
    "bmw-3-series-2023": {
      make: "BMW",
      model: "3 Series",
      year: "2023",
      price: "$45,999",
      miles: "15,000",
      location: "Los Angeles, CA",
      rating: "4.9",
      isPremium: true,
      fuel: "Gas",
      transmission: "Automatic",
      exterior: "Alpine White",
      interior: "Black Leather",
      drivetrain: "RWD",
      engine: "2.0L Turbo I4",
      mpg: "26 city / 36 highway",
      vin: "WBA8E1C50NCE12345",
      seller: {
        name: "Premium Auto Dealer",
        rating: "4.8",
        reviews: "127",
        verified: true,
        phone: "(555) 123-4567",
      },
      features: [
        "Navigation System",
        "Backup Camera",
        "Bluetooth",
        "Heated Seats",
        "Sunroof",
        "Premium Sound",
        "Keyless Entry",
        "Cruise Control",
      ],
      images: [
        "luxury red BMW 3 series sedan front view",
        "BMW 3 series interior dashboard",
        "BMW 3 series side profile",
        "BMW 3 series rear view",
        "BMW 3 series engine bay",
      ],
      description:
        "This pristine 2023 BMW 3 Series is in excellent condition with low mileage. Features premium leather interior, advanced safety features, and has been meticulously maintained. Perfect for those seeking luxury and performance.",
    },
  }

  return cars[slug as keyof typeof cars] || null
}

export default function CarDetailPage({ params }: { params: { slug: string } }) {
  const car = getCarData(params.slug)

  if (!car) {
    notFound()
  }

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
                Sign In
              </Button>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

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
            {car.year} {car.make} {car.model}
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
                    {car.year} {car.make} {car.model}
                  </h1>
                  {car.isPremium && (
                    <Badge className="bg-accent text-accent-foreground">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {car.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    {car.rating} rating
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={`/abstract-geometric-shapes.png?height=400&width=700&query=${car.images[0]}`}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                  <span className="text-2xl font-bold">{car.price}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {car.images.slice(1, 5).map((image, index) => (
                      <img
                        key={index}
                        src={`/abstract-geometric-shapes.png?height=80&width=120&query=${image}`}
                        alt={`${car.make} ${car.model} view ${index + 2}`}
                        className="w-20 h-16 object-cover rounded border-2 border-white/50 hover:border-white cursor-pointer transition-colors"
                      />
                    ))}
                    <div className="w-20 h-16 bg-black/50 rounded border-2 border-white/50 flex items-center justify-center text-white text-sm cursor-pointer hover:bg-black/70 transition-colors">
                      +{car.images.length - 5} more
                    </div>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="sm" className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Car Details Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="financing">Financing</TabsTrigger>
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
                          <span className="font-medium">{car.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mileage</span>
                          <span className="font-medium">{car.miles} miles</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Engine</span>
                          <span className="font-medium">{car.engine}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transmission</span>
                          <span className="font-medium">{car.transmission}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Drivetrain</span>
                          <span className="font-medium">{car.drivetrain}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fuel Economy</span>
                          <span className="font-medium">{car.mpg}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Exterior Color</span>
                          <span className="font-medium">{car.exterior}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Interior</span>
                          <span className="font-medium">{car.interior}</span>
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
                    <p className="text-muted-foreground leading-relaxed">{car.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Included Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {car.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Vehicle History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">Clean Title</p>
                        <p className="text-sm text-green-600 dark:text-green-400">No accidents reported</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">Single Owner</p>
                        <p className="text-sm text-green-600 dark:text-green-400">Well maintained</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">VIN: {car.vin}</p>
                      <Button variant="outline" size="sm">
                        View Full History Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financing Options</CardTitle>
                    <CardDescription>Get pre-approved for financing with competitive rates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Estimated Monthly Payment</h4>
                        <p className="text-2xl font-bold text-primary">$689/mo</p>
                        <p className="text-sm text-muted-foreground">Based on 4.9% APR, 60 months</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Down Payment</h4>
                        <p className="text-2xl font-bold">$9,200</p>
                        <p className="text-sm text-muted-foreground">20% of purchase price</p>
                      </div>
                    </div>
                    <Button className="w-full">Get Pre-Approved</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Seller */}
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
                    <p className="font-medium">{car.seller.name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span>
                        {car.seller.rating} ({car.seller.reviews} reviews)
                      </span>
                      {car.seller.verified && <CheckCircle className="w-3 h-3 text-green-500 ml-1" />}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Call {car.seller.phone}
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Price & Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Price & Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{car.price}</p>
                  <p className="text-sm text-muted-foreground">Listed price</p>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Value</span>
                    <span className="text-green-600 font-medium">Great Deal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Monthly</span>
                    <span className="font-medium">$689/mo</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Make an Offer
                </Button>
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
                  <span>Verified seller</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Vehicle history available</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure payment options</span>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Report This Listing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
