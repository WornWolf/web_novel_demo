const express = require("express");
const router = express.Router();
const path = require("path");
const dataDir = path.join(__dirname, "../data");
const fs = require("fs");
const novelsTools = require("../util/novelsTools");

// Read file JSON
const novels = novelsTools.loadNovels();
const genreMap = JSON.parse(
  fs.readFileSync(path.join(dataDir, "genres-map.json"), "utf-8")
);

// Home Page 
router.get("/", (req, res) => {
  res.render("home", {
    pageTitle: "Home",
    novels,
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

module.exports = router;
