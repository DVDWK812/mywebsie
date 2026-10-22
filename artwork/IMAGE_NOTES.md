# 云海拓荒：《星空》网页适配图

- 使用内置 `image_gen` 工具，以参考图进行编辑；未使用 CLI/API fallback。
- 原作：Vincent van Gogh，The Starry Night（1889）。参考图来自 [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg)，该来源将原作复制图标为公有领域。
- 改动：横向扩展画面，保留旋涡星空、金色星月、柏树与村庄、油画厚涂笔触；略调为午夜蓝，并让左侧更适合叠放真实 HTML 文案。网页再用独立渐变遮罩保证文案对比度。
- 网站实际使用：`src/assets/starry-night-cloudsea.webp`（与生成图画面一致的 WebP 编码，非在线引用）。
- 本地原图：`artwork/starry-night-cloudsea.png`；参考图：`artwork/starry-night-reference.jpg`。这两个大文件不上传仓库。

## 最终提示词

Use case: style-transfer / adaptation of a public-domain artwork. Edit target: the attached Vincent van Gogh The Starry Night (1889) reproduction. Produce ONE finished landscape website background, approximately 16:9. Preserve the unmistakable painting: thick impasto oil brushstrokes, blue swirling night sky, luminous muted-gold stars, crescent moon at upper right, dark cypress silhouette at left, distant mountain ridge and the small village along the bottom. Make restrained changes only: naturally extend the composition horizontally for a full-screen website chapter, shift the overall palette slightly toward deep midnight blue with subtle petrol/teal undertones and softer warm gold, and lower the brightness/detail contrast a little on the left third so real HTML text can be overlaid there. Keep the central and right-hand swirling sky and stars rich, recognizable and textured. Preserve the original artwork's post-impressionist hand-painted character, not a flat vector, not a 3D render. No added floating islands, game characters, planets, spacecraft, buildings unrelated to the original, logos, watermarks, frames, borders, typography or UI. Fill the complete canvas with the painting; do not include any text. This is the visual background for the existing Cloudsea Frontier project section of a refined dark personal portfolio.
