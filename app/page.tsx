import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Star, MapPin, Calendar, Fuel, Settings, Crown } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-foreground">CarMarket</span>
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
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Filters
                  </Button>
                  <Button size="sm" className="px-8">
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
            {/* Premium Car Card 1 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-accent/20">
              <div className="relative">
                <img src="/luxury-red-bmw-sedan-front-view.jpg" alt="2023 BMW 3 Series" className="w-full h-48 object-cover" />
                <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                  $45,999
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">2023 BMW 3 Series</CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    2023
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    15K miles
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="w-4 h-4" />
                    Gas
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Los Angeles, CA</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Car Card 2 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-accent/20">
              <div className="relative">
                <img src="/white-tesla-model-s-electric-car.jpg" alt="2024 Tesla Model S" className="w-full h-48 object-cover" />
                <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                  $89,999
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">2024 Tesla Model S</CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    2024
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    5K miles
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="w-4 h-4" />
                    Electric
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Car Card 3 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-accent/20">
              <div className="relative">
                <img
                  src="/black-mercedes-benz-c-class-luxury-sedan.jpg"
                  alt="2023 Mercedes-Benz C-Class"
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                  $52,999
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">2023 Mercedes-Benz C-Class</CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    2023
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    12K miles
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="w-4 h-4" />
                    Gas
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Miami, FL</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              View All Premium Listings
            </Button>
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
            {[
              {
                make: "Honda",
                model: "Civic",
                year: "2022",
                price: "$24,999",
                miles: "28K",
                location: "Austin, TX",
                rating: "4.7",
                image: "silver Honda Civic compact car",
              },
              {
                make: "Toyota",
                model: "Camry",
                year: "2023",
                price: "$29,999",
                miles: "18K",
                location: "Phoenix, AZ",
                rating: "4.8",
                image: "white Toyota Camry sedan",
              },
              {
                make: "Ford",
                model: "F-150",
                year: "2021",
                price: "$42,999",
                miles: "35K",
                location: "Dallas, TX",
                rating: "4.6",
                image: "blue Ford F-150 pickup truck",
              },
              {
                make: "Nissan",
                model: "Altima",
                year: "2022",
                price: "$26,999",
                miles: "22K",
                location: "Orlando, FL",
                rating: "4.5",
                image: "gray Nissan Altima sedan",
              },
            ].map((car, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={`/abstract-geometric-shapes.png?height=160&width=300&query=${car.image}`}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                    {car.price}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {car.year} {car.make} {car.model}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <Settings className="w-3 h-3" />
                      {car.miles} miles
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
                      <span className="text-muted-foreground">{car.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="font-medium">{car.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg">Browse All Cars</Button>
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
            <Button size="lg" variant="secondary">
              List Your Car Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Upgrade to Premium
            </Button>
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
                  <Link href="/financing" className="hover:text-foreground transition-colors">
                    Financing
                  </Link>
                </li>
                <li>
                  <Link href="/insurance" className="hover:text-foreground transition-colors">
                    Insurance
                  </Link>
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
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Pricing Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-foreground transition-colors">
                    Safety Tips
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
