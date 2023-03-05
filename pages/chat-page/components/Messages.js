import React, { useEffect, useRef } from "react";
import Message from "./Message";
import styles from '../ChatPage.module.css';

export default function Messages({ messages }) {
  const scrollRef = useRef(null);
  useEffect(updateScroll, [messages]);

  function updateScroll() {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      className="msg_cont"
      style={{
        width: "85%",
        margin: "auto",
        marginTop: "2.5vh",
        overflowY: "scroll",
        color: "white"
      }}
    >
      <>
        {messages.map((item) => {
          return (
            <div ref={scrollRef} key={item._id}>
              <Message
                me={item.me}
                msg={item.msg}
                img={item.img}
                _id={item._id}
                key={item._id}
              />
            </div>
          );
        })}
      </>
    </div>
  );
}