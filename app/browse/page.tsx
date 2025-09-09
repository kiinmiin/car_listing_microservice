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
  Star,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  Crown,
  Heart,
  Share2,
  Grid3X3,
  List,
} from "lucide-react"
import Link from "next/link"

export default function BrowsePage() {
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
              <Link href="/browse" className="text-primary font-medium">
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
                    <Input placeholder="Make, model, keyword..." className="pl-10" />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Price Range</label>
                  <div className="space-y-3">
                    <Slider defaultValue={[15000]} max={100000} step={1000} className="w-full" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>$0</span>
                      <span className="mx-auto">$15,000</span>
                      <span>$100,000+</span>
                    </div>
                  </div>
                </div>

                {/* Make */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Make</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                      <SelectItem value="tesla">Tesla</SelectItem>
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="ford">Ford</SelectItem>
                      <SelectItem value="nissan">Nissan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Year</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Min Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Max Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Mileage */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Mileage</label>
                  <div className="space-y-3">
                    <Slider defaultValue={[50000]} max={200000} step={5000} className="w-full" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>0</span>
                      <span className="mx-auto">50,000 miles</span>
                      <span>200,000+</span>
                    </div>
                  </div>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Fuel Type</label>
                  <div className="space-y-2">
                    {["Gas", "Electric", "Hybrid", "Diesel"].map((fuel) => (
                      <div key={fuel} className="flex items-center space-x-2">
                        <Checkbox id={fuel.toLowerCase()} />
                        <label htmlFor={fuel.toLowerCase()} className="text-sm text-foreground cursor-pointer">
                          {fuel}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Transmission</label>
                  <div className="space-y-2">
                    {["Automatic", "Manual", "CVT"].map((transmission) => (
                      <div key={transmission} className="flex items-center space-x-2">
                        <Checkbox id={transmission.toLowerCase()} />
                        <label htmlFor={transmission.toLowerCase()} className="text-sm text-foreground cursor-pointer">
                          {transmission}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
                <Button variant="outline" className="w-full bg-transparent">
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
                <h1 className="text-2xl font-bold text-foreground">Browse Cars</h1>
                <p className="text-muted-foreground">Showing 1,247 results</p>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="year-new">Year: Newest First</SelectItem>
                    <SelectItem value="mileage-low">Mileage: Lowest First</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-lg">
                  <Button variant="ghost" size="sm" className="border-r">
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Premium Listings Banner */}
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
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Car Listings Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Premium Car Listings */}
              {[
                {
                  make: "BMW",
                  model: "3 Series",
                  year: "2023",
                  price: "$45,999",
                  miles: "15K",
                  location: "Los Angeles, CA",
                  rating: "4.9",
                  isPremium: true,
                  image: "luxury red BMW 3 series sedan",
                  fuel: "Gas",
                  transmission: "Automatic",
                },
                {
                  make: "Tesla",
                  model: "Model S",
                  year: "2024",
                  price: "$89,999",
                  miles: "5K",
                  location: "San Francisco, CA",
                  rating: "5.0",
                  isPremium: true,
                  image: "white Tesla Model S electric car",
                  fuel: "Electric",
                  transmission: "Automatic",
                },
                {
                  make: "Mercedes-Benz",
                  model: "C-Class",
                  year: "2023",
                  price: "$52,999",
                  miles: "12K",
                  location: "Miami, FL",
                  rating: "4.8",
                  isPremium: true,
                  image: "black Mercedes-Benz C-Class luxury sedan",
                  fuel: "Gas",
                  transmission: "Automatic",
                },
              ].map((car, index) => (
                <Card
                  key={`premium-${index}`}
                  className="overflow-hidden hover:shadow-lg transition-shadow border-accent/20"
                >
                  <div className="relative">
                    <img
                      src={`/abstract-geometric-shapes.png?height=200&width=350&query=${car.image}`}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                    {car.isPremium && (
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                      {car.price}
                    </div>
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      <Link
                        href={`/car/${car.make.toLowerCase()}-${car.model.toLowerCase().replace(" ", "-")}-${car.year}`}
                        className="hover:text-primary transition-colors"
                      >
                        {car.year} {car.make} {car.model}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {car.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        {car.miles} miles
                      </span>
                      <span className="flex items-center gap-1">
                        <Fuel className="w-4 h-4" />
                        {car.fuel}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{car.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm font-medium">{car.rating}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Regular Car Listings */}
              {[
                {
                  make: "Honda",
                  model: "Civic",
                  year: "2022",
                  price: "$24,999",
                  miles: "28K",
                  location: "Austin, TX",
                  rating: "4.7",
                  isPremium: false,
                  image: "silver Honda Civic compact car",
                  fuel: "Gas",
                  transmission: "CVT",
                },
                {
                  make: "Toyota",
                  model: "Camry",
                  year: "2023",
                  price: "$29,999",
                  miles: "18K",
                  location: "Phoenix, AZ",
                  rating: "4.8",
                  isPremium: false,
                  image: "white Toyota Camry sedan",
                  fuel: "Gas",
                  transmission: "Automatic",
                },
                {
                  make: "Ford",
                  model: "F-150",
                  year: "2021",
                  price: "$42,999",
                  miles: "35K",
                  location: "Dallas, TX",
                  rating: "4.6",
                  isPremium: false,
                  image: "blue Ford F-150 pickup truck",
                  fuel: "Gas",
                  transmission: "Automatic",
                },
                {
                  make: "Nissan",
                  model: "Altima",
                  year: "2022",
                  price: "$26,999",
                  miles: "22K",
                  location: "Orlando, FL",
                  rating: "4.5",
                  isPremium: false,
                  image: "gray Nissan Altima sedan",
                  fuel: "Gas",
                  transmission: "CVT",
                },
                {
                  make: "Chevrolet",
                  model: "Malibu",
                  year: "2023",
                  price: "$27,999",
                  miles: "16K",
                  location: "Chicago, IL",
                  rating: "4.4",
                  isPremium: false,
                  image: "black Chevrolet Malibu sedan",
                  fuel: "Gas",
                  transmission: "Automatic",
                },
                {
                  make: "Hyundai",
                  model: "Elantra",
                  year: "2022",
                  price: "$22,999",
                  miles: "24K",
                  location: "Seattle, WA",
                  rating: "4.6",
                  isPremium: false,
                  image: "blue Hyundai Elantra compact sedan",
                  fuel: "Gas",
                  transmission: "CVT",
                },
              ].map((car, index) => (
                <Card key={`regular-${index}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={`/abstract-geometric-shapes.png?height=200&width=350&query=${car.image}`}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                      {car.price}
                    </div>
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      <Link
                        href={`/car/${car.make.toLowerCase()}-${car.model.toLowerCase().replace(" ", "-")}-${car.year}`}
                        className="hover:text-primary transition-colors"
                      >
                        {car.year} {car.make} {car.model}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {car.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        {car.miles} miles
                      </span>
                      <span className="flex items-center gap-1">
                        <Fuel className="w-4 h-4" />
                        {car.fuel}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{car.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm font-medium">{car.rating}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Load More Cars
              </Button>
              <p className="text-sm text-muted-foreground mt-2">Showing 12 of 1,247 results</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
