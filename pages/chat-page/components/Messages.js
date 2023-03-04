import React, { useEffect, useRef } from "react";
import { Message as MessageType } from "../App";
import Message from "./Message";

export default function Messages({ messages, show }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
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