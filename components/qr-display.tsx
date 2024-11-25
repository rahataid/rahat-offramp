"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy, RefreshCw, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { QRCodeData } from "@/types/offramp"

interface QRDisplayProps {
  data: QRCodeData
  onComplete: () => void
}

export function QRDisplay({ data, onComplete }: QRDisplayProps) {
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate transaction completion after 5 seconds
    const timer = setTimeout(() => {
      setStatus(Math.random() > 0.2 ? "success" : "error")
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative aspect-square w-64">
              {/* Placeholder for QR Code */}
              <div className="h-full w-full rounded-lg bg-secondary" />
              <AnimatePresence>
                {status === "pending" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy QR Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {status !== "pending" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center space-y-4"
          >
            {status === "success" ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="rounded-full bg-green-100 p-3"
                >
                  <Check className="h-6 w-6 text-green-600" />
                </motion.div>
                <h3 className="text-lg font-medium text-green-600">Transaction Complete!</h3>
                <Button onClick={onComplete}>Done</Button>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="rounded-full bg-red-100 p-3"
                >
                  <XCircle className="h-6 w-6 text-red-600" />
                </motion.div>
                <h3 className="text-lg font-medium text-red-600">Transaction Failed</h3>
                <Button variant="outline" onClick={() => setStatus("pending")}>
                  Retry
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

