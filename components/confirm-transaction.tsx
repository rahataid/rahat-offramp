import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { motion } from "framer-motion"

interface TransactionDetails {
  provider: string
  amount: string
  accountNumber: string
}

export function ConfirmTransaction({ details, onConfirm, onEdit }: {
  details: TransactionDetails
  onConfirm: () => void
  onEdit: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">Confirm Transaction Details</h2>
        <p className="text-muted-foreground">Please review your transaction details before confirming.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
          <CardDescription>Review the details of your offramp request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Provider:</span>
            <span className="flex items-center">
              {details.provider === 'kotanipay' && <Icons.kotanipay className="mr-2 h-4 w-4" />}
              {details.provider === 'transak' && <Icons.transak className="mr-2 h-4 w-4" />}
              {details.provider === 'unlimit' && <Icons.unlimit className="mr-2 h-4 w-4" />}
              {details.provider}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount:</span>
            <span>{details.amount} USDC</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Account Number:</span>
            <span>{details.accountNumber}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onEdit}>Edit Details</Button>
          <Button onClick={onConfirm}>Confirm Transaction</Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

