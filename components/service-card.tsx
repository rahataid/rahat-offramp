"use client"

import { motion } from "framer-motion"
import { Check } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { ServiceProvider } from "@/types/offramp"

interface ServiceCardProps extends ServiceProvider {
  selected: boolean
  onSelect: (id: string) => void
}

export function ServiceCard({ id, name, logo, description, selected, onSelect }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        className={cn(
          "relative cursor-pointer transition-colors",
          selected ? "border-primary" : "hover:border-primary/50"
        )}
        onClick={() => onSelect(id)}
      >
        <CardContent className="p-6">
          <RadioGroup>
            <div className="flex items-start space-x-4">
              <RadioGroupItem value={id} id={id} className="mt-1" checked={selected} />
              <Label htmlFor={id} className="flex-1 cursor-pointer space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold leading-none">{name}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <img src={logo} alt={name} className="h-12 w-12 object-contain" />
                </div>
              </Label>
            </div>
          </RadioGroup>
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-4 h-6 w-6 rounded-full bg-primary text-primary-foreground"
            >
              <Check className="h-6 w-6 p-1" />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

