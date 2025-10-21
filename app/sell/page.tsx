'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Car, Upload, Crown, CheckCircle, ArrowRight, ArrowLeft, DollarSign, Camera, FileText, Zap, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { Header } from '@/components/header'

// Extend Window interface for temp files
declare global {
  interface Window {
    tempFiles?: Map<string, File>;
  }
}

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    // Vehicle Info
    make: "",
    model: "",
    year: "",
    mileage: "",
    // Details
    exterior: "",
    interior: "",
    transmission: "",
    fuel: "",
    // Pricing
    price: "",
    // Description
    title: "",
    description: "",
    features: [] as string[],
    // Contact
    location: "",
  })
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/sell')
    }
  }, [user, authLoading, router])

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

  const handleImageUpload = async (files: FileList) => {
    if (!files.length) return

    setUploadingImages(true)
    setError('')

    try {
      // For now, just store the files locally and upload them after listing creation
      const fileArray = Array.from(files)
      const fileKeys = fileArray.map((file, index) => `temp-${Date.now()}-${index}`)
      
      // Store files in state for later upload
      setUploadedImages(prev => [...prev, ...fileKeys])
      
      // Store the actual files for later use
      if (!window.tempFiles) window.tempFiles = new Map()
      fileArray.forEach((file, index) => {
        window.tempFiles!.set(fileKeys[index], file)
      })
    } catch (err) {
      setError('Failed to prepare images. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    const tempKey = uploadedImages[index]
    if (window.tempFiles && tempKey) {
      window.tempFiles.delete(tempKey)
    }
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to create a listing')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.make || !formData.model || !formData.year || !formData.mileage || !formData.price) {
        setError('Please fill in all required fields')
        return
      }

      // Create listing first (without images)
      const listingData = {
        title: formData.title || `${formData.year} ${formData.make} ${formData.model}`,
        description: formData.description || `Clean ${formData.year} ${formData.make} ${formData.model} with ${formData.mileage} miles.`,
        price: parseInt(formData.price), // Store as whole dollars
        currency: 'USD',
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
        location: formData.location || 'Not specified',
        images: [], // Start with empty images array
        features: formData.features, // Include selected features
        exterior: formData.exterior || undefined,
        interior: formData.interior || undefined,
        transmission: formData.transmission || undefined,
        fuel: formData.fuel || undefined,
        featured: false,
      }

      const listing = await api.createListing(listingData)
      
      // Now upload images if any
      if (uploadedImages.length > 0 && window.tempFiles) {
        setUploadingImages(true)
        try {
          const imageKeys = []
          for (const tempKey of uploadedImages) {
            const file = window.tempFiles.get(tempKey)
            if (file) {
              // Get upload URL for the real listing
              const { url, key } = await api.getUploadUrl(listing.id, file.type)
              
              // Upload file to S3/MinIO
              const uploadResponse = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {
                  'Content-Type': file.type,
                },
              })

              if (uploadResponse.ok) {
                imageKeys.push(key)
                // Attach image to listing
                await api.attachImage(listing.id, key)
              }
            }
          }
          
          // Clean up temp files
          window.tempFiles.clear()
        } catch (uploadErr) {
          console.error('Image upload error:', uploadErr)
          // Don't fail the whole process if image upload fails
        } finally {
          setUploadingImages(false)
        }
      }
      
      // Redirect to the new listing
      router.push(`/car/${listing.id}`)
    } catch (err) {
      setError('Failed to create listing. Please try again.')
      console.error('Create listing error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Show loading if checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Login Required</CardTitle>
            <CardDescription>
              You need to be logged in to create a listing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/auth/login?redirect=/sell" className="w-full">
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link href="/auth/register?redirect=/sell" className="w-full">
              <Button variant="outline" className="w-full">Create Account</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="sell" />

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

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}

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
                                "Audi",
                                "BMW",
                                "Mercedes-Benz",
                                "Volkswagen",
                                "Tesla",
                                "Honda",
                                "Toyota",
                                "Ford",
                                "Nissan",
                                "Chevrolet",
                                "Hyundai",
                                "Kia",
                                "Mazda",
                                "Subaru",
                                "Lexus",
                                "Acura",
                                "Infiniti",
                                "Genesis",
                                "Volvo",
                                "Jaguar",
                                "Land Rover",
                                "Porsche",
                                "Mitsubishi",
                                "Suzuki",
                                "Fiat",
                                "Alfa Romeo",
                                "Jeep",
                                "Dodge",
                                "Chrysler",
                                "Buick",
                                "Cadillac",
                                "Lincoln",
                                "GMC",
                                "Ram",
                                "Other",
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
                            type="number"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          placeholder="e.g., San Francisco, CA"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                        />
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
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                          className="hidden"
                          id="image-upload"
                          disabled={uploadingImages}
                        />
                        <label htmlFor="image-upload">
                          <Button disabled={uploadingImages} asChild>
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              {uploadingImages ? 'Uploading...' : 'Choose Photos'}
                            </span>
                          </Button>
                        </label>
                      </div>

                      {/* Uploaded Images */}
                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {uploadedImages.map((imageKey, index) => {
                            const file = window.tempFiles?.get(imageKey);
                            const previewUrl = file ? URL.createObjectURL(file) : `/abstract-geometric-shapes.png?height=150&width=200&query=car image ${index + 1}`;
                            return (
                            <div key={index} className="relative group">
                              <img
                                src={previewUrl}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                            );
                          })}
                        </div>
                      )}

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
                        <Label htmlFor="title">Listing Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Clean 2020 Honda Civic with Low Miles"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                        />
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
                            type="number"
                          />
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
                            <Link href="/premium">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                              >
                                Learn More About Premium
                              </Button>
                            </Link>
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
                              <p>
                                <span className="text-muted-foreground">Location:</span>{" "}
                                {formData.location || "Not specified"}
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
                              <p>
                                <span className="text-muted-foreground">Images:</span> {uploadedImages.length}{" "}
                                uploaded
                              </p>
                            </div>
                          </div>
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
                      <Button size="lg" className="px-8" onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            Publish Listing
                            <CheckCircle className="w-4 h-4 ml-2" />
                          </>
                        )}
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
