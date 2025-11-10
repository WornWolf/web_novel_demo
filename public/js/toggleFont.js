const dropdown = document.getElementById('fontDropdown');
    const fontSizeInput = document.getElementById('fontSizeInput');
    const content = document.querySelector('.text-container')

    function toggleDropdown() {
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }

    function changeFontSize(delta) {
      let currentSize = parseInt(content.style.fontSize) || 14;
      let newSize = currentSize + delta;
      if (newSize < 14) newSize = 14;
      if (newSize > 50) newSize = 50;
      content.style.fontSize = newSize + "px";
      fontSizeInput.value = newSize;
    }

    fontSizeInput.addEventListener('change', () => {
      let newSize = parseInt(fontSizeInput.value);
      if (!isNaN(newSize)) {
        if (newSize < 14) newSize = 14;
        if (newSize > 50) newSize = 50;
        content.style.fontSize = newSize + "px";
        fontSizeInput.value = newSize;
      }
    });

    // คลิกนอก dropdown เพื่อปิด
    document.addEventListener('click', function(event) {
      const toggleButton = document.querySelector('.font-toggle-button');
      if (!dropdown.contains(event.target) && !toggleButton.contains(event.target)) {
        dropdown.style.display = 'none';
      }
    });