'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function ExecutionPage() {
  const [isSuccess, setIsSuccess] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Offramp Execution</h2>
        {isSuccess ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-green-600 mb-4">Offramp Executed Successfully</p>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-red-600 mb-4">Offramp Execution Failed</p>
          </motion.div>
        )}
        <div className="space-y-4 text-left mb-6">
          <h3 className="text-lg font-semibold">Transaction Details</h3>
          
<ul className="list-disc list-inside">
            <li>Transaction ID: 1234567890</li>
            <li>Amount: 1000 USDT</li>
            <li>Provider: KotaniPay</li>
            <li>Execution Time: 2024-11-25 15:45:30</li>
          </ul>
        </div>
        <Link href="/">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

