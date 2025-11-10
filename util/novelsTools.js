const fs = require("fs");
const path = require("path");

// relative path จากไฟล์นี้ไปยัง data
const dataPath = path.join(__dirname, "../data/novels.json");

function loadNovels() {
  try {
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const parsedData = JSON.parse(rawData);
    return parsedData.novels || [];
  } catch (err) {
    console.error("Error loading novels:", err);
    return [];
  }
}

function saveNovels(novels) {
  try {
    fs.writeFileSync(
      dataPath,
      JSON.stringify({ novels }, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("Error saving novels:", err);
  }
}

function addNovel(newNovel) {
  const novels = loadNovels();
  newNovel.id = novels.length > 0 ? novels[novels.length - 1].id + 1 : 1;
  novels.push(newNovel);
  saveNovels(novels);
  return newNovel;
}

function getNovelById(id) {
  const novels = loadNovels();
  return novels.find(novel => novel.id === parseInt(id));
}

module.exports = {
  loadNovels,
  saveNovels,
  addNovel,
  getNovelById
};
