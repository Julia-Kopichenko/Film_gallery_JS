const apiKey = '43042c8dc5edb5f45ccc79e88d4730b0';
const filmInfo = document.querySelector('.film-info-wrapper');
let element;
let elementId = new URLSearchParams(window.location.search).get('id');
let filmsJson = JSON.parse(localStorage.getItem('filmsInfo'));
let genresJson = JSON.parse(localStorage.getItem('genres'));

filmsJson.forEach(item => {
  if (item.id == elementId) {
    element = item;
    return;
  }
});
let genres = '';

element.genre_ids.forEach(item => {
  genresJson.forEach(innerItem => {
    if (item == innerItem.id) {
      genres += innerItem.name + ', ';
    }
  })
});
genres = genres.slice(0, -2);

filmInfo.innerHTML = `
<div class='film-item-wrapper'>
  <img src=${element.poster_path ? `https://image.tmdb.org/t/p/w200${element.poster_path}` : './Images/notFound200_300.jpg'} alt="${element.title}" class='film-item-img'> 
</div>
<div class='film-item-text'>
  <div class='flex-center'>
    <h2 class='film-title'>${element.title}</h2>
  </div>
  <p><span>Жанр:</span> ${genres}</p>
  <p><span>Популярность:</span> ${element.popularity}</p>
  <p><span>Рейтинг:</span> ${element.vote_average}</p>
  <p><span>Количество голосов:</span> ${element.vote_count}</p>
  <p><span>Дата релиза:</span> ${element.release_date}</p>
  <p><span>Обзор:</span> ${element.overview}</p>
</div>
`;
