document.addEventListener("DOMContentLoaded", () => {
    const sortBtn = document.getElementById("sortBtn");
    const chapterList = document.getElementById("chapter-list");
    let isDesc = true;

    sortBtn.addEventListener("click", () => {
      const chapters = Array.from(chapterList.children);
      chapters.reverse(); // just flip the DOM order

      chapterList.innerHTML = "";
      chapters.forEach(c => chapterList.appendChild(c));

    });
  });