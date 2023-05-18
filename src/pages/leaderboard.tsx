import { useEffect, useState } from "react";

import Navbar from "../app/components/NavBar";

interface Score {
  id: number;
  name: string;
  score: number;
}

export default function LeaderboardPage() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("/api/getTopScores");
        if (response.ok) {
          const data = await response.json();
          setScores(data);
        } else {
          console.error("Failed to fetch scores");
        }
      } catch (err) {
        console.error("Failed to fetch scores:", err);
      }
    };

    fetchScores();
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={score.id}>
              <td>{index + 1}</td>
              <td>{score.name}</td>
              <td>{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
