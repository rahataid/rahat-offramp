'use client'

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { OfframpLayout } from "@/components/offramp-layout"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2 } from 'lucide-react'

export default function ExecutePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hash = searchParams.get('hash')

  return (
    <OfframpLayout>
      <div className="grid gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-2">Offramp Complete</h2>
          <p className="text-muted-foreground">Your offramp request has been submitted successfully</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 text-center">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Transaction Confirmed</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your funds are being processed and will be transferred to your bank account shortly
                </p>
                <div className="p-4 bg-muted rounded-lg break-all text-xs">
                  Transaction Hash: {hash}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-6 py-4">
            <Button 
              onClick={() => router.push('/providers')}
              size="lg"
              className="w-full"
            >
              Start New Offramp
            </Button>
          </CardFooter>
        </Card>
      </div>
    </OfframpLayout>
  )
}

