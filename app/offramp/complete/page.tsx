import Link from 'next/link'
import { OfframpStep } from '@/components/offramp-step'
import { Button } from '@/components/ui/button'

export default function CompletePage() {
  return (
    <OfframpStep
      title="Transaction Complete"
      description="Your offramp request has been executed successfully."
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Transaction Completed Successfully!</h2>
        <Link href="/offramp">
          <Button>Start New Transaction</Button>
        </Link>
      </div>
    </OfframpStep>
  )
}

