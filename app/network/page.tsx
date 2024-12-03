'use client'

import { Card, CardContent } from "@/components/ui/card"
import { OfframpLayout } from "@/components/offramp-layout"
import { ConnectKitButton } from "connectkit"
import { useAccount } from "wagmi"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion } from "framer-motion"

const networks = [
  {
    id: 1,
    name: "Ethereum",
    icon: "/placeholder.svg?height=32&width=32"
  },
  {
    id: 137,
    name: "Polygon",
    icon: "/placeholder.svg?height=32&width=32"
  }
]

const tokens = [
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "/placeholder.svg?height=32&width=32",
    chains: [1, 137]
  },
  {
    symbol: "USDT",
    name: "Tether",
    icon: "/placeholder.svg?height=32&width=32",
    chains: [1, 137]
  }
]

export default function NetworkPage() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const searchParams = useSearchParams()
  const provider = searchParams.get('provider')
  
  const [selectedChain, setSelectedChain] = useState<number>()
  const [selectedToken, setSelectedToken] = useState<string>()

  const handleContinue = () => {
    if (selectedChain && selectedToken) {
      router.push(`/details?provider=${provider}&chain=${selectedChain}&token=${selectedToken}`)
    }
  }

  return (
    <OfframpLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-light mb-2">Select Network & Token</h2>
          <p className="text-muted-foreground">Choose the network and token you want to offramp</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6">
              <div>
                <h3 className="font-medium mb-4">Select Network</h3>
                <div className="grid grid-cols-2 gap-4">
                  {networks.map(network => (
                    <motion.div key={network.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={selectedChain === network.id ? "default" : "outline"}
                        className="w-full h-auto p-4 flex items-center gap-3"
                        onClick={() => setSelectedChain(network.id)}
                      >
                        <Image
                          src={network.icon}
                          alt={network.name}
                          width={32}
                          height={32}
                        />
                        {network.name}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {selectedChain && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="font-medium mb-4">Select Token</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {tokens.filter(token => token.chains.includes(selectedChain)).map(token => (
                      <motion.div key={token.symbol} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={selectedToken === token.symbol ? "default" : "outline"}
                          className="w-full h-auto p-4 flex items-center gap-3"
                          onClick={() => setSelectedToken(token.symbol)}
                        >
                          <Image
                            src={token.icon}
                            alt={token.name}
                            width={32}
                            height={32}
                          />
                          {token.symbol}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col items-center gap-4 pt-4">
                {!isConnected ? (
                  <ConnectKitButton />
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Button
                      size="lg"
                      onClick={handleContinue}
                      disabled={!selectedChain || !selectedToken}
                      className="w-full"
                    >
                      Continue
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </OfframpLayout>
  )
}

