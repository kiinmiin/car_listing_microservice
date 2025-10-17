"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Crown, Check, TrendingUp, Eye, Zap, Shield, CreditCard, Lock, ArrowRight, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Header } from '@/components/header'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState("premium")
  const [showPayment, setShowPayment] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<{type: 'upgrade' | 'downgrade', planId: string} | null>(null)
  const { user, refreshUser } = useAuth()
  const router = useRouter()

  // Check if user already has premium subscription
  const isPremiumUser = user?.subscription === 'premium' || user?.subscription === 'spotlight'
  const isFreeUser = user?.subscription === 'free'

  // Set initial selected plan based on user's current subscription
  React.useEffect(() => {
    if (user) {
      if (user.subscription === 'premium') {
        setSelectedPlan('premium')
      } else if (user.subscription === 'spotlight') {
        setSelectedPlan('spotlight')
      } else {
        setSelectedPlan('basic')
      }
    }
  }, [user])

  const plans = [
    {
      id: "basic",
      name: "Basic Listing",
      price: "Free",
      duration: "30 days",
      features: [
        "Standard listing placement",
        "Up to 10 photos",
        "Basic contact form",
        "30-day listing duration",
        "Standard search visibility",
      ],
      popular: false,
      color: "border-border",
    },
    {
      id: "premium",
      name: "Premium Listing",
      price: "$29.99",
      duration: "60 days",
      features: [
        "Featured placement at top",
        "Up to 25 photos",
        "Priority in search results",
        "60-day listing duration",
        "5x more visibility",
        "Premium badge",
        "Enhanced contact options",
        "Listing analytics",
      ],
      popular: true,
      color: "border-accent",
    },
    {
      id: "spotlight",
      name: "Spotlight Listing",
      price: "$49.99",
      duration: "90 days",
      features: [
        "Homepage featured placement",
        "Unlimited photos",
        "Top search priority",
        "90-day listing duration",
        "10x more visibility",
        "Spotlight badge",
        "Direct phone display",
        "Advanced analytics",
        "Social media promotion",
        "Dedicated support",
      ],
      popular: false,
      color: "border-primary",
    },
  ]

  const handlePlanSelection = (planId: string) => {
    if (!user) {
      router.push('/auth/login?redirect=/premium')
      return
    }

    const isPremiumUser = user?.subscription === 'premium' || user?.subscription === 'spotlight'
    const isCurrentPlan = (user?.subscription === 'premium' && planId === 'premium') || 
                         (user?.subscription === 'spotlight' && planId === 'spotlight') || 
                         (!isPremiumUser && planId === 'basic')
    
    if (isCurrentPlan) {
      return // Don't allow selecting current plan
    }

    // Set the selected plan first
    setSelectedPlan(planId)

    if ((isPremiumUser && planId === 'basic') || (user?.subscription === 'spotlight' && planId === 'premium')) {
      // Downgrade - show confirmation dialog
      setPendingAction({ type: 'downgrade', planId })
      setShowDowngradeDialog(true)
    } else if (planId === 'premium' || planId === 'spotlight') {
      // Upgrade - scroll to payment section and show upgrade button
      // The upgrade will be handled by the "Upgrade to Premium Listing" button
      // Scroll to the payment section
      setTimeout(() => {
        const paymentSection = document.getElementById('payment-section')
        if (paymentSection) {
          paymentSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/premium')
      return
    }

    if (selectedPlan === "basic") {
      return
    }

    // Show confirmation dialog for upgrade
    setPendingAction({ type: 'upgrade', planId: selectedPlan })
    setShowUpgradeDialog(true)
  }

  const handleConfirmUpgrade = async () => {
    if (!pendingAction) return
    
    setLoading(true)
    try {
      const dummyListingId = "premium-upgrade-" + Date.now()
      const priceCents = pendingAction.planId === "premium" ? 2999 : 4999
      const { url } = await api.createCheckoutSession(dummyListingId, priceCents, 'usd')
      setShowUpgradeDialog(false)
      setPendingAction(null)
      window.location.href = url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Error processing payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDowngrade = async () => {
    if (!pendingAction) return
    
    setLoading(true)
    try {
      // Call API to downgrade subscription
      await api.request('/auth/downgrade-subscription', {
        method: 'POST',
        body: JSON.stringify({ planId: pendingAction.planId })
      })
      
      // Refresh user data
      await refreshUser()
      
      setShowDowngradeDialog(false)
      setPendingAction(null)
      setSelectedPlan(pendingAction.planId)
      
      // Show success message
      alert('Subscription downgraded successfully. Your premium features will remain active until the end of your current billing period.')
    } catch (error) {
      console.error('Error downgrading subscription:', error)
      alert('Error downgrading subscription. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="premium" />

      <div className="container mx-auto px-4 py-12">
        {!showPayment ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="w-8 h-8 text-accent" />
                <h1 className="text-4xl font-bold text-foreground">Premium Listings</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Get your car noticed by thousands more buyers with premium placement, enhanced visibility, and
                professional features that sell cars 3x faster.
              </p>
              
              {/* Premium User Status */}
              {isPremiumUser && (
                <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800 dark:text-green-200">
                      {user?.subscription === 'spotlight' ? 'Spotlight' : 'Premium'} Member
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    You have {user?.premiumListingsRemaining || 0} premium listings remaining
                  </p>
                  {user?.daysRemaining && user.daysRemaining > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {user.daysRemaining} days remaining
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle>3x More Views</CardTitle>
                  <CardDescription>
                    Premium listings get featured placement and priority in search results
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Featured Placement</CardTitle>
                  <CardDescription>Your car appears at the top of search results and category pages</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Sell Faster</CardTitle>
                  <CardDescription>Premium listings sell on average 3x faster than standard listings</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Pricing Plans */}
            <div className="max-w-6xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">Choose Your Plan</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative overflow-hidden transition-all hover:shadow-lg ${plan.color} ${
                      selectedPlan === plan.id ? "ring-2 ring-accent" : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-accent text-accent-foreground text-center py-2 text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    <CardHeader className={plan.popular ? "pt-12" : ""}>
                      <div className="text-center">
                        <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                          {plan.price !== "Free" && <span className="text-muted-foreground">/{plan.duration}</span>}
                        </div>
                        <CardDescription>{plan.duration} listing duration</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={selectedPlan === plan.id ? "default" : "outline"}
                        onClick={() => handlePlanSelection(plan.id)}
                        disabled={
                          (user?.subscription === 'premium' && plan.id === 'premium') || 
                          (user?.subscription === 'spotlight' && plan.id === 'spotlight') || 
                          (!isPremiumUser && plan.id === 'basic')
                        }
                      >
                        {(user?.subscription === 'premium' && plan.id === 'premium') || 
                         (user?.subscription === 'spotlight' && plan.id === 'spotlight') || 
                         (!isPremiumUser && plan.id === 'basic') ? "Current Plan" :
                         (user?.subscription === 'spotlight' && plan.id === 'premium') ? "Downgrade" :
                         (user?.subscription === 'spotlight' && plan.id === 'basic') ? "Downgrade" :
                         (user?.subscription === 'premium' && plan.id === 'spotlight') ? "Upgrade Available" :
                         (user?.subscription === 'premium' && plan.id === 'basic') ? "Downgrade" :
                         selectedPlan === plan.id ? "Selected" : "Select Plan"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Comparison Table */}
            <div className="max-w-4xl mx-auto mb-16">
              <h3 className="text-2xl font-bold text-center text-foreground mb-8">Feature Comparison</h3>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-medium">Feature</th>
                          <th className="text-center p-4 font-medium">Basic</th>
                          <th className="text-center p-4 font-medium">Premium</th>
                          <th className="text-center p-4 font-medium">Spotlight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Photos allowed", "10", "25", "Unlimited"],
                          ["Listing duration", "30 days", "60 days", "90 days"],
                          ["Search priority", "Standard", "High", "Highest"],
                          ["Featured placement", "❌", "✅", "✅"],
                          ["Homepage featured", "❌", "❌", "✅"],
                          ["Analytics", "❌", "Basic", "Advanced"],
                          ["Premium badge", "❌", "✅", "✅"],
                          ["Social promotion", "❌", "❌", "✅"],
                        ].map(([feature, basic, premium, spotlight], index) => (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="p-4 font-medium">{feature}</td>
                            <td className="p-4 text-center">{basic}</td>
                            <td className="p-4 text-center">{premium}</td>
                            <td className="p-4 text-center">{spotlight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div id="payment-section" className="text-center">
              {isPremiumUser && ((user?.subscription === 'premium' && selectedPlan === 'premium') || (user?.subscription === 'spotlight' && selectedPlan === 'spotlight')) ? (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                        You're already a {user?.subscription === 'spotlight' ? 'Spotlight' : 'Premium'} member!
                      </h3>
                    </div>
                    <p className="text-green-700 dark:text-green-300 mb-4">
                      You have {user?.premiumListingsRemaining || 0} premium listings remaining
                    </p>
                    <Button asChild>
                      <Link href="/dashboard">
                        Go to Dashboard
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Button size="lg" onClick={handleUpgrade} disabled={selectedPlan === "basic" || loading}>
                    {loading ? (
                      "Processing..."
                    ) : selectedPlan === "basic" ? (
                      "Free Plan Selected"
                    ) : (
                      <>
                        Upgrade to {plans.find((p) => p.id === selectedPlan)?.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Secure payment powered by Stripe • 30-day money-back guarantee
                  </p>
                </>
              )}
            </div>
          </>
        ) : (
          /* Payment Form */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">Complete Your Purchase</h1>
              <p className="text-muted-foreground">
                Upgrade to {plans.find((p) => p.id === selectedPlan)?.name} and get your car noticed by more buyers
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-accent" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{plans.find((p) => p.id === selectedPlan)?.name}</span>
                    <span className="font-medium">{plans.find((p) => p.id === selectedPlan)?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Duration</span>
                    <span>{plans.find((p) => p.id === selectedPlan)?.duration}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{plans.find((p) => p.id === selectedPlan)?.price}</span>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <Shield className="w-4 h-4" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>Your payment is secured by Stripe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>

                  <div>
                    <Label htmlFor="card">Card Information</Label>
                    <div className="space-y-2">
                      <Input id="card" placeholder="1234 1234 1234 1234" />
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="MM / YY" />
                        <Input placeholder="CVC" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input id="name" placeholder="Full name on card" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm cursor-pointer">
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="marketing" />
                      <Label htmlFor="marketing" className="text-sm cursor-pointer">
                        Send me marketing updates and promotions
                      </Label>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    <Lock className="w-4 h-4 mr-2" />
                    Complete Purchase
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    <span>Secured by Stripe • SSL Encrypted</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" onClick={() => setShowPayment(false)} className="bg-transparent">
                Back to Plans
              </Button>
            </div>
          </div>
        )}

        {/* Upgrade Confirmation Dialog */}
        <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Upgrade Subscription
              </AlertDialogTitle>
              <AlertDialogDescription>
                You are about to upgrade to the {pendingAction?.planId === 'premium' ? 'Premium' : 'Spotlight'} plan.
                {pendingAction?.planId === 'premium' && (
                  <div className="mt-2 p-3 bg-primary/10 rounded-lg">
                    <p className="font-medium">Premium Plan - $29.99</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Featured placement at top of listings</li>
                      <li>• 5x more visibility in search results</li>
                      <li>• Advanced analytics dashboard</li>
                      <li>• Priority customer support</li>
                    </ul>
                  </div>
                )}
                {pendingAction?.planId === 'spotlight' && (
                  <div className="mt-2 p-3 bg-primary/10 rounded-lg">
                    <p className="font-medium">Spotlight Plan - $49.99</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Everything in Premium</li>
                      <li>• Maximum visibility boost</li>
                      <li>• Featured in homepage carousel</li>
                      <li>• Dedicated account manager</li>
                    </ul>
                  </div>
                )}
                <p className="mt-3 text-sm text-muted-foreground">
                  You will be redirected to our secure payment processor to complete the upgrade.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmUpgrade}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Downgrade Confirmation Dialog */}
        <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Downgrade Subscription
              </AlertDialogTitle>
              <AlertDialogDescription>
                You are about to downgrade to the {pendingAction?.planId === 'premium' ? 'Premium' : 'Basic'} plan. This will affect your current premium features.
                <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="font-medium text-orange-800 dark:text-orange-200">What happens when you downgrade:</p>
                  <ul className="text-sm mt-1 space-y-1 text-orange-700 dark:text-orange-300">
                    <li>• Your premium features will remain active until the end of your current billing period</li>
                    <li>• Your listings will return to standard placement</li>
                    {pendingAction?.planId === 'premium' ? (
                      <>
                        <li>• You'll lose access to advanced analytics and homepage carousel features</li>
                        <li>• You'll have 5 premium listings instead of 10</li>
                      </>
                    ) : (
                      <li>• You'll lose access to advanced analytics</li>
                    )}
                    <li>• You can upgrade again at any time</li>
                  </ul>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Are you sure you want to proceed with the downgrade?
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>
                Keep {user?.subscription === 'spotlight' ? 'Spotlight' : 'Premium'}
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmDowngrade}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading ? 'Processing...' : 'Yes, Downgrade'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  )
}
