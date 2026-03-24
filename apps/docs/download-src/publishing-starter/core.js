const copyButtons = document.querySelectorAll('[data-weave-copy]');

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const text = button.getAttribute('data-text') || '';

    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'DONE';

      window.setTimeout(() => {
        button.textContent = '텍스트 복사';
      }, 1200);
    } catch (error) {
      console.error(error);
    }
  });
});
