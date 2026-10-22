import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Copy,
  Check,
  Menu,
  X,
  ArrowUp,
} from "lucide-react";
import Sphere from "./Sphere";
import "./style.css";

const text = {
  zh: {
    nav: ["作品", "关于", "联系"],
    name: "黄文凯",
    heroTop: "商业分析，",
    heroPrefix: "热爱",
    words: ["干活。", "开发。", "游戏。"],
    intro: "UNSW 商业分析研究生，\n一只热爱干活的牛马。",
    explore: "探索我的作品",
    scroll: "向下探索",
    works: "一些正在做的事。",
    worksNote: "日用工具与游戏开发",
    worksLabel: "SELECTED WORK",
    projectTitles: ["本地麻将游戏", "sms-wechat-bridge", "云海拓荒"],
    descriptions: [
      "一款面向本地对局与练习的 3D 麻将游戏，支持四人立直与 17 步模式，集成 AI 对手、AI 语音、听牌提示和多视角牌谱回放，方便练习与复盘；血战到底、三人立直和国标麻将处于后续开发规划中。",
      "自动转发手机端短信信息到指定微信聊天。",
      "一款开发中的单机 2D 像素空岛生存游戏，以“打捞—制造—扩建”为核心循环：通过渔网获取随机物资，制作工具并扩建岛屿，结合种植、集水、仓储和天气系统，逐步建立可持续的食水与资源供给。",
    ],
    categories: ["游戏 / 麻将训练器", "工具 / 信息桥接", "游戏 / 生存探索"],
    repo: "查看 GitHub",
    noLink: "生存类游戏",
    aboutTitle: "你好，我是文凯。",
    aboutText:
      "我是 UNSW 商业分析研究生，一只热爱干活的牛马。目前在做一些日用工具插件和两款游戏开发。",
    skillsLabel: "技能与兴趣",
    skills: ["Python", "SQL", "羽毛球", "星际争霸", "吉他"],
    aboutFoot: "从数据到代码，从工具到游戏。",
    contactTitle: "保持联系。",
    contactText: "可以通过以下方式找到我。",
    copy: "复制邮箱",
    copied: "邮箱已复制",
    copyFail: "请手动复制邮箱",
    back: "回到顶部",
    menu: "打开导航",
    close: "关闭导航",
    skip: "跳至主要内容",
    inspired: "设计灵感",
    sectionWork: "作品",
    sectionAbout: "关于我",
    sectionContact: "联系",
  },
  en: {
    nav: ["Work", "About", "Contact"],
    name: "Wenkai Huang",
    heroTop: "Business analytics.",
    heroPrefix: "Always ",
    words: ["building.", "coding.", "playing."],
    intro:
      "UNSW postgraduate in Business Analytics.\nA workhorse who loves getting things done.",
    explore: "Explore my work",
    scroll: "SCROLL TO EXPLORE",
    works: "A few things I’m building.",
    worksNote: "Everyday tools & game development",
    worksLabel: "SELECTED WORK",
    projectTitles: ["Local Mahjong", "sms-wechat-bridge", "Cloudsea Frontier"],
    descriptions: [
      "A 3D mahjong game for local play and practice, featuring four-player Riichi and 17-step modes, AI opponents, AI voice, tenpai guidance and multi-perspective replay study. Sichuan Blood Battle, three-player Riichi and Chinese Standard Mahjong are planned for future development.",
      "Automatically forwards SMS messages from a phone to a specified WeChat chat.",
      "A single-player 2D pixel-art sky-island survival game in development, built around salvaging, crafting and expansion. Use nets to gather random supplies, craft tools and expand your island, then establish sustainable food, water and resource production through farming, water collection and storage as the weather changes.",
    ],
    categories: [
      "GAME / MAHJONG TRAINER",
      "TOOL / MESSAGE BRIDGE",
      "GAME / SURVIVAL",
    ],
    repo: "View on GitHub",
    noLink: "SURVIVAL GAME",
    aboutTitle: "Hey, I’m Wenkai.",
    aboutText:
      "I’m a postgraduate in Business Analytics at UNSW, and a workhorse who loves getting things done. I’m currently building everyday tools and plugins, alongside two games.",
    skillsLabel: "SKILLS & INTERESTS",
    skills: ["Python", "SQL", "Badminton", "StarCraft", "Guitar"],
    aboutFoot: "From data to code. From tools to games.",
    contactTitle: "Let’s connect.",
    contactText: "Find me at any of the links below.",
    copy: "Copy email",
    copied: "Email copied",
    copyFail: "Please copy the email manually",
    back: "Back to top",
    menu: "Open navigation",
    close: "Close navigation",
    skip: "Skip to main content",
    inspired: "Design inspired by",
    sectionWork: "Work",
    sectionAbout: "About me",
    sectionContact: "Contact",
  },
};

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

