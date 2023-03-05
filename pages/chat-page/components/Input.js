import React, { useState } from "react";
import { send } from "../assets/icons";
import styles from '../ChatPage.module.css';

export default function({addMessage, img}) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState();

  async function sendMessage({animalMessage}) {
    console.log("animalMessage: " + animalMessage)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalMessage+"" }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error ||
          new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      // append the response data as a new message
      addMessage({
        msg: data.result,
        me: false,
        img,
        _id: new Date().toString(),
      });
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  function handleInput() {
    // append a message component
    addMessage({
      msg: input,
      me: true,
      img,
      _id: new Date().toString(),
    });

    console.log("sending sendMessage with " + input);
    // send the message to the api    
    sendMessage(input)

    setInput("");
  }
  return (
    <div
      className="botm"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "absolute",
        bottom: "10px",
        width: "100%",
      }}
    >
      <div
        className="input_box"
        style={{
          width: "86%",
          backgroundColor: "#40414f",
          height: "45px",
          borderRadius: "7px",
          marginTop: "8px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <input
          autoFocus={true}
          onKeyDown={(e) => e.keyCode === 13 && input != "" && handleInput()}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          style={{
            width: "97%",
            height: "100%",
            outline: "none",
            border: "none",
            backgroundColor: "transparent",
            color: "white",
            paddingLeft: "8px",
          }}
          placeholder=""
        />
        <button
          onClick={() => handleInput()}
          style={{
            rotate: "90deg",
            marginRight: "13px",
            backgroundColor: "transparent",
            outline: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          {send}
        </button>
      </div>
      <p
        className="hide"
        style={{
          fontSize: "12.6px",
          textAlign: "center",
          marginTop: "19px",
          color: "rgb(185 185 185)",
          maxWidth: "85%",
        }}
      >
        Join us in building the best crypto resource assistant. CryptoGPT is now accepting investors. Contact us today to learn more.
      </p>
    </div>
  );
}