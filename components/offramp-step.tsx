import { motion } from "framer-motion";

interface OfframpStepProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function OfframpStep({
  title,
  description,
  children,
}: OfframpStepProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8 text-center'>
        <h1 className='text-4xl font-bold tracking-tight text-gray-900 mb-2'>
          {title}
        </h1>
        <p className='text-lg text-gray-600'>{description}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}>
        {children}
      </motion.div>
    </>
  );
}
