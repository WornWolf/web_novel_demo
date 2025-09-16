const chapterButtons = document.querySelectorAll(".chapter-button");
const chapterContent = document.getElementById("chapter-content");
const chapterList = document.getElementById("chapter-list");
const chapterTitle = document.getElementById("chapter-title");
const chapterText = document.getElementById("chapter-text");
const backButton = document.getElementById("back-to-list");

chapterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    chapterTitle.textContent = btn.dataset.title;
    chapterText.textContent = btn.dataset.content;
    chapterContent.style.display = "block";
    chapterList.style.display = "none";
  });
});

backButton.addEventListener("click", () => {
  chapterContent.style.display = "none";
  chapterList.style.display = "block";
});
