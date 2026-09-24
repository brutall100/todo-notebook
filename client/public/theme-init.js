// Runs before the page is drawn: picks the saved theme or the system one.
(function () {
  var theme;
  try {
    theme = localStorage.getItem('todo-notebook:theme');
  } catch {
    theme = null;
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = theme;
})();
