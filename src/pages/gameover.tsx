import Navbar from "../app/components/NavBar";
import { useRouter } from "next/router";
import { useState } from "react";

export default function GameOverPage() {
  const router = useRouter();
  const { score = 0 } = router.query;
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/submitScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          score,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to submit score");
      }
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Game Over</h1>
      <p>Your final score is: {score}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
