import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * A component that animates a number counting up to a target value.
 * @param {{ value: number }} props
 */
function AnimatedCounter({ value }) {
  // A spring that will 'drive' the animation
  const spring = useSpring(0, { mass: 0.8, stiffness: 100, damping: 20 });
  
  // Transform the spring's output into a rounded integer for display
  const displayValue = useTransform(spring, (currentValue) => Math.round(currentValue));

  // When the target `value` prop changes, update the spring's target
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  // Use the motion component to display the animated value
  return <motion.span>{displayValue}</motion.span>;
}

export default AnimatedCounter;