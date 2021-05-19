window.addEventListener('DOMContentLoaded', function () {
	const filmInfo = document.querySelector('.film-block');
	let element;
	let elementId = new URLSearchParams(window.location.search).get('id');
	let filmsByPage = JSON.parse(localStorage.getItem('filmsInfo'));
	const posterPathURL = 'https://image.tmdb.org/t/p/w200';
	let genresAll = JSON.parse(localStorage.getItem('genres'));
	//! для кнопок регситрации (копипаст,но пока так)
	const buttonLogout = document.querySelector('.button-logout');
	const userName = document.querySelector('.user-name');
	let manuallyAddedFilmsArr = [];
	let removeFilmsArr = [];
	
	//! получим данные о юзере
	let authorizedUser;
	let nameAuthorizedUser;
	let isAdminAuthorizedUser;

	if (localStorage.getItem('manuallyAddedFilms')) {
		manuallyAddedFilmsArr = JSON.parse(localStorage.getItem('manuallyAddedFilms'));
	}

	if (localStorage.getItem('authorizedUser')) {
		authorizedUser = JSON.parse(localStorage.getItem('authorizedUser'));
		nameAuthorizedUser = authorizedUser.name;
		isAdminAuthorizedUser = authorizedUser.isAdmin;
	}
	
	//! проверим по наличию данного id в массиве фильмов с сервера
	let filmWasFound = false;

	filmsByPage.forEach(item => {
		if (item.id == elementId) {
			element = item;
			filmWasFound = true;
			return;
		}
	});

	//! если в массиве фильмов с сервера данного id нет, то ищем среди админских фильмов
	if (!filmWasFound) {
		manuallyAddedFilmsArr.forEach(item => {
			if (item.id == elementId) {
				element = item;
				return;
			}
		});
	}

	//! Надем жанпы фильма (из массива со всеми  жанрами)
	let genres = '';
	
	element.genre_ids.forEach(item => {
		genresAll.forEach(innerItem => {
			if (item == innerItem.id) {
				genres += innerItem.name + ', ';
			}
		})
	});
	genres = genres.slice(0, -2);
	
	//! прорисуем карточку фильма, его инфу и селект
	filmInfo.innerHTML = `
	<div class='film-block__img'>
		<img class ='film-img' src=${element.poster_path ? `${posterPathURL}${element.poster_path}` : './Images/notFound200_300.jpg'} alt="${element.title}"> 
		<button class="button-remove-film button" aria-label="remove film" title="remove film"></button>
		<button class="button-edit-film button" aria-label="Edit film" title="Edit film"></button>
	</div>
		
	<div class='film-block__text'>
		<div>
		<input class="edit-film__input film-block__title" type="text" name="" id="editFilmTitle" value=" ${element.title}" disabled></br>
		</div>
		<span>Жанр:</span> 
		<input class="edit-film__input" type="text" name="" id="editFilmGenres" value=" ${genres}" disabled></br>

		<span>Популярность:</span> 
		<input class="edit-film__input active" type="text" name="" id="editFilmPopularity" value="${element.popularity}"disabled> </br>

		<span>Рейтинг:</span> 
		<input class="edit-film__input" type="text" name="" id="editFilmVoteAverage" value=" ${element.vote_average}" disabled></br>

		<span>Количество голосов: </span>
		<input class="edit-film__input vote-count" type="text" name="editFilmVoteCount" id="editFilmVoteCount" value="${element.vote_count}" disabled></br>

		<span>Дата релиза:</span> 
		<input class="edit-film__input" type="text" name="editFilmReleaseDate" id="editFilmReleaseDate" value="${element.release_date}" disabled></br>

		<span>Обзор:</span></br> 
		<textarea class="edit-film__input" type="text" name="editFilmOverview" id="editFilmFilmOverview" disabled>${element.overview}</textarea></br> 

		<div class="button-wrapper">
		<button class="button button-primary hidden" id="editFilmButtonSave" aria-label="Save">Save</button>
		<button class="button button-primary hidden" id="editFilmButtonCancel" aria-label="Cancel">Cancel</button>
	</div>

		<form class="select-average hidden" >

			<select class="select">
				<option>Поставьте рейтинг</option>
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
	let voteCountValue = +document.querySelector('.vote-count').value;
	let voteIsAccepted = false;
	
	//! Меняем рейтинг и кол-во голосов
	select.addEventListener('change', function() {
		if (voteIsAccepted) return;
		voteCountValue++;
		voteCount.value = voteCountValue;
		voteIsAccepted = true;
	});

	//! при клике на корзину
	if (localStorage.getItem('removeFilmsArr')) {
		removeFilmsArr = JSON.parse(localStorage.getItem('removeFilmsArr'));
	}

	function updateLocalStorage(key, object) {
		localStorage.setItem(key, JSON.stringify(object));
	}
	
	function addClickListenerOnGarbage() {
		let buttonRemove = document.querySelector('.button-remove-film');
		let filmWasManuallyAdded = false;
		buttonRemove.addEventListener('click', function () {
			let removeFilmId = {
				'id': elementId,
			}

			for (let i = 0; i < manuallyAddedFilmsArr.length; i++) {
				if (elementId == manuallyAddedFilmsArr[i].id) {
					manuallyAddedFilmsArr.splice(i, 1);
					updateLocalStorage('manuallyAddedFilms', manuallyAddedFilmsArr);
					filmWasManuallyAdded = true;
				}
			}

			if (!filmWasManuallyAdded) {
				removeFilmsArr.push(removeFilmId);
				updateLocalStorage('removeFilmsArr', removeFilmsArr);
			}
			
			location.href = "/index.html";
		});
	}
	//! Редактирование фильма
	const buttonEdit = document.querySelector ('.button-edit-film');
	const editFilmButtonSave = document.querySelector('#editFilmButtonSave');
	const editFilmButtonCancel = document.querySelector('#editFilmButtonCancel');
	// найдем все элементы с атрибутом disabled
	let allDisabledInputs = document.querySelectorAll('[disabled]');
	console.log(allDisabledInputs);
	
	buttonEdit.addEventListener('click', function () {
		allDisabledInputs.forEach(item => {
			item.removeAttribute('disabled');
		});
		editFilmButtonSave.classList.remove('hidden');
		editFilmButtonCancel.classList.remove('hidden');
	})

	editFilmButtonCancel.addEventListener('click', function () {
		allDisabledInputs.forEach(item => {
			item.setAttribute('disabled', '');
		});
		editFilmButtonSave.classList.add('hidden');
		editFilmButtonCancel.classList.add('hidden');
	})

	editFilmButtonSave.addEventListener('click', function () {
		let title = document.querySelector('#editFilmTitle').value;
		let overview = document.querySelector('#editFilmFilmOverview').value;
		let popularity = document.querySelector('#editFilmPopularity').value;
		let release_date = document.querySelector('#editFilmReleaseDate').value;
		let vote_average = document.querySelector('#editFilmVoteAverage').value;
		let vote_count = document.querySelector('#editFilmVoteCount').value;

		let film = {
			'id': Date.now(),
			'title': title,
			'overview': overview,
			'poster_path': element.poster_path,
			'popularity': popularity,
			'release_date': release_date,
			'genre_ids': element.genre_ids,
			'vote_average': vote_average,
			'vote_count': vote_count,
			'adult': element.adult
		}

		manuallyAddedFilmsArr.push(film);
		updateLocalStorage('manuallyAddedFilms', manuallyAddedFilmsArr);
		location.href = "/index.html";
	})

})


