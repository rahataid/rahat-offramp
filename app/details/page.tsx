'use client'

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { OfframpLayout } from "@/components/offramp-layout"
import { useRouter, useSearchParams } from "next/navigation"
import { getProviderById } from "@/providers"
import { useState } from "react"
import { ProviderFormData } from "@/types/provider"

export default function DetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const providerId = searchParams.get('provider')
  const chain = searchParams.get('chain')
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState<ProviderFormData | null>(null)

  const provider = providerId ? getProviderById(providerId) : null

  if (!provider) {
    return <div>Invalid provider</div>
  }

  const handleSubmit = (data: ProviderFormData) => {
    setFormData(data)
    const params = new URLSearchParams(searchParams)
    Object.entries(data).forEach(([key, value]) => {
      params.append(key, value)
    })
    router.push(`/send?${params.toString()}`)
  }

  const FormComponent = provider.FormComponent

  return (
    <OfframpLayout>
      <div className="grid gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-2">Fill Offramp Details</h2>
          <p className="text-muted-foreground">Enter your details for {provider.name}</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <FormComponent onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </OfframpLayout>
  )
}

