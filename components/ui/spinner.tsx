import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <motion.div
      className={cn(
        "size-8 rounded-full border-4 border-gray-900 border-t-pink-600",
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  );
};

export default Spinner;
