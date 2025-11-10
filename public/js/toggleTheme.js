 // ตั้ง default theme ถ้ายังไม่มี
  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "dark");
  }

  // ป้องกัน flicker
  document.body.classList.add("no-transition");

  // โหลด theme จาก localStorage ตอนหน้าโหลด
  const theme = localStorage.getItem("theme");
  document.body.classList.add(theme);

  // ลบ no-transition หลัง DOM โหลดเสร็จ
  window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove("no-transition");
  });

  // toggle theme function
  function toggleTheme() {
    const body = document.body;
    const toggle = document.querySelector(".toggle-switch");

    body.classList.toggle("dark");
    body.classList.toggle("light");
    toggle.classList.toggle("active");

    // update localStorage
    if (body.classList.contains("light")) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
  }