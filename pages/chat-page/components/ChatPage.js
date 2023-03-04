import React, { useState } from 'react';
import Hero from "./Hero";
import Input from "./Input";
import Messages from "./Messages";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatloading] = useState(true);
  const [auth, setAuth] = useState(() => {
    const user = localStorage.getItem("auth");
    if (!user) return undefined;
    return JSON.parse(user);
  });

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
          width: "50%",
          margin: "auto",
          height: "100vh",
          position: "relative",
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


