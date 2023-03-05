import React from "react";
import { alert, sun, thunder } from "../assets/icons";
import styles from '../ChatPage.module.css';

export default function Hero() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <h1 style={{ marginTop: "18vh", marginBottom: "5vh", color: "#ECECF1", fontFamily: 'Questrial' }}>CryptoGPT</h1>
      <div
        className="cols"
        style={{ display: "flex", flexDirection: "row", gap: "58px" }}
      >
        <div
          className="row"
          style={{
            width: "225px",
            height: "150px",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#ECECF1"
          }}
        >
          {sun}
          <p style={{ fontSize: "18px", marginTop: "5px" }}>Examples</p>
          <div
            style={{
              backgroundColor: "#444653",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              lineHeight: "18px",
              marginTop: "18px",
              fontSize: "14px",
              borderRadius: "10px",
            }}
          >
            "What is the price of Ethereum?"
          </div>
          <div
            className=""
            style={{
              backgroundColor: "#444653",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              lineHeight: "18px",
              fontSize: "14px",
              borderRadius: "10px",
            }}
          >
            "Vitalik Coin?"
          </div>
          <div
            style={{
              backgroundColor: "#444653",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              lineHeight: "18px",
              fontSize: "14px",
              borderRadius: "10px",
            }}
          >
            "What is the total market cap of the crypto industry?"
          </div>
        </div>
        <div
          className="row hiderow"
          style={{
            width: "225px",
            height: "150px",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#ECECF1"
          }}
        >
          {thunder}
          <p style={{ fontSize: "18px", marginTop: "5px" }}>Capabilities</p>
          <div
            className="hiderow"
            style={{
              backgroundColor: "#444653",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              fontSize: "14px",
              lineHeight: "18px",
              borderRadius: "10px",
            }}
          >
            Allows user to ask questions about real-time market data, something ChatGPT doesn't
          </div>
          <div
            style={{
              backgroundColor: "#444653",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              fontSize: "14px",
              lineHeight: "18px",
              borderRadius: "10px",
            }}
          >
            User can quickly fetch on-chain info using natural language
          </div>
          <div
            className="hiderow"
            style={{
              backgroundColor: "#444653",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              fontSize: "14px",
              lineHeight: "18px",
              borderRadius: "10px",
            }}
          >
            Remembers what user said earlier in the conversation
          </div>
        </div>
        <div
          className="row hiderow"
          style={{
            width: "225px",
            height: "150px",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#ECECF1"
          }}
        >
          {alert}
          <p style={{ fontSize: "18px", marginTop: "5px" }}>Limitations</p>
          <div
            className="hiderow"
            style={{
              backgroundColor: "#444653",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              fontSize: "14px",
              lineHeight: "18px",
              borderRadius: "10px",
            }}
          >
            Additional API integrations are coming, more complex queries will be available
          </div>
          <div
            className="hiderow"
            style={{
              backgroundColor: "#444653",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              fontSize: "14px",
              lineHeight: "18px",
              borderRadius: "10px",
            }}
          >
            NFT queries soon
          </div>
          <div
            className="hiderow"
            style={{
              backgroundColor: "#444653",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              fontSize: "14px",
              lineHeight: "18px",
              borderRadius: "10px",
            }}
          >
            On-chain wallet to wallet comparison is coming
          </div>
        </div>
      </div>
    </div>
  );
}