import Navbar from "@/app/components/NavBar";
import { useRouter } from "next/router";

export default function GameOverPage() {
  const router = useRouter();
  const { score = 0 } = router.query;

  const handleRestart = () => {
    router.push("/");
  };

  return (
    <div>
      <Navbar />
      <h1>Game Over</h1>
      <p>Your final score is: {score}</p>
      <button onClick={handleRestart}>Restart</button>
    </div>
  );
}
