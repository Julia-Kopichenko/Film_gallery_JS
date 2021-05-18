window.addEventListener('DOMContentLoaded', function () {
	const filmInfo = document.querySelector('.film-block');
	let element;
	let elementId = new URLSearchParams(window.location.search).get('id');
	let filmsJson = JSON.parse(localStorage.getItem('filmsInfo'));
	let genresJson = JSON.parse(localStorage.getItem('genres'));
	//! для кнопок регситрации (копипаст,но пока так)
	const buttonLogout = document.querySelector('.button-logout');
	const userName = document.querySelector('.user-name');
	let removeFilmsArr = [];
	
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
		<button class="button-remove-film button" aria-label="remove film" title="remove film"></button>
		<a class="button-edit-film" href="#" aria-label="Edit film" title="Edit film"></a>
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
	
	//! изменим страницу для зарегистрированного пользователя
	const body = document.querySelector('body');
	let select = document.querySelector('.select-average');
	
	if (authorizedUser) {
		select.classList.remove('hidden');
		body.classList.add('autorized');
		userName.innerHTML = nameAuthorizedUser;
		if (isAdminAuthorizedUser){
			body.classList.add('admin');
			addClickListenerOnGarbage();
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
	
	//! Меняем рейтинг и кол-во голосов
		select.addEventListener('change', function() {
			voteCountValue++;
			voteCount.innerHTML = voteCountValue;
		});
	
		//! при клике на корзину
		if (localStorage.getItem('removeFilmsArr')) {
			removeFilmsArr = JSON.parse(localStorage.getItem('removeFilmsArr'));
		}
	
		function updateRemoveFilmsArrLocalStorage() {
			localStorage.setItem('removeFilmsArr', JSON.stringify(removeFilmsArr));
		}
	
	function addClickListenerOnGarbage() {
		let buttonRemove = document.querySelector('.button-remove-film');
		buttonRemove.addEventListener('click', function () {
			let removeFilmId = {
				'id': elementId,
			}

			removeFilmsArr.push(removeFilmId);
			updateRemoveFilmsArrLocalStorage();
			// переадресуем на главную страницу
			location.href = "/index.html";
		});
	}

})


