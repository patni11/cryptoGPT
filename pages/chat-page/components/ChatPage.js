import React, { useState } from 'react';
import Hero from "./Hero";
import Input from "./Input";
import Messages from "./Messages";
import styles from '../ChatPage.module.css';


export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  function addMessage(msg) {
    setMessages((prev) => [...prev, msg]);
  }
  function toggleLoading(value) {
    setLoading(value);
  }


  return (
    <>
      <div
        className="main_cont"
        style={{
          width: "100%",
          margin: "auto",
          height: "100vh",
          position: "relative",
          backgroundColor: "#343540"
        }}
      >
        {messages.length != 0 ? (
          <div
            className="inner_cont"
            style={{
              height: "88%",
              overflowY: "scroll",
            }}
          >
            <Messages show={loading} messages={messages} />
          </div>
        ) : (
          <Hero />
        )}

        <Input
          addMessage={addMessage}
          img=""
        />
      </div>
    </>
  );
}


