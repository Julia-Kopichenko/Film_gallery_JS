window.addEventListener('DOMContentLoaded', function () {
	const apiKey = '43042c8dc5edb5f45ccc79e88d4730b0';
	const filmInfo = document.querySelector('.film-block');
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
	<div class='film-block__img'>
		<img src=${element.poster_path ? `https://image.tmdb.org/t/p/w200${element.poster_path}` : './Images/notFound200_300.jpg'} alt="${element.title}"> 
		<button class="button-remove-film button" aria-label="remove film" title="remove film">
			<svg viewBox="0 0 74 74" width="30px" xmlns="http://www.w3.org/2000/svg"><path d="m52.175 72h-30.35a3.288 3.288 0 0 1 -3.293-3.018l-4.427-50.913 1.995-.169 4.427 50.912a1.3 1.3 0 0 0 1.298 1.188h30.35a1.3 1.3 0 0 0 1.3-1.193l4.425-50.907 1.992.173-4.424 50.908a3.288 3.288 0 0 1 -3.293 3.019z"/><path d="m62.355 18.983h-50.71a1 1 0 0 1 -1-1v-3.458a5.616 5.616 0 0 1 5.609-5.61h41.492a5.616 5.616 0 0 1 5.609 5.61v3.458a1 1 0 0 1 -1 1zm-49.711-2h48.711v-2.458a3.614 3.614 0 0 0 -3.609-3.61h-41.492a3.614 3.614 0 0 0 -3.609 3.61z"/><path d="m46.221 10.915h-18.442a1 1 0 0 1 -1-1v-2.305a5.616 5.616 0 0 1 5.611-5.61h9.22a5.616 5.616 0 0 1 5.61 5.61v2.3a1 1 0 0 1 -.999 1.005zm-17.441-2h16.441v-1.305a3.614 3.614 0 0 0 -3.611-3.61h-9.22a3.614 3.614 0 0 0 -3.61 3.61z"/><path d="m28.609 43.492h37.528v2h-37.528z" transform="matrix(.062 -.998 .998 .062 .051 89.037)"/><path d="m36 25.763h2v37.458h-2z"/><path d="m25.627 25.727h2v37.528h-2z" transform="matrix(.998 -.061 .061 .998 -2.682 1.719)"/></svg>
		</button>
		<a class="button-edit-film" href="#" aria-label="Edit film" title="Edit film">
			<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width = "28px" x="0px" y="0px"
			viewBox="0 0 469.336 469.336" style="enable-background:new 0 0 469.336 469.336;" xml:space="preserve">
			 <path d="M347.878,151.357c-4-4.003-11.083-4.003-15.083,0L129.909,354.414c-2.427,2.429-3.531,5.87-2.99,9.258
				 c0.552,3.388,2.698,6.307,5.76,7.84l16.656,8.34v28.049l-51.031,14.602l-51.51-51.554l14.59-51.075h28.025l8.333,16.67
				 c1.531,3.065,4.448,5.213,7.833,5.765c0.573,0.094,1.146,0.135,1.708,0.135c2.802,0,5.531-1.105,7.542-3.128L317.711,136.26
				 c2-2.002,3.125-4.712,3.125-7.548c0-2.836-1.125-5.546-3.125-7.548l-39.229-39.263c-2-2.002-4.708-3.128-7.542-3.128h-0.021
				 c-2.844,0.01-5.563,1.147-7.552,3.159L45.763,301.682c-0.105,0.107-0.1,0.27-0.201,0.379c-1.095,1.183-2.009,2.549-2.487,4.208
				 l-18.521,64.857L0.409,455.73c-1.063,3.722-0.021,7.736,2.719,10.478c2.031,2.033,4.75,3.128,7.542,3.128
				 c0.979,0,1.958-0.136,2.927-0.407l84.531-24.166l64.802-18.537c0.195-0.056,0.329-0.203,0.52-0.27
				 c0.673-0.232,1.262-0.61,1.881-0.976c0.608-0.361,1.216-0.682,1.73-1.146c0.138-0.122,0.319-0.167,0.452-0.298l219.563-217.789
				 c2.01-1.991,3.146-4.712,3.156-7.558c0.01-2.836-1.115-5.557-3.125-7.569L347.878,151.357z"/>
			 <path d="M456.836,76.168l-64-64.054c-16.125-16.139-44.177-16.17-60.365,0.031l-39.073,39.461
				 c-4.135,4.181-4.125,10.905,0.031,15.065l108.896,108.988c2.083,2.085,4.813,3.128,7.542,3.128c2.719,0,5.427-1.032,7.51-3.096
				 l39.458-39.137c8.063-8.069,12.5-18.787,12.5-30.192S464.899,84.237,456.836,76.168z"/>
			</svg>
		</a>
	</div>
		
	<div class='film-block__text'>
		<div class='flex-center'>
			<h2 class='film-block__title'>${element.title}</h2>
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
	addClickListenerOnGarbage();
	
	//! изменим страницу для зарегистрированного пользователя
	const body = document.querySelector('body');
	let select = document.querySelector('.select-average');
	
	if (authorizedUser) {
		select.classList.remove('hidden');
		body.classList.add('autorized');
		userName.innerHTML = nameAuthorizedUser;
		if (isAdminAuthorizedUser){
			body.classList.add('admin');
		}
	}
	//! при клике на кнопку log out
	buttonLogout.addEventListener('click', function () {
		body.classList.remove('autorized');
		body.classList.remove('admin');
		select.classList.add('hidden');
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
	
		//! при клике на корзину
		function addClickListenerOnGarbage() {
			let buttonRemove = document.querySelector('.button-remove-film');
			buttonRemove.addEventListener('click', function (event) {
					let eventTarget = event.target;
	
					if (!eventTarget.classList.contains('button-remove-film')) {
						eventTarget = eventTarget.parentElement;
					}
					let elt = eventTarget.closest('.film-block');
					elt.style.display = 'none';
			});
		}

})


