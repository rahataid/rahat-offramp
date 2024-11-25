import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Download, Mail } from 'lucide-react'
import { motion } from "framer-motion"

interface TransactionDetails {
  provider: string
  amount: string
  accountNumber: string
}

export function TransactionConfirmed({ details, onClose }: {
  details: TransactionDetails
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center">Transaction Confirmed!</CardTitle>
          <CardDescription className="text-center">Your offramp request has been successfully processed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Provider:</span>
            <span>{details.provider}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount Sent:</span>
            <span>{details.amount} USDC</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Account Number:</span>
            <span>{details.accountNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Transaction ID:</span>
            <span>{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email Receipt
          </Button>
        </CardFooter>
      </Card>
      <div className="flex justify-center">
        <Button onClick={onClose}>Close</Button>
      </div>
    </motion.div>
  )
}

