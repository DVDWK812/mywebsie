import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";

function Decoder({ words, lang }) {
  const element = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    let frame,
      timer,
      wordIndex = 0;
    const chars = "01アイウカキクXYZ/#%<>+";
    const display = () => {
      const word = words[wordIndex % words.length];
      if (reduced) {
        element.current.textContent = word;
        return;
      }
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / 880, 1);
        element.current.textContent = Array.from(word)
          .map((char, i) =>
            i < progress * word.length
              ? char
              : chars[Math.floor(Math.random() * chars.length)],
          )
          .join("");
        if (progress < 1) frame = requestAnimationFrame(tick);
        else
          timer = setTimeout(() => {
            wordIndex++;
            display();
          }, 3500);
      };
      frame = requestAnimationFrame(tick);
    };
    display();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [lang, reduced, words]);
  return (
    <span className="decoded-word">
      <span className="sr-only">{words[0]}</span>
      <span ref={element} aria-hidden="true">
        {words[0]}
      </span>
    </span>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 48 38" fill="none" aria-hidden="true">
      <path
        d="M4 8L14 30L24 13L34 30L44 8"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="miter"
      />
      <path d="M24 4H34" stroke="var(--accent)" strokeWidth="3" />
    </svg>
  );
}

function MahjongArt() {
  return (
    <div className="project-art mahjong-art" aria-hidden="true">
      <span className="art-corner">LOCAL MAHJONG</span>
      <span className="art-cross cross-a">+</span>
      <span className="art-cross cross-b">+</span>
      <div className="table-circle circle-one" />
      <div className="table-circle circle-two" />
      <div className="tile tile-left">
        <span>發</span>
        <small>MAHJONG</small>
      </div>
      <div className="tile tile-center">
        <div className="tile-dots">
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      </div>
      <div className="tile tile-right">
        <span>中</span>
        <small>MAHJONG</small>
      </div>
      <div className="art-bottom">
        <span>立直 · 血战到底 · 国标</span>
        <span>01 — 03</span>
      </div>
    </div>
  );
}
function BridgeArt() {
  return (
    <div className="project-art bridge-art" aria-hidden="true">
      <span className="art-corner">SMS → WECHAT</span>
      <div className="bridge-grid" />
      <div className="message-node sms-node">
        <Mail size={28} />
        <span>SMS</span>
      </div>
      <div className="bridge-line">
        <span />
        <span />
        <span />
        <ArrowRight size={23} />
      </div>
      <div className="message-node wechat-node">
        <svg viewBox="0 0 40 34">
          <path d="M24 14c0 7-6 12-13 12l-6 4 1-7C2 21 0 18 0 14 0 7 5 2 12 2S24 7 24 14Z" />
          <path d="M40 22c0 6-5 10-11 10l-5-2-5 2 1-6c-2-2-3-4-3-6 0-6 5-10 11-10s12 5 12 12Z" />
          <circle cx="8" cy="12" r="1.5" className="chat-dot" />
          <circle cx="16" cy="12" r="1.5" className="chat-dot" />
          <circle cx="25" cy="20" r="1.3" className="chat-dot" />
          <circle cx="32" cy="20" r="1.3" className="chat-dot" />
        </svg>
        <span>WeChat</span>
      </div>
      <div className="bridge-caption">
        <span className="signal-dot" /> sms-wechat-bridge
      </div>
      <div className="art-bottom">
        <span>MESSAGE BRIDGE</span>
        <span>SMS / 微信</span>
      </div>
    </div>
  );
}
function CloudseaArt() {
  return (
    <div className="project-art cloudsea-art" aria-hidden="true">
      <span className="art-corner">CLOUDSEA FRONTIER</span>
      <div className="landscape-sun" />
      <div className="mountain mountain-back" />
      <div className="mountain mountain-mid" />
      <div className="sea-mist" />
      <div className="mountain mountain-front" />
      <div className="landscape-title">
        云海拓荒<span>CLOUDSEA FRONTIER</span>
      </div>
      <div className="art-bottom">
        <span>SURVIVAL / EXPLORATION</span>
        <span>云 · 海</span>
      </div>
    </div>
  );
}

export { Decoder, Logo, MahjongArt, BridgeArt, CloudseaArt };
