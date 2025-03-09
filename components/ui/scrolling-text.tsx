"use client";
import * as motion from "motion/react-client";

const ScrollingText = ({ text }: { text: string }) => {
  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className="whitespace-nowrap"
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}
      >
        {text}
      </motion.div>
    </div>
  );
};

export default ScrollingText;
