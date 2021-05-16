// Ключ API (v3 auth)
// 43042c8dc5edb5f45ccc79e88d4730b0
// Жанры:
// https://api.themoviedb.org/3/genre/movie/list?api_key=43042c8dc5edb5f45ccc79e88d4730b0&language=en-US
// Фильмы:
// https://api.themoviedb.org/3/discover/movie?api_key=43042c8dc5edb5f45ccc79e88d4730b0
// Ссылка на картинки
// https://image.tmdb.org/t/p/w200${film.poster_path}
// Там где доллар и скобки будет часть объекта

// обраб.событий, который запускает скрипты, когда дом-дерево готово (Событие DOMContentLoaded происходит когда весь HTML был полностью загружен и пройден парсером, не дожидаясь окончания загрузки таблиц стилей, изображений и фреймов.)
// в виде ф-ции запускаем скрипт, который внутри
window.addEventListener('DOMContentLoaded', function () {
	const body = document.querySelector('body');
	const apiKey = '43042c8dc5edb5f45ccc79e88d4730b0';
	const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ru-RU`;
	let sortBy = 'popularity.desc'; // default
	const genresURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ru-RU`;
	const filmInfoURI = '/filmInfo.html';
	const selectElement = document.querySelector('select');
	let galary = document.querySelector('.film-gallery__wrapper'); // секция с фильмами
	let pagination = document.querySelector('.film-gallery__pagination'); // секция с кнопками пагинации
	const homeLink = document.querySelector('.header__home-link');
	const PAGE = 'page';
	const HIDDEN = 'hidden';
	const prevPagesId = 'prev5Pages',
				nextPagesId = 'next5Pages',
				firstPageId = 'firstPage',
				lastPageId = 'lastPage',
				prevPageId = 'prevPage',
				nextPageId = 'nextPage';
	const paginationSet1Start = 1; // номер первой страницы первого блока из 5ти страниц
	const paginationSet1End = 5;
	const paginationSet2Start = 6; // номер первой страницы второго блока из 5ти страниц
	const paginationSet2End = 10;
	const paginationSet3Start = 11; // номер первой страницы третьего блока из 5ти страниц
	const paginationSet3End = 15;
	const buttonLogout = document.querySelector('.button-logout');
	const userName = document.querySelector('.user-name');

	//! Добавим админа и еще одного пользователя из файла JSON
	let usersAll = [];

	if (localStorage.getItem('users')) {
			usersAll = JSON.parse(localStorage.getItem('users'));
		} else {
			localStorage.setItem('users', users);
	}

//! получим данные о юзере
	let authorizedUser;
	let nameAuthorizedUser;
	let isAdminAuthorizedUser;
	if (localStorage.getItem('authorizedUser')) {
		authorizedUser = JSON.parse(localStorage.getItem('authorizedUser'));
		nameAuthorizedUser = authorizedUser.name;
		isAdminAuthorizedUser = authorizedUser.isAdmin;
	}

	//! изменим страницу для зарегистрированного пользователя
	if (authorizedUser) {
		body.classList.add('autorized');
		userName.innerHTML = nameAuthorizedUser;
		if (isAdminAuthorizedUser){
			body.classList.add('admin');
		}
	}
	//! Клик на кнопку log out
	buttonLogout.addEventListener('click', function () {
		body.classList.remove('autorized');
		body.classList.remove('admin');
		localStorage.removeItem('authorizedUser');
	})

	//! Функция получений данных по запросу. Нам возвращается промис. 
	// ключевое слово async перед функцией гарантирует, что эта функция в любом случае вернёт промис
	async function getResponseByPage(pageNumber, sortBy) {
		let urlFilms = `${url}&sort_by=${sortBy}&page=${pageNumber}&vote_count.gte=10`;
		const result = await fetch(urlFilms)
			.then(data => data.json())
			.then(data => data.results);
		return result;
	}

	//! Жанры
	async function getGenres() { 
		const result = await fetch(genresURL)
			.then(data => data.json())
			.then(data => data.genres);
		return result;
	}
	async function updateGenresLocalStorage(genres) {
		localStorage.setItem('genres', JSON.stringify(await genres))
	}
	updateGenresLocalStorage(getGenres());

	function updateFilmsLocalStorage(filmList) {
		localStorage.setItem('filmsInfo', JSON.stringify(filmList))
	}
	//! Предварительная предзагрузка  первых страниц 
	let pageNumbersArr = [1, 2, 3, 4, 5]; // страницы, которые будут сохранены в буфер
	let buferPag1, buferPag2, buferPag3, buferPag4, buferPag5;
	let buferArr = [buferPag1, buferPag2, buferPag3, buferPag4, buferPag5];

	function feelBufer(pagesArr, buferArr) {
		for (let i = 0; i < pagesArr.length; i++) {
			buferArr[i] = getResponseByPage(pagesArr[i], sortBy);
		}
	}
	feelBufer(pageNumbersArr,buferArr);

	createFilmCard(buferArr[0]); // грузим  сразу 1-ю страницу

	//! Функция создания карточек фильмов (в параметр - промис)
	async function createFilmCard(responsePromise) {
		let response = await responsePromise;
		updateFilmsLocalStorage(response);

		galary.innerHTML = ''; 
		response.forEach(element => {
			let card = document.createElement('li');
			let elementId = element.id;
			card.classList.add('film-item');
			card.innerHTML = `
				<h2 class='film-title flex-center'>${element.title}</h2>  
				<div class = 'film-item-wrapper'>
				<a class='film-item-link' id=${elementId} href='${filmInfoURI}?id=${elementId}'>
          <img src=${element.poster_path ? `https://image.tmdb.org/t/p/w200${element.poster_path}` : './Images/notFound200_300.jpg'} alt='${element.title}' class='film-item-img'>
					<div class='by-hover'>
					<p>Рейтинг: ${element.vote_average}</p>
					<p>Дата релиза: ${element.release_date}</p>
					</div>
				</a>
				<button class="button-remove-film button" aria-label="remove film" title="remove film">
        <svg viewBox="0 0 74 74" width="30px" xmlns="http://www.w3.org/2000/svg"><path d="m52.175 72h-30.35a3.288 3.288 0 0 1 -3.293-3.018l-4.427-50.913 1.995-.169 4.427 50.912a1.3 1.3 0 0 0 1.298 1.188h30.35a1.3 1.3 0 0 0 1.3-1.193l4.425-50.907 1.992.173-4.424 50.908a3.288 3.288 0 0 1 -3.293 3.019z"/><path d="m62.355 18.983h-50.71a1 1 0 0 1 -1-1v-3.458a5.616 5.616 0 0 1 5.609-5.61h41.492a5.616 5.616 0 0 1 5.609 5.61v3.458a1 1 0 0 1 -1 1zm-49.711-2h48.711v-2.458a3.614 3.614 0 0 0 -3.609-3.61h-41.492a3.614 3.614 0 0 0 -3.609 3.61z"/><path d="m46.221 10.915h-18.442a1 1 0 0 1 -1-1v-2.305a5.616 5.616 0 0 1 5.611-5.61h9.22a5.616 5.616 0 0 1 5.61 5.61v2.3a1 1 0 0 1 -.999 1.005zm-17.441-2h16.441v-1.305a3.614 3.614 0 0 0 -3.611-3.61h-9.22a3.614 3.614 0 0 0 -3.61 3.61z"/><path d="m28.609 43.492h37.528v2h-37.528z" transform="matrix(.062 -.998 .998 .062 .051 89.037)"/><path d="m36 25.763h2v37.458h-2z"/><path d="m25.627 25.727h2v37.528h-2z" transform="matrix(.998 -.061 .061 .998 -2.682 1.719)"/></svg>
      	</button>
				</div>
				`;
			galary.appendChild(card);
		});
		addClickListenerOnGarbage();
	}

	//! Динамическая загрузка пагинации кнопок
	function createPaginationItems(start, end) {
		let visibilityClass = '';
		pagination.innerHTML = '';
		pagination.innerHTML += `
		<a id ='${firstPageId}' class='pagination-item' href='#' aria-label='Go to the page' title='Go to the page'>First</a>
		<a id ='${prevPageId}' class='pagination-item' href='#' aria-label='Go to the page' title='Go to the page'>Prev</a>
		`
		if (start === paginationSet1Start) {
			visibilityClass = HIDDEN;
		}
		pagination.innerHTML += `
		<a id ='${prevPagesId}' class='pagination-item ${visibilityClass}' href='#' aria-label='Go to the page' title='Go to the page'>...</a>
		`;
		for (let i = start; i <= end; i++) {
			pagination.innerHTML += `
			<a id = 'page${i}' class='pagination-item ${i===1 ? 'active' : ''}' href='#' aria-label='Go to the page' title='Go to the page'>${i}</a>
			`;
		}
		if (start === paginationSet3Start) {
			visibilityClass = HIDDEN;
		} else {
			visibilityClass = '';
		}
		pagination.innerHTML += `
		<a id ='${nextPagesId}' class='pagination-item ${visibilityClass}' href='#' aria-label='Go to the page' title='Go to the page'>...</a>
		`;
		pagination.innerHTML += `
			<a id ='${nextPageId}' class='pagination-item' href='#' aria-label='Go to the page' title='Go to the page'>Next</a>
			<a id ='${lastPageId}' class='pagination-item' href='#' aria-label='Go to the page' title='Go to the page'>Last</a>
		`;
	}
	createPaginationItems(paginationSet1Start, paginationSet1End);
	//! Функция перерисовки кнопок пагинации
	function updatePaginationItems(start, end, isForward) {
		 // isForward - булевая переменная = true идем в прямом поряке, false - в обратном
		let delta;
		let prevPagesElement	= pagination.querySelector(`#${prevPagesId}`);
		let nextPagesElement	= pagination.querySelector(`#${nextPagesId}`);

		// скрытие и отображение многоточий по условиям
		if (start === paginationSet1Start) {
			prevPagesElement.classList.add(HIDDEN);
		} else {
			prevPagesElement.classList.remove(HIDDEN);
		}

		if (start === paginationSet3Start) {
			nextPagesElement.classList.add(HIDDEN);
		} else {
			nextPagesElement.classList.remove(HIDDEN);
		}
		// переопределение id и нумурации кнопок
		delta = isForward ? -5: 5; 
		for (let i = start; i <= end; i++) {
			let currentElem = pagination.querySelector(`#${PAGE}${i + delta}`);
			currentElem.innerHTML = i;
			currentElem.setAttribute('id', `${PAGE}${i}`);
		}
	}
	
	//! Событие клик по кнопке "Дом"
	homeLink.addEventListener('click',function() {
		removeActiveClass(paginationItems); // вызов функции удалить стиль 'active' со всех айтемов
		sortBy = 'popularity.desc';
		feelBufer(pageNumbersArr,buferArr);
		showFirstPageBySort();
		// сбросить значение сортировки
		selectElement.value = 'popularityDown';
	});
	//! функция добавляет стиль 'active'
	function addActiveClass(element) {
		element.classList.add('active');
	}
	//! функция удаляет стиль 'active'
	function removeActiveClass(targetArray) {
		targetArray.forEach(element => {
			element.classList.remove('active');
		})
	}

	// !------------------------------------------ PAGINATION START-----------------------------------------

	let paginationItems = document.querySelectorAll('.pagination-item'); // все кнопки пагинации
	//! функция перехода на секциии страниц в обоих направлениях (активный первый элемент секции)
	function changePageSection(paginationSetStart, paginationSetEnd, isForward) {
		updatePaginationItems(paginationSetStart, paginationSetEnd, isForward); // перерисовываем кнопки пагинации
		createFilmCard(getResponseByPage(paginationSetStart, sortBy)); // прорисовываем стартовую страницу секции страницу
		addActiveClass(pagination.querySelector(`#${PAGE}${paginationSetStart}`)); // добавляем класс к кнопке стартовой страницы
	}

	//! функция отображения первой страницы (активный первый элемент секции)
	function showFirstPageBySort(){
		if (pagination.querySelector(`#${PAGE}${paginationSet3Start}`)) {
			updatePaginationItems(paginationSet2Start, paginationSet2End, false); // перерисовываем кнопки пагинации
		} if (pagination.querySelector(`#${PAGE}${paginationSet2Start}`)) {
			updatePaginationItems(paginationSet1Start, paginationSet1End, false); // перерисовываем кнопки пагинации
		}
		createFilmCard(buferArr[0]);
		addActiveClass(pagination.querySelector(`#${PAGE}${paginationSet1Start}`)); // добавляем класс Active к кнопке 1й 
	}
	
	//! события клика по кнопкам пагинации
	paginationItems.forEach(element => {

		element.addEventListener('click', function (event) {
			let eventTarget = event.target;
			let activePageNumber = +pagination.querySelector('.active').innerHTML; // активный элемент на момент нажатия кнопки (содержание его)

			removeActiveClass(paginationItems); // вызов функции удалить стиль 'active' со всех айтемов
			
			// если клик по номеру страницы
			if (eventTarget.id.includes(PAGE)) { // проверка, что это номер страницы
				addActiveClass(eventTarget); // вызов функции добавить стиль 'active' 

				let pageNumber = +eventTarget.innerHTML;
				// если номер страницы по клику <= 5, то берем из буфера данные
				// иначе прямым запросом прорисовываем страницу
				if (pageNumber <= paginationSet1End) {
					createFilmCard(buferArr[pageNumber-1]);
				} else {
					createFilmCard(getResponseByPage(pageNumber, sortBy));
				}
			}
			// если клик по кнопке 'First'
			if (eventTarget.id === firstPageId) {
				showFirstPageBySort();
			}
			// если клик по кнопке 'Last'
			if (eventTarget.id === lastPageId) {
				if (pagination.querySelector(`#${PAGE}${paginationSet1Start}`)) {
					updatePaginationItems(paginationSet2Start, paginationSet2End, true); // перерисовываем кнопки пагинации
				} if (pagination.querySelector(`#${PAGE}${paginationSet2Start}`)) {
					updatePaginationItems(paginationSet3Start, paginationSet3End, true); // перерисовываем кнопки пагинации
				}
				createFilmCard(getResponseByPage(paginationSet3End, sortBy)); // прорисовываем 6-ю страницу
				addActiveClass(pagination.querySelector(`#${PAGE}${paginationSet3End}`)); // добавляем класс Active к кнопке 1й 
			}
			// если клик по многоточию (следующие 5 страниц)
			if (eventTarget.id === nextPagesId) {

				if (pagination.querySelector(`#${PAGE}${paginationSet1Start}`)) { // если сейчас на странице есть id=page1
					changePageSection(paginationSet2Start, paginationSet2End, true);
				} else {
					changePageSection(paginationSet3Start, paginationSet3End, true);
				}
			}
			// если клик по многоточию (предыдущие 5 страниц)
			if (eventTarget.id === prevPagesId) {

				if (pagination.querySelector(`#${PAGE}${paginationSet3End}`)) { // если сейчас на странице есть id=page15
					changePageSection(paginationSet2Start, paginationSet2End, false);
				} else {
					changePageSection(paginationSet1Start, paginationSet1End, false);
				}
			}
			// если клик по Next
			if (eventTarget.id === nextPageId) {

				if (activePageNumber === paginationSet1End) {
					changePageSection(paginationSet2Start, paginationSet2End, true);
				} else if (activePageNumber === paginationSet2End) {
					changePageSection(paginationSet3Start, paginationSet3End, true);
				} else if (activePageNumber === paginationSet3End) {
					addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber}`));
				} else {
					addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber + 1}`));
					createFilmCard(getResponseByPage(activePageNumber + 1, sortBy));
				}
			}
			// если клик по Prev
			if (eventTarget.id === prevPageId) {

				if (activePageNumber === paginationSet2Start) {
					updatePaginationItems(paginationSet1Start, paginationSet1End, false); // перерисовываем кнопки пагинации
					createFilmCard(getResponseByPage(activePageNumber - 1, sortBy)); // прорисовываем стартовую страницу секции страницу
					addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber - 1}`)); 
				} else if (activePageNumber === paginationSet3Start) {
					updatePaginationItems(paginationSet2Start, paginationSet2End, false); 
					createFilmCard(getResponseByPage(activePageNumber - 1, sortBy)); 
					addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber - 1}`));
				} else if (activePageNumber === paginationSet1Start) {
					addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber}`));
				} else {
					addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber - 1}`));
					createFilmCard(getResponseByPage(activePageNumber - 1, sortBy));
				}
			}
		});
	});
	// !------------------------------------------ PAGINATION END-----------------------------------------

	// !------------------------------------------ФИЛЬТРАЦИЯ START-----------------------------------------
	selectElement.addEventListener('change', function(event) {
		let eventTarget = event.target.value;

		removeActiveClass(paginationItems); // вызов функции удалить стиль 'active' со всех айтемов
		switch (eventTarget) {
			case 'ratingDown':
				sortBy = 'vote_average.desc';
				feelBufer(pageNumbersArr,buferArr);
				showFirstPageBySort();
				break;
			case 'ratingUp':
				sortBy = 'vote_average.asc';
				feelBufer(pageNumbersArr,buferArr);
				showFirstPageBySort();
				break;
			case 'dateReleaseDown':
				// sortBy = 'release_date.desc';
				sortBy = 'primary_release_date.desc';
				feelBufer(pageNumbersArr,buferArr);
				showFirstPageBySort();
				break;
			case 'dateReleaseUp':
				// sortBy = 'release_date.asc';
				sortBy = 'primary_release_date.asc';
				feelBufer(pageNumbersArr,buferArr);
				showFirstPageBySort();
				break;
			case 'popularityDown':
				sortBy = 'popularity.desc';
				feelBufer(pageNumbersArr,buferArr);
				showFirstPageBySort();
				break;
		}
	});
	// !------------------------------------------ФИЛЬТРАЦИЯ END-----------------------------------------

	//! клик по кнопке удалить фильм
	function addClickListenerOnGarbage() {
		document.querySelectorAll('.button-remove-film').forEach(element => {
	
			element.addEventListener('click', function (event) {
				let eventTarget = event.target;

				if (!eventTarget.classList.contains('button-remove-film')) {
					eventTarget = eventTarget.parentElement;
				}
				let elt = eventTarget.closest('.film-item');
				elt.style.display = 'none';
			});
	
	
		});
	}
	



});


