'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Crown, ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"

export default function PaymentSuccessPage() {
  const { user, refreshUser } = useAuth()
  const [processing, setProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processPayment = async () => {
      if (!user) return
      
      try {
        // Simulate webhook call to update subscription
        await api.request('/stripe/test-webhook', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.userId,
            listingId: 'premium-upgrade-' + Date.now(),
            amountTotal: 2999 // $29.99
          })
        })
        
        // Refresh user data to get updated subscription
        await refreshUser()
        setProcessing(false)
      } catch (err) {
        console.error('Error processing payment:', err)
        setError('Failed to process subscription upgrade')
        setProcessing(false)
      }
    }

    processPayment()
  }, [user, refreshUser])
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Crown className="w-5 h-5 text-accent" />
            {processing ? 'Processing...' : error ? 'Payment Error' : 'Payment Successful!'}
          </CardTitle>
          <CardDescription>
            {processing 
              ? 'Updating your subscription...' 
              : error 
                ? error
                : 'Your subscription has been upgraded to Premium. You now have access to premium features!'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1 text-left">
              <li>• Your listing is now featured at the top</li>
              <li>• Premium badge added to your car</li>
              <li>• 5x more visibility in search results</li>
              <li>• Analytics dashboard now available</li>
            </ul>
          </div>

          {!processing && !error && (
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/dashboard?payment=success">
                  View Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground">Receipt sent to your email • Questions? Contact support</p>
        </CardContent>
      </Card>
    </div>
  )
}
