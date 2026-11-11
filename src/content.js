export const projects = [
  {
    id: "work",
    repo: "https://github.com/DVDWK812/local-mahjong",
    caption: "MAHJONG / 3D",
  },
  {
    id: "sms-wechat",
    repo: "https://github.com/DVDWK812/sms-wechat-bridge",
    caption: "SMS / WECHAT",
  },
  { id: "cloudsea", caption: "CLOUDSEA / SURVIVAL" },
  {
    id: "finscope",
    repo: "https://github.com/DVDWK812/Finscope",
    showcase: "https://finscope-dvdwk812.streamlit.app/",
    caption: "PYTHON / STREAMLIT / SQLITE",
  },
];

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
    projects: {
      work: {
        title: "本地麻将游戏",
        category: "游戏 / 麻将训练器",
        description:
          "一款面向本地对局与练习的 3D 麻将游戏，支持四人立直与 17 步模式，集成 AI 对手、AI 语音、听牌提示和多视角牌谱回放，方便练习与复盘；血战到底、三人立直和国标麻将处于后续开发规划中。",
      },
      "sms-wechat": {
        title: "sms-wechat-bridge",
        category: "工具 / 信息桥接",
        description: "自动转发手机端短信信息到指定微信聊天。",
      },
      cloudsea: {
        title: "云海拓荒",
        category: "游戏 / 生存探索",
        description:
          "一款开发中的单机 2D 像素空岛生存游戏，以“打捞—制造—扩建”为核心循环：通过渔网获取随机物资，制作工具并扩建岛屿，结合种植、集水、仓储和天气系统，逐步建立可持续的食水与资源供给。",
      },
      finscope: {
        title: "FinScope",
        category: "数据分析 / 金融新闻",
        description:
          "一款在本地运行的金融新闻分析工具。用 FinBERT 判断获准处理的新闻文本的情绪，用 MiniLM 找出可能相似的报道，并在本地 SQLite 中保存原文和分析结果。可通过仪表盘、行业视图和知识图谱浏览。线上演示使用虚构数据。",
      },
    },
    repo: "查看 GitHub",
    showcase: "查看线上演示",
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
    projects: {
      work: {
        title: "Local Mahjong",
        category: "GAME / MAHJONG TRAINER",
        description:
          "A 3D mahjong game for local play and practice, featuring four-player Riichi and 17-step modes, AI opponents, AI voice, tenpai guidance and multi-perspective replay study. Sichuan Blood Battle, three-player Riichi and Chinese Standard Mahjong are planned for future development.",
      },
      "sms-wechat": {
        title: "sms-wechat-bridge",
        category: "TOOL / MESSAGE BRIDGE",
        description:
          "Automatically forwards SMS messages from a phone to a specified WeChat chat.",
      },
      cloudsea: {
        title: "Cloudsea Frontier",
        category: "GAME / SURVIVAL",
        description:
          "A single-player 2D pixel-art sky-island survival game in development, built around salvaging, crafting and expansion. Use nets to gather random supplies, craft tools and expand your island, then establish sustainable food, water and resource production through farming, water collection and storage as the weather changes.",
      },
      finscope: {
        title: "FinScope",
        category: "DATA ANALYTICS / FINANCIAL NEWS",
        description:
          "A local financial news analysis tool. It uses FinBERT to score sentiment on permitted text and MiniLM to find potentially similar stories, with originals and results stored in local SQLite. Browse results in a dashboard, by industry, or through a knowledge graph. The online showcase uses fictional data.",
      },
    },
    repo: "View on GitHub",
    showcase: "View online showcase",
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

export default text;
