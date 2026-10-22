import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  Github,
  Linkedin,
  Mail,
  Copy,
  Check,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Sphere from "./Sphere";
import {
  Decoder,
  Logo,
  MahjongArt,
  BridgeArt,
  CloudseaArt,
} from "./components";
import text from "./content";
import useChapterScroll, { CHAPTER_IDS } from "./useChapterScroll";

function ChapterReveal({ active, children, className = "" }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ opacity: active ? 1 : 0, y: active || reduced ? 0 : 24 }}
      transition={{
        duration: reduced ? 0 : 0.65,
        delay: active && !reduced ? 0.12 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Chapters() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("wenkai-lang") === "en" ? "en" : "zh";
    } catch {
      return "zh";
    }
  });
  const [menu, setMenu] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  const copyTimer = useRef(null);
  const { scroller, active, goTo } = useChapterScroll();
  const t = text[lang];
  const labels = [
    lang === "zh" ? "首页" : "Home",
    ...t.projectTitles,
    t.sectionAbout,
    t.sectionContact,
  ];
  const nav = ["work", "about", "contact"];
  const links = [
    "https://github.com/DVDWK812/local-mahjong",
    "https://github.com/DVDWK812/sms-wechat-bridge",
    null,
  ];
  const arts = [<MahjongArt />, <BridgeArt />, <CloudseaArt />];

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
      /* Optional browser storage. */
    }
    setCopyState("idle");
  }, [lang]);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  useEffect(() => {
    const escape = (event) => {
      if (event.key === "Escape") {
        setMenu(false);
        document.querySelector(".mobile-menu-button")?.focus();
      }
    };
    if (menu) document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
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
  function navigate(event) {
    const anchor = event.target.closest('a[href^="#"]');
    if (
      !anchor ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    const id = anchor.getAttribute("href").slice(1);
    if (id === "main") {
      event.preventDefault();
      scroller.current?.focus({ preventScroll: true });
      return;
    }
    const index = CHAPTER_IDS.indexOf(id);
    if (index < 0) return;
    event.preventDefault();
    setMenu(false);
    if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
    goTo(index);
  }
  const next = active === CHAPTER_IDS.length - 1 ? 0 : active + 1;

  return (
    <div className={`site lang-${lang}`} onClick={navigate}>
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
          {nav.map((id, i) => (
            <a
              key={id}
              className={
                (
                  i === 0
                    ? active >= 1 && active <= 3
                    : CHAPTER_IDS[active] === id
                )
                  ? "active"
                  : ""
              }
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
          aria-label={lang === "zh" ? "章节导航" : "Chapter navigation"}
        >
          {CHAPTER_IDS.map((id, i) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === i ? "location" : undefined}
            >
              <small>0{i + 1}</small>
              {labels[i]}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      )}
      <main
        id="main"
        className="chapter-scroller"
        ref={scroller}
        tabIndex={-1}
        aria-label={
          lang === "zh"
            ? "分屏主页，向下滚动切换章节"
            : "Full-page portfolio. Scroll to change chapters."
        }
      >
        <section
          className="chapter hero"
          id="home"
          aria-labelledby="hero-title"
        >
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
          <ChapterReveal active={active === 0} className="hero-copy">
            <div className="eyebrow">
              <span className="tiny-line" />
              {t.name}
              <span className="eyebrow-separator">/</span>
              <span>{lang === "zh" ? "WENKAI HUANG" : "黄文凯"}</span>
            </div>
            <h1 id="hero-title">
              <span>{t.heroTop}</span>
              <span>
                {t.heroPrefix}
                <Decoder words={t.words} lang={lang} />
              </span>
            </h1>
            <p className="hero-intro">{t.intro}</p>
            <a className="text-link" href="#work">
              {t.explore}
              <ArrowUpRight size={20} />
            </a>
          </ChapterReveal>
          <div className="hero-signature">
            DATA. TOOLS. GAMES.
            <span />
          </div>
        </section>
        {t.projectTitles.map((title, i) => (
          <section
            className={`chapter project-chapter project-${i + 1}`}
            id={CHAPTER_IDS[i + 1]}
            key={i}
            aria-labelledby={`project-title-${i}`}
          >
            <article className="project-scene">
              <div className="chapter-art" aria-hidden="true">
                {arts[i]}
              </div>
              <div className="scene-shade" aria-hidden="true" />
              <span className="scene-index" aria-hidden="true">
                0{i + 1}
                <span>/ 03</span>
              </span>
              <ChapterReveal
                active={active === i + 1}
                className="project-overlay"
              >
                <div className="project-copy" data-chapter-scroll>
                  <p className="project-category">
                    <span className="tiny-line" />
                    {t.categories[i]}
                  </p>
                  <h2 id={`project-title-${i}`}>{title}</h2>
                  <p className="project-description">{t.descriptions[i]}</p>
                  {links[i] ? (
                    <a
                      className="text-link"
                      href={links[i]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.repo}
                      <ArrowUpRight size={20} />
                    </a>
                  ) : (
                    <span className="unlinked-project">
                      <span className="signal-dot" />
                      {t.noLink}
                    </span>
                  )}
                </div>
              </ChapterReveal>
              <div className="scene-caption" aria-hidden="true">
                <span>{t.worksLabel}</span>
                <span>
                  {i === 0
                    ? "MAHJONG / 3D"
                    : i === 1
                      ? "SMS / WECHAT"
                      : "CLOUDSEA / SURVIVAL"}
                </span>
              </div>
            </article>
          </section>
        ))}
        <section
          className="chapter about-section"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="about-watermark" aria-hidden="true">{`{ }`}</div>
          <ChapterReveal
            active={active === 4}
            className="chapter-body about-content"
          >
            <div className="body-scroll" data-chapter-scroll>
              <div className="section-kicker">
                <span>04</span>ABOUT ME
              </div>
              <h2 id="about-title">{t.aboutTitle}</h2>
              <p className="about-body">{t.aboutText}</p>
              <div className="skills">
                <p className="micro-label">{t.skillsLabel}</p>
                <div className="skill-list">
                  {t.skills.map((skill, i) => (
                    <span key={i}>
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
          </ChapterReveal>
          <div className="about-symbol" aria-hidden="true">
            <span>
              {"{"}
              <i />
              {"}"}
            </span>
            <div>DATA × PLAY</div>
          </div>
        </section>
        <section
          className="chapter contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <ChapterReveal
            active={active === 5}
            className="chapter-body contact-content"
          >
            <div className="body-scroll" data-chapter-scroll>
              <div className="section-kicker">
                <span>05</span>GET IN TOUCH
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
              <footer className="footer">
                <span>
                  © {new Date().getFullYear()} {t.name}
                </span>
                <a
                  href="https://hamishw.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.inspired} Hamish Williams
                  <ArrowUpRight size={12} />
                </a>
              </footer>
            </div>
          </ChapterReveal>
        </section>
      </main>
      <nav
        className="chapter-dots"
        aria-label={lang === "zh" ? "章节索引" : "Chapter index"}
      >
        {labels.map((label, i) => (
          <button
            key={i}
            onClick={() => {
              setMenu(false);
              goTo(i);
            }}
            aria-label={`${String(i + 1).padStart(2, "0")} ${label}`}
            aria-current={active === i ? "step" : undefined}
          >
            <span className="dot-label">{label}</span>
            <span className="chapter-dot" />
          </button>
        ))}
      </nav>
      <div className="chapter-controls">
        <div className="chapter-count">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <i />
          06<small>{labels[active]}</small>
        </div>
        <div className="chapter-buttons">
          <button
            className="previous-chapter"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label={lang === "zh" ? "上一章节" : "Previous chapter"}
          >
            <ChevronUp size={17} />
          </button>
          <button
            className="next-chapter"
            onClick={() => goTo(next)}
            aria-label={
              active === 5
                ? t.back
                : lang === "zh"
                  ? `下一章节：${labels[next]}`
                  : `Next chapter: ${labels[next]}`
            }
          >
            <span>
              {active === 5
                ? t.back
                : lang === "zh"
                  ? "下一章节"
                  : "NEXT CHAPTER"}
            </span>
            {active === 5 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </button>
        </div>
      </div>
      <div className="chapter-progress" aria-hidden="true">
        <span
          style={{ transform: `scaleX(${(active + 1) / CHAPTER_IDS.length})` }}
        />
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {lang === "zh" ? "当前章节" : "Current chapter"} {active + 1} / 6:{" "}
        {labels[active]}
      </span>
    </div>
  );
}
