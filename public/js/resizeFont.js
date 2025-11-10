const content = document.querySelector('.text-container');

  // โหลดค่าฟอนต์จาก localStorage ถ้ามี
  window.onload = () => {
    let savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      content.style.fontSize = savedFontSize;
    }
  };

  function increaseFont() {
    let style = window.getComputedStyle(content, null).getPropertyValue('font-size');
    let currSize = parseFloat(style);

    if (currSize < 50) {
      let newSize = (currSize + 2) + "px";
      content.style.fontSize = newSize;
      localStorage.setItem('fontSize', newSize); // เก็บลง localStorage
    }
  }

  function decreaseFont() {
    let style = window.getComputedStyle(content, null).getPropertyValue('font-size');
    let currSize = parseFloat(style);

    if (currSize > 10) {
      let newSize = (currSize - 2) + "px";
      content.style.fontSize = newSize;
      localStorage.setItem('fontSize', newSize); // เก็บลง localStorage
    }
  }

  function resetFont() {
    content.style.fontSize = "16px"; // ค่า default ที่คุณอยากให้
    localStorage.setItem('fontSize', "16px");
  }