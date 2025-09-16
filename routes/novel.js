const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../util/path");
const fs = require("fs");
const novelsTools = require("../util/novelsTools");

// Read file JSON
const novels = novelsTools.loadNovels();
const genreMap = JSON.parse(
  fs.readFileSync(path.join(rootDir, "data", "genres-map.json"), "utf-8")
);

// Home Page 
router.get("/", (req, res) => {

  const comicDir = path.join(rootDir, "data", "comic");
  let comics = [];

  fs.readdirSync(comicDir, { withFileTypes: true }).forEach((dirent) => {
    if (dirent.isDirectory()) {
      const coverPath = path.join(comicDir, dirent.name, "cover.jpg");
      comics.push({
        id: dirent.name,
        name: dirent.name,
        cover: fs.existsSync(coverPath)
          ? `/comic_data/${dirent.name}/cover.jpg`
          : "/pic/default.png",
      });
    }
  });

  res.render("home", {
    pageTitle: "Home",
    novels, comics,
    activePage: "home",
    contentTitle: "นิยายแนะนำ"
  });
});

// novel Page
router.get("/novel/:id", (req, res) => {
  const novelId = req.params.id;
  const novel = novelsTools.getNovelById(novelId);

  if (!novel) {
    return res
      .status(404)
      .render("404", { pageTitle: "404", activePage: "404" });
  }

  res.render("story", {
    pageTitle: novel.name,
    novel,
    activePage: "StoryPage",
  });
});

// Chapters in novel
router.get("/novel/:id/chapter/:chapterNumber", (req, res) => {
  const novelId = req.params.id;
  const chapterNum = req.params.chapterNumber;

  // หา novel
  const novel = novelsTools.getNovelById(novelId);
  if (!novel) {
    return res
      .status(404)
      .render("404", { pageTitle: "Novel not found", activePage: "404" });
  }

  // หา chapter
  const chapter = novel.chapters.find(
    (ch) => ch.chapterNumber.toString() === chapterNum
  );
  if (!chapter) {
    return res
      .status(404)
      .render("404", { pageTitle: "Chapter not found", activePage: "404" });
  }

  // ส่งไปที่ ejs
  res.render("chapter_read", {
    pageTitle: `Chapter ${chapter.chapterNumber} - ${chapter.title}`,
    novel,
    chapter,
    activePage: "",
  });
});

// Show All genres
router.get("/genres", (req, res) => {
  // เก็บ genres ทั้งหมด
  let genreCount = {};

  novels.forEach((novel) => {
    novel.genres.forEach((g) => {
      if (genreCount[g]) {
        genreCount[g] += 1;
      } else {
        genreCount[g] = 1;
      }
    });
  });

  // make the genre links array
  let genreLinks = Object.keys(genreCount).map((g) => {
    // genre Thai to ENG
    let engName = genreMap.thai_to_eng[g] || g;
    // genre ENG
    if (genreMap.eng_to_thai[engName]) {
      return {
        thai: genreMap.eng_to_thai[engName],
        eng: engName,
        // count: genreCount[g],
        link: `/genres/${engName.toLowerCase()}`,
      };
    }
    // ถ้าไม่เจอใน map → แสดงแบบเดิม
    return {
      thai: g,
      eng: g,
      // count: genreCount[g],
      link: `/genres/${g.toLowerCase()}`,
    };
  });

  res.render("genres", {
    genreLinks,
    pageTitle: "หมวดหมู่",
    activePage: "genres",
  });
});

// genres details
router.get("/genres/:genre", (req, res) => {
  const genre = req.params.genre;
  const genreTitle = genre.toLocaleUpperCase()
  const novelsInGenre = novels.filter(novel => novel.genres.find(g => g.toLowerCase() === genre));

  // Count  all novels in genre
  let genreCount = 0;
  novelsInGenre.forEach((novel) => {
      if (novel) {
        genreCount += 1;
      } else {
        genreCount = 1;
      }
  });


  res.render("genre_details", {
    genre, genreCount,
    pageTitle: `${genre}`,
    activePage: `${genre}`,
    novels: novelsInGenre,
    contentTitle: `${genreTitle}`
  });
});

// Comic Home Page
router.get("/comic", (req, res) => {
  const comicDir = path.join(rootDir, "data", "comic");
  let comics = [];

  fs.readdirSync(comicDir, { withFileTypes: true }).forEach((dirent) => {
    if (dirent.isDirectory()) {
      const coverPath = path.join(comicDir, dirent.name, "cover.jpg");
      comics.push({
        id: dirent.name,
        name: dirent.name,
        cover: fs.existsSync(coverPath)
          ? `/comic_data/${dirent.name}/cover.jpg`
          : "/pic/default.png",
      });
    }
  });

  res.render("comic_home", {
    pageTitle: "Comic Home",
    comics,
    activePage: "comic",
  });
});

// Comic Page (list chapters)
router.get("/comic/:comicId", (req, res) => {
  const comicId = req.params.comicId;
  const comicPath = path.join(rootDir, "data", "comic", comicId);

  if (!fs.existsSync(comicPath)) {
    return res
      .status(404)
      .render("404", { pageTitle: "Comic not found", activePage: "404" });
  }

  // อ่าน chapter ทั้งหมด
  const chapters = fs
    .readdirSync(comicPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .map((dirent) => dirent.name);

  // หา cover
  const coverPath = path.join(comicPath, "cover.jpg");
  const cover = fs.existsSync(coverPath)
    ? `/comic_data/${comicId}/cover.jpg`
    : null;

  // 🔹 อ่านไฟล์ description.txt
  const descriptionPath = path.join(comicPath, "description.txt");
  let description = "";
  if (fs.existsSync(descriptionPath)) {
    description = fs.readFileSync(descriptionPath, "utf-8");
  }

  // ส่งข้อมูลไป render
  res.render("story_comic", {
    pageTitle: comicId,
    comicId,
    chapters,
    cover,
    description, // 🔹 เพิ่ม description ตรงนี้
    activePage: "comic",
  });
});


// Read Comic (show images in chapter)
router.get("/comic/:comicId/:chapter", (req, res) => {
  const { comicId, chapter } = req.params;
  const chapterPath = path.join(rootDir, "data", "comic", comicId, chapter);

  if (!fs.existsSync(chapterPath)) {
    return res
      .status(404)
      .render("404", { pageTitle: "Chapter not found", activePage: "404" });
  }

  const images = fs
    .readdirSync(chapterPath)
    .filter((file) => /\.(webp|jpg|png|jpeg|gif)$/.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((img) => `/comic_data/${comicId}/${chapter}/${img}`);

  res.render("read_comic", {
    pageTitle: `${comicId} - ${chapter}`,
    comicId,
    chapter,
    images,
    activePage: "comic",
  });
});

module.exports = router;
