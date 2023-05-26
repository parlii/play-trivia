import { useEffect, useState } from "react";

interface LoadingDotsProps {
  dotLength: number;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ dotLength }) => {
  const [dots, setDots] = useState("...");

  if (dotLength > 9 || dotLength < 1) {
    dotLength = 9;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((dots) => (dots.length < dotLength ? dots + "." : "."));
    }, 500);

    return () => clearInterval(intervalId);
  }, [dotLength]);

  return <span>{dots}</span>;
};

export default LoadingDots;
