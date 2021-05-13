const apiKey = '43042c8dc5edb5f45ccc79e88d4730b0';
const filmInfo = document.querySelector('.film-info-wrapper');
const filmTextInfo = document.querySelector('.film-item-text');
let element;
let elementId = new URLSearchParams(window.location.search).get('id');
let filmsJson = JSON.parse(localStorage.getItem('filmsInfo'));
let genresJson = JSON.parse(localStorage.getItem('genres'));
//! для кнопок регситрации (копипаст,но пока так)
const buttonLogin = document.querySelector('.button-login');
const buttonLogout = document.querySelector('.button-logout');
const blockUserInfo = document.querySelector('.header-user-info-wrapper');
const userName = document.querySelector('.user-name');

//! получим данные о юзере
let authorizedUser;
let nameAuthorizedUser;
let isAdminAuthorizedUser;
if (localStorage.getItem('authorizedUser')) {
	authorizedUser = JSON.parse(localStorage.getItem('authorizedUser'));
	nameAuthorizedUser = authorizedUser.name;
	isAdminAuthorizedUser = authorizedUser.isAdmin;
}

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
  <p><span>Количество голосов: </span><span class="vote-count">${element.vote_count}</span> </p>
  <p><span>Дата релиза:</span> ${element.release_date}</p>
  <p><span>Обзор:</span> ${element.overview}</p>
	<form class="select-average hidden" method="post">
		<select class="select">
			<option >Поставьте рейтинг</option>
			<option value="1">1</option>
			<option value="2">2</option>
			<option value="3">3</option>
			<option value="4">4</option>
			<option value="5">5</option>
			<option value="6">6</option>
			<option value="7">7</option>
			<option value="8">8</option>
			<option value="9">9</option>
			<option value="10">10</option>
		</select>
	</form>
</div>
`;

//! изменим страницу для зарегистрированного пользователя
let select = document.querySelector('.select-average');
if (authorizedUser) {
	select.classList.remove('hidden');
	buttonLogin.classList.add('hidden');
	blockUserInfo.classList.remove('hidden');
	userName.innerHTML = nameAuthorizedUser;
}

//! при клике на кнопку log out
buttonLogout.addEventListener('click', function () {
	select.classList.add('hidden');
	blockUserInfo.classList.add('hidden');
	buttonLogin.classList.remove('hidden');
	localStorage.removeItem('authorizedUser');
})

let voteCount = document.querySelector('.vote-count');
let voteCountValue = +document.querySelector('.vote-count').textContent;
console.log(typeof(voteCountValue));

//! Меняем рейтинг и кол-во голосов
	select.addEventListener('change', function(event) {
		voteCountValue++;
		console.log(voteCountValue);
		voteCount.innerHTML = voteCountValue;
	});
