import styles from "./index.module.css";
import * as React from "react";
import { Header } from "../components/Header";
import initializeChatClient, {
  chatClient,
  chatEventListeners,
  createInvite,
  message,
} from "../utils/ChatUtils";
import { useAccount } from "wagmi";
import { signMessage } from "@wagmi/core";
import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { getBalance } from "./api/infura";
import { ethers, BigNumber } from 'ethers';
import { getMyAddress } from "../utils/wagmi";
import { Web3Modal } from "@web3modal/react";
import { findBestMatch } from "string-similarity";
import { findMatch } from "./api/findSimilarity";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const { address, isConnected } = useAccount();
  const initialized = initializeChatClient();

  const registerChatClient = useCallback(
    async (address) => {
      console.log("registeringAddress: ", address);

      try {
        await chatClient?.register({
          account: `eip155:1:${address}`,
          onSign: async (message) => {
            console.log("[Chat] signing message.....", message);
            return signMessage({ message });
          },
        });
        console.log(
          "[Chat] registered address %s on keyserver",
          `eip155:1:${address}`
        );
      } catch (error) {
        console.log("error: ", error);
      }
    },
    [signMessage]
  );

  chatEventListeners(initialized);

  useEffect(() => {
    console.log("Chat Client Initialized: ", initialized);
    console.log("User Address", address);
  }, [address, initialized]);

  async function onSubmit(event) {
    event.preventDefault();
    let balance = ""
    const targetStrings = [
      "latest balance",
      "current balance",
      "pending balance",
      "earliest balance"
    ]
    const match = findMatch(animalInput, targetStrings)
    console.log("match: " + JSON.stringify(match))
    if ((match.target === "latest balance" || match.target === "current balance") && match.rating > 0.7) {
      balance = await getBalance(address, "latest");
      const newBigNumber = BigNumber.from(balance)
      const convBalance = ethers.utils.formatEther(newBigNumber.toString())
      setResult("Your latest wallet balance is " + convBalance + " ETH.")
      setAnimalInput("");
      console.log('latest balance');
    } else if (match.target === "pending balance" && match.rating > 0.7) {
      balance = await getBalance(address, "pending");
      const newBigNumber = BigNumber.from(balance)
      const convBalance = ethers.utils.formatEther(newBigNumber.toString())
      setResult("Your pending wallet balance is " + convBalance + " ETH.")
      setAnimalInput("");
      console.log('pending balance');
    } else if (match.target === "earliest balance" && match.rating > 0.7) {
      balance = await getBalance(address, "earliest");
      const newBigNumber = BigNumber.from(balance)
      const convBalance = ethers.utils.formatEther(newBigNumber.toString())
      setResult("Your earliest wallet balance is " + convBalance + " ETH.")
      setAnimalInput("");
      console.log('earliest balance');
    } else {
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

  }

  return (
    <div>
      <Header></Header>
      <main className={styles.main}>
        <h3>Crypto GPT</h3>
        {!isConnected ? (
          <div>Connect your wallet to start</div>
        ) : (
          <>
            <div className="flex justify-center items-center flex-col m-8">
              <button
                disabled={!address && !initialized}
                onClick={() => registerChatClient(address)}
                className="bg-blue-500  text-white font-bold py-2 px-4 rounded items-center ml-2"
              >
                Register Self
              </button>
              <button
                disabled={!address}
                // Hard Coded from a react-chat-app.
                // ToDo: Add UseState and hook it to a text input
                onClick={() =>
                  createInvite(
                    address,
                    "0x5621b3d8C7F87E833430ed5c9Ff1896630821139"
                  )
                }
                className="bg-blue-500 mt-4  text-white font-bold py-2 px-4 rounded items-center ml-2"
              >
                Invite betwen Peers
              </button>
            </div>

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
          </>
        )}
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}