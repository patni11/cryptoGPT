import { useState } from "react";
import styles from "./index.module.css";
import * as React from "react";
import { Header } from "../components/Header";
import { useAccount } from "wagmi";

export default function Home() {
  const { _, isConnected } = useAccount();

  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error ||
          new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Header></Header>
      <main className={styles.main}>
        <h3>Crypto GPT</h3>
        {!isConnected ? (
          <div>Connect your wallet to start</div>
        ) : (
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="animal"
              placeholder="Enter a query for price of any crypto"
              value={animalInput}
              onChange={(e) => setAnimalInput(e.target.value)}
            />
            <input type="submit" value="Submit" />
          </form>
        )}
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
