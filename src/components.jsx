import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import starryNight from "./assets/starry-night-cloudsea.webp";

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
      </div>
      <div className="tile tile-center tile-white" />
      <div className="tile tile-right">
        <span>中</span>
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
      <img
        className="starry-night-image"
        src={starryNight}
        alt=""
        width="1672"
        height="941"
        decoding="async"
      />
      <div className="art-bottom">
        <span>SURVIVAL / EXPLORATION</span>
        <span>云 · 海</span>
      </div>
    </div>
  );
}

function FinScopeArt() {
  const signals = [
    [302, 126],
    [414, 99],
    [525, 126],
    [546, 230],
    [464, 278],
    [330, 253],
    [281, 206],
  ];
  return (
    <div className="project-art finscope-art" aria-hidden="true">
      <svg className="finscope-graphic" viewBox="0 0 640 410" fill="none">
        <defs>
          <linearGradient
            id="fs-panel"
            x1="176"
            y1="45"
            x2="588"
            y2="351"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#192f35" />
            <stop offset="1" stopColor="#0a1a22" />
          </linearGradient>
          <radialGradient id="fs-hub">
            <stop stopColor="#174b4b" />
            <stop offset="1" stopColor="#0e232a" />
          </radialGradient>
          <pattern
            id="fs-grid"
            width="19"
            height="19"
            patternUnits="userSpaceOnUse"
          >
            <path d="M19 0H0V19" stroke="#81dfc7" strokeOpacity=".1" />
          </pattern>
        </defs>
        <path
          d="M70 65h64M102 33v64M548 370h53M574 343v54"
          stroke="#9ae8ce"
          strokeOpacity=".25"
        />
        <rect
          x="176"
          y="39"
          width="424"
          height="313"
          rx="19"
          fill="url(#fs-panel)"
          stroke="#4b7774"
        />
        <rect
          x="191"
          y="81"
          width="394"
          height="255"
          rx="10"
          fill="url(#fs-grid)"
        />
        <path d="M176 77h424" stroke="#456763" strokeOpacity=".58" />
        <circle cx="199" cy="58" r="3" fill="#92efd1" />
        <text x="211" y="61" fill="#acd2c9" className="fs-art-label">
          FINSCOPE / ANALYSIS WORKSPACE
        </text>
        <text
          x="576"
          y="61"
          fill="#8ad4bd"
          textAnchor="end"
          className="fs-art-label"
        >
          LOCAL
        </text>
        <circle
          cx="414"
          cy="183"
          r="108"
          stroke="#70c9b3"
          strokeOpacity=".15"
        />
        <circle
          cx="414"
          cy="183"
          r="77"
          stroke="#70c9b3"
          strokeOpacity=".22"
          strokeDasharray="3 6"
        />
        {signals.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <path
              d={`M414 183L${x} ${y}`}
              stroke="#76cbb5"
              strokeOpacity=".43"
            />
            <circle cx={x} cy={y} r="11" fill="#122e34" stroke="#438b80" />
            <circle cx={x} cy={y} r="3.3" fill="#91dfc7" />
          </g>
        ))}
        <circle cx="414" cy="183" r="47" fill="url(#fs-hub)" stroke="#8bedd0" />
        <path
          d="M386 186h11l6-12 9 23 9-30 8 19h13"
          stroke="#9cf1d7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="32"
          y="108"
          width="203"
          height="170"
          rx="13"
          fill="#0e2129"
          stroke="#547b78"
        />
        <text x="51" y="133" fill="#a9d3ca" className="fs-art-label">
          NEWS EXPLORER
        </text>
        {[155, 189, 223].map((y, i) => (
          <g key={y}>
            <rect x="49" y={y} width="168" height="26" rx="5" fill="#1b3239" />
            <circle
              cx="62"
              cy={y + 13}
              r="3"
              fill={i === 1 ? "#abc4db" : "#8bdcc4"}
            />
            <path
              d={`M75 ${y + 10}h${[80, 102, 68][i]}m${-[80, 102, 68][i]} 7h${[51, 57, 44][i]}`}
              stroke="#81a6a6"
              strokeOpacity=".72"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        ))}
        <rect
          x="345"
          y="304"
          width="214"
          height="60"
          rx="10"
          fill="#112a31"
          stroke="#4b827c"
        />
        <text x="362" y="323" fill="#92cbbd" className="fs-art-label">
          LOCAL MODELS
        </text>
        <text x="362" y="348" fill="#dcf3ec" className="fs-art-model">
          FinBERT + MiniLM
        </text>
      </svg>
    </div>
  );
}

export { Decoder, Logo, MahjongArt, BridgeArt, CloudseaArt, FinScopeArt };
