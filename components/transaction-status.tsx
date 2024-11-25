import * as React from "react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const stages = ["Pending", "Processing", "Completed"]

export function TransactionStatus({ onComplete }: { onComplete: () => void }) {
  const [currentStage, setCurrentStage] = React.useState(0)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStage < stages.length - 1) {
        setCurrentStage(currentStage + 1)
        setProgress((currentStage + 1) * (100 / (stages.length - 1)))
      } else {
        onComplete()
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [currentStage, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">Transaction Status</h2>
        <p className="text-muted-foreground">Your transaction is being processed.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Current Status: {stages[currentStage]}</CardTitle>
          <CardDescription>Estimated time: {(stages.length - currentStage) * 2} minutes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between">
            {stages.map((stage, index) => (
              <div
                key={stage}
                className={`flex flex-col items-center ${
                  index <= currentStage ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mb-2 ${
                    index <= currentStage ? "bg-primary" : "bg-muted"
                  }`}
                />
                <span className="text-sm">{stage}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

