'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default function StatusPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Pending')

  const getStatusIcon = () => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'In Progress':
        return <Clock className="w-8 h-8 text-yellow-500" />
      default:
        return <AlertTriangle className="w-8 h-8 text-red-500" />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Offramp Status</h2>
        <div className="flex items-center justify-center mb-6">
          {getStatusIcon()}
          <span className="ml-2 text-xl font-semibold">{status}</span>
        </div>
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <ul className="list-disc list-inside">
            <li>Request created: 2024-11-25 14:30:00</li>
            <li>Provider selected: KotaniPay</li>
            <li>Amount: 1000 USDT</li>
          </ul>
        </div>
        <div className="space-y-4">
          <Button
            onClick={() => setStatus('In Progress')}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Provider Action
          </Button>
          <Button
            onClick={() => router.push('/execution')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Execute Offramp
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

