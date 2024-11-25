'use client'

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Circle, PlayCircle, RefreshCcw } from 'lucide-react'
import { useState } from "react"
import { Card } from "@/components/ui/card"

export default function OfframpInterface() {
  const [activeEndpoint, setActiveEndpoint] = useState<number | null>(null)
  
  const endpoints = [
    {
      id: 1,
      title: "Create Offramp Request",
      method: "POST",
      path: "/offramp",
      description: "Initiate a new offramp request"
    },
    {
      id: 2, 
      title: "Execute Offramp Request",
      method: "GET",
      path: "/offramp",
      description: "Execute an existing offramp request"
    },
    {
      id: 3,
      title: "Check Offramp Status",
      method: "POST",
      path: "/offramp/actions",
      description: "Check the status of an offramp request"
    },
    {
      id: 4,
      title: "Offramp Provider Actions",
      method: "POST", 
      path: "/offramp/actions",
      description: "Perform provider-specific actions"
    }
  ]

  const providers = [
    {
      name: "KotaniPay",
      status: "active"
    },
    {
      name: "Transak",
      status: "active"  
    },
    {
      name: "Unlimit",
      status: "active"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light tracking-tight">
            Rahat Offramp Interface
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            A modern interface for managing offramp requests and interactions between Rahat users and various payment providers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-light text-slate-700">API Endpoints</h2>
            <div className="space-y-4">
              {endpoints.map((endpoint) => (
                <motion.div
                  key={endpoint.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-colors border-l-4 ${
                      activeEndpoint === endpoint.id
                        ? "border-l-blue-500 bg-blue-50"
                        : "border-l-transparent hover:border-l-blue-200"
                    }`}
                    onClick={() => setActiveEndpoint(endpoint.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{endpoint.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            endpoint.method === "POST" 
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {endpoint.method}
                          </span>
                          <span className="font-mono">{endpoint.path}</span>
                        </div>
                        <p className="text-sm text-slate-600">{endpoint.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-light text-slate-700">Payment Providers</h2>
            <div className="grid gap-4">
              {providers.map((provider, index) => (
                <motion.div
                  key={provider.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {provider.status === "active" ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </motion.div>
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                        <span className="font-medium">{provider.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-slate-100 rounded-full"
                        >
                          <PlayCircle className="w-5 h-5 text-blue-500" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-slate-100 rounded-full"
                        >
                          <RefreshCcw className="w-5 h-5 text-slate-500" />
                        </motion.button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

