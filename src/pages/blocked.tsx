import styles from "@/styles/Home.module.css";

export default function Blocked() {
  return (
    <div>
      <main className={styles.main}>
        <h3>Too many requests. Access blocked. Try again later!</h3>
      </main>
    </div>
  );
}
