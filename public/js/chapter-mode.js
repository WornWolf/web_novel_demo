// public/js/chapter-mode.js

document.addEventListener('DOMContentLoaded', () => {
  const scrollModeBtn = document.getElementById('scrollModeBtn');
  const carouselModeBtn = document.getElementById('carouselModeBtn');
  const scrollMode = document.getElementById('scrollMode');
  const carouselMode = document.getElementById('carouselMode');

  if (scrollModeBtn && carouselModeBtn && scrollMode && carouselMode) {
    scrollModeBtn.addEventListener('click', () => {
      scrollMode.classList.remove('d-none');
      carouselMode.classList.add('d-none');
      scrollModeBtn.classList.add('active');
      carouselModeBtn.classList.remove('active');
    });

    carouselModeBtn.addEventListener('click', () => {
      scrollMode.classList.add('d-none');
      carouselMode.classList.remove('d-none');
      scrollModeBtn.classList.remove('active');
      carouselModeBtn.classList.add('active');
    });
  }
});
