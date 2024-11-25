'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function QRDisplayPage() {
  const router = useRouter()
  const [qrCode, setQRCode] = useState('')

  useEffect(() => {
    // Simulating QR code generation
    setQRCode(`
    █████████████████████████████████
    █████████████████████████████████
    ████ ▄▄▄▄▄ █▀█ █▄█▄▄ ▀▄█ ▄▄▄▄▄ ████
    ████ █   █ █▀▀▀█ ▀▄  ▄▀█ █   █ ████
    ████ █▄▄▄█ █▀ █▀▀▄▀▀▄ █▀█ █▄▄▄█ ████
    ████▄▄▄▄▄▄▄█▄▀ ▀▄█▄█ █ █▄▄▄▄▄▄▄████
    ████ ▄▀▀█▄▄ █▄ ▄▄██▄ ▀▀▀ ▀ ▀▄█▄████
    ████▀█▀▀▀▀▄▀▀▄▀▄▀▄▀▄█▄▄▄ ▀▀▀▄ ████
    ████▄█ ▀▄▀▄▄ ▄ █▀█▀█▄█▀█ ▀▀▀█▀████
    ████▄ █▄ █▄▀▀▄██▄▄▄▄██ ▀▄▄▄▀▀▀████
    ████▄▄█   ▄▄▄ ▄ ▄▀▀▀▀▀▄ █▀█ ▄█▄████
    ████ ▄▄▄▄▄ █▄█ ▀▄█ ▄▀▄ ▄ ▄ ▄ ▀████
    ████ █   █ █ ▄ ▄▀█▀██▀▄ ▀▀▀▄▀█████
    ████ █▄▄▄█ █ ▄ ▀▀▀▄▄█▄▄▄▄▀██▀█████
    ████▄▄▄▄▄▄▄█▄██▄▄██▄▄▄█████▄██████
    █████████████████████████████████
    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
    `)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Scan QR Code</h2>
        <pre className="text-xs leading-3 mb-6">{qrCode}</pre>
        <Button
          onClick={() => router.push('/status')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Check Offramp Status
        </Button>
      </motion.div>
    </div>
  )
}

