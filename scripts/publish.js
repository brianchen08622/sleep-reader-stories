/**
 * 把故事 JSON 檔整理成雲端格式：
 * - index.json: 輕量清單（不含段落）
 * - stories/{lang}/{id}.json: 各故事完整內容
 *
 * 用法：node scripts/publish.js
 * 把新故事 JSON 放到 incoming/ 資料夾，跑完後自動整理到正確位置
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const STORIES_DIR = path.join(ROOT, "stories");
const LANGS = ["zh-TW", "zh-CN", "en", "ja", "ko"];

// Collect all stories from all language directories
const index = [];

for (const lang of LANGS) {
  const dir = path.join(STORIES_DIR, lang);
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  for (const file of files) {
    const story = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    index.push({
      id: story.id,
      title: story.title,
      category: story.category || "",
      lang,
      paragraphCount: story.paragraphs?.length || 0,
      file: `stories/${lang}/${file}`,
    });
    console.log(`  ✓ [${lang}] ${story.title} (${story.paragraphs?.length || 0} paragraphs)`);
  }
}

// Write index.json
fs.writeFileSync(
  path.join(ROOT, "index.json"),
  JSON.stringify({ version: Date.now(), stories: index }, null, 2)
);

console.log(`\nPublished index.json with ${index.length} stories`);