function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
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

function App() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("wenkai-lang") === "en" ? "en" : "zh";
    } catch {
      return "zh";
    }
  });
  const [active, setActive] = useState("home");
  const [menu, setMenu] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  const copyTimer = useRef(null);
  const t = text[lang];
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title =
      lang === "zh"
        ? "黄文凯 Wenkai Huang — 商业分析 · 工具 · 游戏"
        : "Wenkai Huang — Business Analytics, Tools & Games";
    document.querySelector('meta[name="description"]').content =
      lang === "zh"
        ? "黄文凯，UNSW 商业分析研究生。探索 Python、SQL、日用工具插件与游戏开发。"
        : "Wenkai Huang, a UNSW Business Analytics postgraduate building everyday tools, plugins and games.";
    try {
      localStorage.setItem("wenkai-lang", lang);
    } catch {
      /* Storage is optional. */
    }
    setCopyState("idle");
  }, [lang]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-25% 0px -45% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      clearTimeout(copyTimer.current);
    };
  }, []);
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        document.querySelector(".mobile-menu-button")?.focus();
      }
    };
    if (menu) document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menu]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("908048126@qq.com");
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState("idle"), 3500);
  }
  const ids = ["work", "about", "contact"];
  const links = [
    "https://github.com/DVDWK812/local-mahjong",
    "https://github.com/DVDWK812/sms-wechat-bridge",
    null,
  ];
  const arts = [<MahjongArt />, <BridgeArt />, <CloudseaArt />];
  return (
    <div className={`site lang-${lang}`}>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header className="site-header">
        <a
          className="logo"
          href="#home"
          aria-label={lang === "zh" ? "黄文凯 — 首页" : "Wenkai Huang — Home"}
        >
          <Logo />
        </a>
        <div className="header-caption">
          WENKAI HUANG<span>PERSONAL PORTFOLIO</span>
        </div>
        <div className="header-actions">
          <div
            className="language-switch"
            role="group"
            aria-label="Language / 语言"
          >
            <button aria-pressed={lang === "zh"} onClick={() => setLang("zh")}>
              中
            </button>
            <span>/</span>
            <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>
              EN
            </button>
          </div>
          <a
            className="header-github icon-button"
            href="https://github.com/DVDWK812"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github size={19} />
          </a>
          <button
            className="mobile-menu-button icon-button"
            aria-label={menu ? t.close : t.menu}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      <aside className="side-rail">
        <nav aria-label={lang === "zh" ? "主导航" : "Main navigation"}>
          {ids.map((id, i) => (
            <a
              key={id}
              className={active === id ? "active" : ""}
              href={`#${id}`}
            >
              <span>{t.nav[i]}</span>
            </a>
          ))}
        </nav>
        <div className="rail-social">
          <a
            href="https://github.com/DVDWK812"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github size={19} />
          </a>
          <a
            href="https://www.linkedin.com/in/wenkaihuang"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:908048126@qq.com"
            aria-label={lang === "zh" ? "发送邮件" : "Send email"}
          >
            <Mail size={19} />
          </a>
        </div>
        <span className="rail-line" />
      </aside>
      {menu && (
        <nav
          className="mobile-nav"
          id="mobile-nav"
          aria-label={lang === "zh" ? "手机导航" : "Mobile navigation"}
        >
          {ids.map((id, i) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              <small>0{i + 1}</small>
              {t.nav[i]}
              <ArrowUpRight size={24} />
            </a>
          ))}
        </nav>
      )}
      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-orb">
            <div className="orb-halo" />
            <Sphere />
            <div className="orb-marker marker-top">
              <span />
              PYTHON / SQL
            </div>
            <div className="orb-marker marker-bottom">
              TOOLS & GAMES
              <span />
            </div>
          </div>
          <div className="hero-copy">
            <Reveal>
              <div className="eyebrow">
                <span className="tiny-line" />
                {t.name}
                <span className="eyebrow-separator">/</span>
                <span>{lang === "zh" ? "WENKAI HUANG" : "黄文凯"}</span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 id="hero-title">
                <span className="hero-top">{t.heroTop}</span>
                <span>
                  {t.heroPrefix}
                  <Decoder words={t.words} lang={lang} />
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="hero-intro">{t.intro}</p>
              <a className="text-link hero-link" href="#work">
                {t.explore}
                <ArrowUpRight size={20} />
              </a>
            </Reveal>
          </div>
          <div className="hero-bottom">
            <a className="scroll-cue" href="#work">
              <span className="scroll-icon">
                <ArrowDown size={15} />
              </span>
              {t.scroll}
            </a>
            <span className="hero-index">
              <i /> DATA. TOOLS. GAMES.
            </span>
          </div>
        </section>
        <section
          className="work-section section-container"
          id="work"
          aria-labelledby="work-title"
        >
          <Reveal className="section-heading">
            <div className="section-kicker">
              <span>01</span>
              {t.worksLabel}
            </div>
            <div className="section-title-row">
              <h2 id="work-title">{t.works}</h2>
              <span className="section-note">{t.worksNote}</span>
            </div>
          </Reveal>
          {t.projectTitles.map((title, i) => (
            <article className={`project project-${i + 1}`} key={title}>
              <Reveal className="project-copy">
                <div className="project-number">
                  <span>0{i + 1}</span>
                  <i />
                </div>
                <p className="project-category">{t.categories[i]}</p>
                <h3>{title}</h3>
                <p className="project-description">{t.descriptions[i]}</p>
                {links[i] ? (
                  <a
                    className="text-link"
                    href={links[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.repo}
                    <ArrowUpRight size={19} />
                  </a>
                ) : (
                  <span className="unlinked-project">
                    <span className="tiny-line" />
                    {t.noLink}
                  </span>
                )}
              </Reveal>
              <Reveal className="project-visual" delay={0.08}>
                {arts[i]}
              </Reveal>
            </article>
          ))}
        </section>
        <section
          className="about-section section-container"
          id="about"
          aria-labelledby="about-title"
        >
          <Reveal className="about-layout">
            <div className="section-kicker">
              <span>02</span>ABOUT ME
            </div>
            <div className="about-content">
              <h2 id="about-title">{t.aboutTitle}</h2>
              <p className="about-body">{t.aboutText}</p>
              <div className="skills">
                <p className="micro-label">{t.skillsLabel}</p>
                <div className="skill-list">
                  {t.skills.map((skill, i) => (
                    <span key={skill}>
                      <small>0{i + 1}</small>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <p className="about-foot">
                <span className="signal-dot" />
                {t.aboutFoot}
              </p>
            </div>
            <div className="about-symbol" aria-hidden="true">
              <span>
                {"{"}
                <i /> {"}"}
              </span>
              <div>DATA × PLAY</div>
            </div>
          </Reveal>
        </section>
        <section
          className="contact-section section-container"
          id="contact"
          aria-labelledby="contact-title"
        >
          <Reveal>
            <div className="section-kicker">
              <span>03</span>GET IN TOUCH
            </div>
            <h2 id="contact-title">
              {t.contactTitle}
              <span className="contact-star" aria-hidden="true">
                ✳
              </span>
            </h2>
            <p className="contact-note">{t.contactText}</p>
            <div className="email-row">
              <a className="email-link" href="mailto:908048126@qq.com">
                908048126@qq.com
                <ArrowUpRight />
              </a>
              <button
                className="copy-button"
                onClick={copyEmail}
                aria-label={t.copy}
                title={t.copy}
              >
                {copyState === "copied" ? (
                  <Check size={18} />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
            <div className="copy-feedback" role="status">
              {copyState === "copied"
                ? t.copied
                : copyState === "failed"
                  ? t.copyFail
                  : ""}
            </div>
            <div className="contact-socials">
              <a
                href="https://github.com/DVDWK812"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} />
                GitHub
                <ArrowUpRight size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/wenkaihuang"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} />
                LinkedIn
                <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>
        </section>
      </main>
      <footer className="footer section-container">
        <span>
          © {new Date().getFullYear()} {t.name}
        </span>
        <a href="https://hamishw.com" target="_blank" rel="noopener noreferrer">
          {t.inspired} Hamish Williams <ArrowUpRight size={12} />
        </a>
        <a className="back-top" href="#home">
          {t.back}
          <ArrowUp size={14} />
        </a>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
