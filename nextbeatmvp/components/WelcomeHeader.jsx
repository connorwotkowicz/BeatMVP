'use client'

import React, { useState, useEffect } from "react";

const messages = [
  "Welcome to BeatSeq"
];

const WelcomeHeader = () => {
  const [index, setIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("fade-in");

  useEffect(() => {
    let fadeOutTimeout;
    let nextMessageTimeout;

    fadeOutTimeout = setTimeout(() => {
      setFadeClass("fade-out");
    }, 2000); 

    nextMessageTimeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % messages.length);
      setFadeClass("fade-in");
    }, 2400); 

    return () => {
      clearTimeout(fadeOutTimeout);
      clearTimeout(nextMessageTimeout);
    };
  }, [index]);

  return (
    <div className="welcome-wrapper">
      <h1 className={`welcome-header ${fadeClass}`}>
        <span className="header-text">{messages[index]}</span>
      </h1>
    </div>
  );
};

export default WelcomeHeader;
