document.querySelectorAll('article').forEach(function(article) {
  if (article.querySelector('h5')) {
      article.style.display = 'none';
      console.log("Скрываем");
  }else {
    console.log("No Скрываем");
  }
});