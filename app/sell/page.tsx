"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Car, Upload, Crown, CheckCircle, ArrowRight, ArrowLeft, DollarSign, Camera, FileText, Zap } from "lucide-react"
import Link from "next/link"

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Vehicle Info
    make: "",
    model: "",
    year: "",
    mileage: "",
    vin: "",
    // Details
    exterior: "",
    interior: "",
    transmission: "",
    drivetrain: "",
    engine: "",
    fuel: "",
    // Condition
    condition: "",
    accidents: "",
    maintenance: "",
    // Pricing
    price: "",
    negotiable: false,
    // Description
    title: "",
    description: "",
    features: [] as string[],
    // Contact
    name: "",
    phone: "",
    email: "",
    location: "",
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
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
              <Link href="/sell" className="text-primary font-medium">
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
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Sell Your Car</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            List your car in minutes and reach thousands of potential buyers. Premium listings get featured placement
            and sell 3x faster.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Steps Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { step: 1, title: "Vehicle Info", icon: Car },
                    { step: 2, title: "Photos", icon: Camera },
                    { step: 3, title: "Details", icon: FileText },
                    { step: 4, title: "Pricing", icon: DollarSign },
                    { step: 5, title: "Review", icon: CheckCircle },
                  ].map(({ step, title, icon: Icon }) => (
                    <div
                      key={step}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        step === currentStep
                          ? "bg-primary/10 text-primary"
                          : step < currentStep
                            ? "bg-green-50 dark:bg-green-950/20 text-green-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step === currentStep
                            ? "bg-primary text-primary-foreground"
                            : step < currentStep
                              ? "bg-green-500 text-white"
                              : "bg-muted"
                        }`}
                      >
                        {step < currentStep ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span className="font-medium">{title}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {currentStep === 1 && <Car className="w-5 h-5" />}
                    {currentStep === 2 && <Camera className="w-5 h-5" />}
                    {currentStep === 3 && <FileText className="w-5 h-5" />}
                    {currentStep === 4 && <DollarSign className="w-5 h-5" />}
                    {currentStep === 5 && <CheckCircle className="w-5 h-5" />}
                    {currentStep === 1 && "Vehicle Information"}
                    {currentStep === 2 && "Upload Photos"}
                    {currentStep === 3 && "Vehicle Details"}
                    {currentStep === 4 && "Set Your Price"}
                    {currentStep === 5 && "Review & Publish"}
                  </CardTitle>
                  <CardDescription>
                    {currentStep === 1 && "Tell us about your vehicle's basic information"}
                    {currentStep === 2 && "Add photos to showcase your car"}
                    {currentStep === 3 && "Provide detailed information about your car"}
                    {currentStep === 4 && "Set a competitive price for your listing"}
                    {currentStep === 5 && "Review your listing before publishing"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1: Vehicle Info */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="year">Year *</Label>
                          <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 25 }, (_, i) => 2024 - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="make">Make *</Label>
                          <Select value={formData.make} onValueChange={(value) => handleInputChange("make", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select make" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "BMW",
                                "Mercedes-Benz",
                                "Tesla",
                                "Honda",
                                "Toyota",
                                "Ford",
                                "Nissan",
                                "Chevrolet",
                                "Hyundai",
                                "Kia",
                              ].map((make) => (
                                <SelectItem key={make} value={make}>
                                  {make}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="model">Model *</Label>
                          <Input
                            id="model"
                            placeholder="e.g., 3 Series, Camry, Model S"
                            value={formData.model}
                            onChange={(e) => handleInputChange("model", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="mileage">Mileage *</Label>
                          <Input
                            id="mileage"
                            placeholder="e.g., 25000"
                            value={formData.mileage}
                            onChange={(e) => handleInputChange("mileage", e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="vin">VIN (Vehicle Identification Number) *</Label>
                        <Input
                          id="vin"
                          placeholder="17-character VIN"
                          value={formData.vin}
                          onChange={(e) => handleInputChange("vin", e.target.value)}
                          maxLength={17}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Found on your dashboard, door frame, or registration
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Photos */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Upload Photos</h3>
                        <p className="text-muted-foreground mb-4">
                          Add up to 20 photos. First photo will be your main listing image.
                        </p>
                        <Button>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Photos
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          "Front exterior view",
                          "Rear exterior view",
                          "Driver side view",
                          "Passenger side view",
                          "Interior dashboard",
                          "Front seats",
                          "Rear seats",
                          "Engine bay",
                        ].map((photoType, index) => (
                          <div key={index} className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                            <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">{photoType}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Crown className="w-5 h-5 text-accent mt-0.5" />
                          <div>
                            <h4 className="font-medium text-foreground mb-1">Premium Photo Tips</h4>
                            <p className="text-sm text-muted-foreground">
                              High-quality photos get 3x more views. Take photos in good lighting, clean your car first,
                              and include interior and exterior shots.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Details */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="exterior">Exterior Color</Label>
                          <Select
                            value={formData.exterior}
                            onValueChange={(value) => handleInputChange("exterior", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              {["White", "Black", "Silver", "Gray", "Red", "Blue", "Green", "Brown", "Other"].map(
                                (color) => (
                                  <SelectItem key={color} value={color}>
                                    {color}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="interior">Interior Color</Label>
                          <Select
                            value={formData.interior}
                            onValueChange={(value) => handleInputChange("interior", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select interior" />
                            </SelectTrigger>
                            <SelectContent>
                              {["Black", "Gray", "Beige", "Brown", "White", "Other"].map((color) => (
                                <SelectItem key={color} value={color}>
                                  {color}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="transmission">Transmission</Label>
                          <Select
                            value={formData.transmission}
                            onValueChange={(value) => handleInputChange("transmission", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="automatic">Automatic</SelectItem>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="cvt">CVT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="fuel">Fuel Type</Label>
                          <Select value={formData.fuel} onValueChange={(value) => handleInputChange("fuel", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gas">Gasoline</SelectItem>
                              <SelectItem value="electric">Electric</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                              <SelectItem value="diesel">Diesel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Features & Options</Label>
                        <div className="grid md:grid-cols-3 gap-3 mt-2">
                          {[
                            "Navigation System",
                            "Backup Camera",
                            "Bluetooth",
                            "Heated Seats",
                            "Sunroof",
                            "Premium Sound",
                            "Keyless Entry",
                            "Cruise Control",
                            "Leather Seats",
                            "All-Wheel Drive",
                            "Parking Sensors",
                            "Remote Start",
                          ].map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                              <Checkbox
                                id={feature}
                                checked={formData.features.includes(feature)}
                                onCheckedChange={() => handleFeatureToggle(feature)}
                              />
                              <Label htmlFor={feature} className="text-sm cursor-pointer">
                                {feature}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your car's condition, maintenance history, and any additional details..."
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Pricing */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="price">Asking Price *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="price"
                            placeholder="45000"
                            value={formData.price}
                            onChange={(e) => handleInputChange("price", e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="negotiable"
                          checked={formData.negotiable}
                          onCheckedChange={(checked) => handleInputChange("negotiable", checked as boolean)}
                        />
                        <Label htmlFor="negotiable" className="cursor-pointer">
                          Price is negotiable
                        </Label>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Market Analysis</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Similar cars average:</span>
                            <span className="font-medium">$42,500 - $48,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Your price position:</span>
                            <Badge variant="secondary">Competitive</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Zap className="w-5 h-5 text-accent mt-0.5" />
                          <div>
                            <h4 className="font-medium text-foreground mb-1">Upgrade to Premium</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Premium listings get featured placement, priority in search results, and sell 3x faster.
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                            >
                              Learn More About Premium
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Review */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="bg-muted/50 rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">Listing Preview</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Vehicle Information</h4>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="text-muted-foreground">Year:</span> {formData.year || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Make:</span> {formData.make || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Model:</span>{" "}
                                {formData.model || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Mileage:</span>{" "}
                                {formData.mileage ? `${formData.mileage} miles` : "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Price:</span>{" "}
                                {formData.price ? `$${formData.price}` : "Not specified"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Details</h4>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="text-muted-foreground">Exterior:</span>{" "}
                                {formData.exterior || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Interior:</span>{" "}
                                {formData.interior || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Transmission:</span>{" "}
                                {formData.transmission || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Fuel:</span> {formData.fuel || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Features:</span> {formData.features.length}{" "}
                                selected
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" />
                          <Label htmlFor="terms" className="text-sm cursor-pointer">
                            I agree to the Terms of Service and Privacy Policy
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="contact" />
                          <Label htmlFor="contact" className="text-sm cursor-pointer">
                            I agree to be contacted by potential buyers
                          </Label>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">Ready to Publish</h4>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Your listing will be live immediately and visible to thousands of potential buyers.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="bg-transparent"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    {currentStep < totalSteps ? (
                      <Button onClick={nextStep}>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button size="lg" className="px-8">
                        Publish Listing
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
