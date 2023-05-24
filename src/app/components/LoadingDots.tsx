import { useEffect, useState } from "react";

const LoadingDots: React.FC = () => {
  const [dots, setDots] = useState("...");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((dots) => (dots.length < 5 ? dots + "." : "."));
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return <span>{dots}</span>;
};

export default LoadingDots;
