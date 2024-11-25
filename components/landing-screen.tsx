import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, DollarSign, RefreshCcw } from 'lucide-react'

export function LandingScreen({ onStartNewTransaction }: { onStartNewTransaction: () => void }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transaction Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your last 5 transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Transaction #{i + 1}</p>
                  <p className="text-sm text-muted-foreground">Completed on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="ml-auto font-medium">+$
                  {(Math.random() * 1000).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Button onClick={onStartNewTransaction} className="w-full">
        Start New Transaction
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

