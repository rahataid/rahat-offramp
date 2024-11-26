import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offramp Flow',
  description: 'Convert your cryptocurrency to fiat currency',
}

export default function OfframpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      <div className="mx-auto max-w-2xl px-4 py-16">
        {children}
      </div>
    </div>
  )
}

