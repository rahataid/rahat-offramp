import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Offramp Platform</h1>
        <p className="text-xl text-gray-600">Easily request and execute offramps for your tokens</p>
        <Link href="/create-request">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Create Offramp Request
          </Button>
        </Link>
      </div>
    </div>
  )
}

