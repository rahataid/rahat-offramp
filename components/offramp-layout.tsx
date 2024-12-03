"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const steps = [
  { path: "/providers", label: "Select Provider" },
  { path: "/network", label: "Select Network" },
  { path: "/details", label: "Fill Details" },
  { path: "/send", label: "Send Crypto" },
  { path: "/status", label: "Track Status" },
];

export function OfframpLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) =>
    pathname.includes(step.path)
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='container max-w-6xl py-8'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-8'>
          <h1 className='text-4xl font-light text-center mb-8'>
            Crypto Offramp
          </h1>
          <div className='flex justify-center items-center gap-4'>
            {steps.map((step, index) => (
              <div key={step.path} className='flex items-center'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-light",
                    currentStepIndex >= index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                  {index + 1}
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 + 0.05 }}
                    className={cn(
                      "h-0.5 w-16",
                      currentStepIndex > index ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='max-w-2xl mx-auto'>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
