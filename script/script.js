
// обраб.событий, который запускает скрипты, когда дом-дерево готово (Событие DOMContentLoaded происходит когда весь HTML был полностью загружен и пройден парсером, не дожидаясь окончания загрузки таблиц стилей, изображений и фреймов.)
// в виде ф-ции запускаем скрипт, который внутри
window.addEventListener('DOMContentLoaded', function () {
	const apiKey = '43042c8dc5edb5f45ccc79e88d4730b0';
	const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ru-RU`;
	const genresURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ru-RU`;
	const posterPathURL = 'https://image.tmdb.org/t/p/w200';
	const filmInfoURI = '/filmInfo.html';
	let sortBy = 'popularity.desc'; // default
	const body = document.querySelector('body');
	const selectElement = document.querySelector('select');
	const galary = document.querySelector('.film-gallery__wrapper'); // секция с фильмами
	const pagination = document.querySelector('.film-gallery__pagination'); // секция с кнопками пагинации
	const homeLink = document.querySelector('.header__home-link');
	const buttonLogout = document.querySelector('.button-logout');
	const userName = document.querySelector('.user-name');
	const PAGE = 'page';
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

	let manuallyAddedFilmsArr = JSON.parse(localStorage.getItem('manuallyAddedFilms'));
	let removeFilmsArr = [];

	//! Добавим админа и еще одного пользователя из файла JSON

	if (!localStorage.getItem('users')) {
		localStorage.setItem('users', users);
	}

//! получим данные об авторизованном пользователе
	let authorizedUser;
	let nameAuthorizedUser;
	let isAdminAuthorizedUser;
	if (localStorage.getItem('authorizedUser')) {
		authorizedUser = JSON.parse(localStorage.getItem('authorizedUser'));
		nameAuthorizedUser = authorizedUser.name;
		isAdminAuthorizedUser = authorizedUser.isAdmin;
	}

	//! изменим страницу для авторизованного пользователя
	if (authorizedUser) {
		body.classList.add('autorized');
		userName.innerHTML = nameAuthorizedUser;

		if (isAdminAuthorizedUser){
			body.classList.add('admin');
		}
	}
	//! Клик на кнопку log out
	function LogOut() {
		body.classList.remove('autorized');
		body.classList.remove('admin');
		localStorage.removeItem('authorizedUser');
	}

	buttonLogout.addEventListener('click', LogOut);

	//! Событие клик по кнопке "Дом"
	function goHome() {
		removeActiveClass(paginationItems); // вызов функции удалить стиль 'active' со всех кнопок пагинации
		sortBy = 'popularity.desc'; // сортировка по дефолту
		feelBufer(pageNumbersArr,buferArr); //приезанрузка 5ти страниц
		showFirstPageBySort(); // отрисовка 1-й страницы
		selectElement.value = 'popularityDown'; // сбросить значение сортировки
	}
	homeLink.addEventListener('click', goHome);

	//! Функция обновления локала
	function updateLocalStorage(key, object) {
		localStorage.setItem(key, JSON.stringify(object));
	}
	//! 
	const loader = document.querySelector("#loading");

	function displayLoading() {
    loader.classList.add('display');
    // остановим лоудер через некоторе время
    setTimeout(() => {
			loader.classList.remove('display');
    }, 5000);
	}

	function hideLoading() {
		loader.classList.remove("display");
	}
	//! Функция получения данных по запросу. Нам возвращается промис. 
	async function getResponseByPage(pageNumber, sortBy) {
		let urlFilms = `${url}&sort_by=${sortBy}&page=${pageNumber}&vote_count.gte=10`;
		displayLoading();
		try {
			const result = await fetch(urlFilms)
			.then(data => data.json())

			.then(data => {
				hideLoading();
				return data;
			})
			return result;
			// .catch(error => alert(error.message));
		} catch (error) {
			alert(`В данный момент сервер не доступен. Oшибка ${error}. Попробуйте позже`);
		} 
	}

	//! Жанры
	async function getGenres() { 
		try {

		const result = await fetch(genresURL)
			// декодируеь ответ в формате JSON
			.then(data => data.json())
			.then(data => data.genres)
			.catch(error => alert(error.message));
			return result;
		} catch (error) {
			alert(`В данный момент сервер не доступен. Oшибка ${error}. Попробуйте позже`);
		} 
	}

	async function updateGenresLocalStorage(genres) {
		localStorage.setItem('genres', JSON.stringify(await genres))
	}
	updateGenresLocalStorage(getGenres());

	//! Предварительная предзагрузка  первых страниц 
	const pageNumbersArr = [1, 2, 3, 4, 5]; // страницы, которые будут сохранены в буфер
	let buferPag1, buferPag2, buferPag3, buferPag4, buferPag5;
	let buferArr = [buferPag1, buferPag2, buferPag3, buferPag4, buferPag5];

	function feelBufer(pagesArr, buferArr) {
		for (let i = 0; i < pagesArr.length; i++) {
			buferArr[i] = getResponseByPage(pagesArr[i], sortBy);
		}
	}
	feelBufer(pageNumbersArr, buferArr);
	
	//! загрузим первую страницу
	createFilmCards(buferArr[0]); 

	//! Функция создания карточек фильмов (в параметр - промис)
	async function createFilmCards(responsePromise) {
		let response = await responsePromise;
		let requestResults = response.results;
		let requestedPage = response.page;
		let filmCounter = 0; //чтобы считать количество фильмов для главной страницы (не больше 20)

		// Сохраняет в стор результаты запроса на страницу
		updateLocalStorage('filmsInfo', requestResults);

		galary.innerHTML = '';
		
		// если прорисовываем 1-ю странцу и фильтры сброшены, то вначале проверяем добавлены ли фильмы админом
		// если да, то вначале отображаем их первыми
		if (sortBy === 'popularity.desc' && manuallyAddedFilmsArr && requestedPage === 1) {
			manuallyAddedFilmsArr.forEach(element => {
				addFilmCard(element);
				filmCounter++;
			})
		}
		// проверяем в локале удаленные админом фильмы
		let removedArr = JSON.parse(localStorage.getItem('removeFilmsArr'));

		for (let j = 0; j < requestResults.length; j++) {
			let isRemoved = false;
			
			// проверка по id на то, удаленный фильм или нет
			if (removedArr) {
				for (let i = 0; i < removedArr.length; i++) {
					if (requestResults[j].id == removedArr[i].id) {
						isRemoved = true;
						break;
					}
				}
			}
			// если нет удаленных фильмов, то прорисовываем оставшиеся (учитывая добавленные фильмы, не больше 20 в итоге)
			if (!isRemoved) {
				if (requestedPage === 1 && filmCounter >= 20) {
					break;
				}
				addFilmCard(requestResults[j]);
				filmCounter++;
			}
		}
		//добавим событие клика на корзину
		addClickListenerOnGarbage();
	}
	//! функция добавления карточки фильма на страницу
	function addFilmCard(element) {
		let card = document.createElement('li');

		card.classList.add('film-item');
		card.setAttribute('id', `${element.id}`);
		card.innerHTML = `
			<h2 class='film-title flex-center'>${element.title}</h2>  
			<div class = 'film-item-wrapper'>
			<a class='film-item-link' href='${filmInfoURI}?id=${element.id}'>
				<img src=${element.poster_path ? `${posterPathURL}${element.poster_path}` : './Images/notFound200_300.jpg'} alt='${element.title}' class='film-item-img'>
				<div class='by-hover'>
				<p>Рейтинг: ${element.vote_average}</p>
				<p>Дата релиза: ${element.release_date}</p>
				</div>
			</a>
			<button class="button-remove-film button" aria-label="remove film" title="remove film"></button>		
			</div>
			`;
		galary.appendChild(card);
	}

	// !------------------------------------------ PAGINATION START-----------------------------------------

	//! Динамическая загрузка кнопок пагинации
	function createPaginationItems(start, end) {
		let visibilityClass = '';

		pagination.innerHTML = '';
		pagination.innerHTML += `
		<a id ='${firstPageId}' class='pagination-item' href='#' aria-label='Go to the page' title='Go to the page'>First</a>
		<a id ='${prevPageId}' class='pagination-item' href='#' aria-label='Go to the page' title='Go to the page'>Prev</a>
		`

		if (start === paginationSet1Start) {
			visibilityClass = 'hidden';
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
			visibilityClass = 'hidden';
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
			prevPagesElement.classList.add('hidden');
		} else {
			prevPagesElement.classList.remove('hidden');
		}

		if (start === paginationSet3Start) {
			nextPagesElement.classList.add('hidden');
		} else {
			nextPagesElement.classList.remove('hidden');
		}
		// переопределение id и нумирации кнопок (в зависимости от направления)
		delta = isForward ? -5 : 5;

		for (let i = start; i <= end; i++) {
			let currentElem = pagination.querySelector(`#${PAGE}${i + delta}`);
			currentElem.innerHTML = i;
			currentElem.setAttribute('id', `${PAGE}${i}`);
		}
	}

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

	let paginationItems = document.querySelectorAll('.pagination-item'); // все кнопки пагинации

	//! функция перехода на секциии страниц в обоих направлениях (активный первый элемент секции)
	function changePageSection(paginationSetStart, paginationSetEnd, isForward) {
		updatePaginationItems(paginationSetStart, paginationSetEnd, isForward); // перерисовываем кнопки пагинации
		createFilmCards(getResponseByPage(paginationSetStart, sortBy)); // прорисовываем стартовую страницу секции страницу
		addActiveClass(pagination.querySelector(`#${PAGE}${paginationSetStart}`)); // добавляем класс к кнопке стартовой страницы
	}

	//! функция отображения первой страницы (активный первый элемент секции)
	function showFirstPageBySort(){
		if (pagination.querySelector(`#${PAGE}${paginationSet3Start}`)) {
			updatePaginationItems(paginationSet2Start, paginationSet2End, false); // перерисовываем кнопки пагинации
		} if (pagination.querySelector(`#${PAGE}${paginationSet2Start}`)) {
			updatePaginationItems(paginationSet1Start, paginationSet1End, false); // перерисовываем кнопки пагинации
		}
		createFilmCards(buferArr[0]);
		addActiveClass(pagination.querySelector(`#${PAGE}${paginationSet1Start}`)); // добавляем класс Active к кнопке 1й 
	}
	
	//! события клика по кнопкам пагинации
	const clickByPaginationButton = (event) => {
		let eventTarget = event.target;
		let eventTargetId = event.target.id;
		let activePageNumber = +pagination.querySelector('.active').innerHTML; // активный элемент на момент нажатия кнопки (содержание его)

		removeActiveClass(paginationItems); // вызов функции удалить стиль 'active' со всех айтемов
		
		// если клик по номеру страницы
		if (eventTargetId.includes(PAGE)) { // проверка, что это номер страницы
			clickByNumberPaginationBtn(eventTarget);
		}
		// если клик по кнопке 'First'
		if (eventTargetId === firstPageId) {
			showFirstPageBySort();
		}
		// если клик по кнопке 'Last'
		if (eventTargetId === lastPageId) {
			clickByLastPaginationBtn();
		}
		// если клик по Next
		if (eventTargetId === nextPageId) {
			clickByNextPaginationBtn(activePageNumber);
		}
		// если клик по многоточию (следующие 5 страниц)
		if (eventTargetId === nextPagesId) {
			clickByNextPagesPaginationBtn();
		}
		// если клик по многоточию (предыдущие 5 страниц)
		if (eventTargetId === prevPagesId) {
			clickByPrevPagesPaginationBtn();
		}
		// если клик по Prev
		if (eventTargetId === prevPageId) {
			clickByPrevPaginationBtn(activePageNumber)
		}
	}
	// добавим событие на клик для всех кнопок пагинации
	paginationItems.forEach(element => {
		element.addEventListener('click', clickByPaginationButton)
	});

	//! Функция клика по номеру страницы
	function clickByNumberPaginationBtn(eventTarget) {
		addActiveClass(eventTarget); // вызов функции добавить стиль 'active' 

		let pageNumber = +eventTarget.innerHTML;
		// если номер страницы по клику <= 5, то берем из буфера данные
		// иначе прямым запросом прорисовываем страницу
		if (pageNumber <= paginationSet1End) {
			createFilmCards(buferArr[pageNumber-1]);
		} else {
			createFilmCards(getResponseByPage(pageNumber, sortBy));
		}
	}
	//! Функция клика по пкнопке Last
	function clickByLastPaginationBtn() {
		if (pagination.querySelector(`#${PAGE}${paginationSet1Start}`)) {
			updatePaginationItems(paginationSet2Start, paginationSet2End, true); // перерисовываем кнопки пагинации
		} if (pagination.querySelector(`#${PAGE}${paginationSet2Start}`)) {
			updatePaginationItems(paginationSet3Start, paginationSet3End, true); // перерисовываем кнопки пагинации
		}
		createFilmCards(getResponseByPage(paginationSet3End, sortBy)); // прорисовываем 6-ю страницу
		addActiveClass(pagination.querySelector(`#${PAGE}${paginationSet3End}`)); // добавляем класс Active к кнопке 1й 
	}
	//! Функция клика по кнопке Next
	function clickByNextPaginationBtn(activePageNumber) {
		if (activePageNumber === paginationSet1End) {
			changePageSection(paginationSet2Start, paginationSet2End, true);
		} else if (activePageNumber === paginationSet2End) {
			changePageSection(paginationSet3Start, paginationSet3End, true);
		} else if (activePageNumber === paginationSet3End) {
			addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber}`));
		} else {
			addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber + 1}`));
			createFilmCards(getResponseByPage(activePageNumber + 1, sortBy));
		}
	}
	//! Функция клика по кнопке Prev
	function clickByPrevPaginationBtn(activePageNumber) {
		if (activePageNumber === paginationSet2Start) {
			updatePaginationItems(paginationSet1Start, paginationSet1End, false); // перерисовываем кнопки пагинации
			createFilmCards(getResponseByPage(activePageNumber - 1, sortBy)); // прорисовываем стартовую страницу секции страницу
			addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber - 1}`)); 
		} else if (activePageNumber === paginationSet3Start) {
			updatePaginationItems(paginationSet2Start, paginationSet2End, false); 
			createFilmCards(getResponseByPage(activePageNumber - 1, sortBy)); 
			addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber - 1}`));
		} else if (activePageNumber === paginationSet1Start) {
			addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber}`));
		} else {
			addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber - 1}`));
			createFilmCards(getResponseByPage(activePageNumber - 1, sortBy));
		}
	}
	//! Функция клика по кнопке многоточию следующий блок страниц
	function clickByNextPagesPaginationBtn() {
		if (pagination.querySelector(`#${PAGE}${paginationSet1Start}`)) { // если сейчас на странице есть id=page1
			changePageSection(paginationSet2Start, paginationSet2End, true);
		} else {
			changePageSection(paginationSet3Start, paginationSet3End, true);
		}
	}
	//! Функция клика по кнопке многоточию предыдущий блок страниц
	function clickByPrevPagesPaginationBtn() {
		if (pagination.querySelector(`#${PAGE}${paginationSet3End}`)) { // если сейчас на странице есть id=page15
			changePageSection(paginationSet2Start, paginationSet2End, false);
		} else {
			changePageSection(paginationSet1Start, paginationSet1End, false);
		}
	}
	// !------------------------------------------ PAGINATION END-----------------------------------------

	// !------------------------------------------ФИЛЬТРАЦИЯ START-----------------------------------------
	const changePageBySort = (event) => {
		let eventTarget = event.target.value;
		
		removeActiveClass(paginationItems); // вызов функции удалить стиль 'active' со всех айтемов

		const caseOf = (valueSort) => {
			sortBy = valueSort;
			feelBufer(pageNumbersArr,buferArr);
			showFirstPageBySort();
		}

		switch (eventTarget) {
			case 'ratingDown':
				caseOf('vote_average.desc')
				break;

			case 'ratingUp':
				caseOf('vote_average.asc')
				break;

			case 'dateReleaseDown':
				caseOf('primary_release_date.desc')
				break;

			case 'dateReleaseUp':
				caseOf('primary_release_date.asc')
				break;

			case 'popularityDown':
				caseOf('popularity.desc')
				break;
		}
	}
	selectElement.addEventListener('change', changePageBySort);
	
	// !------------------------------------------ФИЛЬТРАЦИЯ END-----------------------------------------

	//! клик по кнопке удалить фильм

	if (localStorage.getItem('removeFilmsArr')) {
		removeFilmsArr = JSON.parse(localStorage.getItem('removeFilmsArr'));
	}

	function addClickListenerOnGarbage() {
		document.querySelectorAll('.button-remove-film').forEach(element => {
			element.addEventListener('click', clickByGarbage)	
		});
	}

	function clickByGarbage(event) {
		let eventTarget = event.target;
		let eltLi = eventTarget.closest('.film-item');
		let filmId = eltLi.getAttribute('id');

		eltLi.style.display = 'none';
		// если удаляется фильм, добавленный админом, то удаляем его из локала
		removeManuallyAddedFilm ( filmId, manuallyAddedFilmsArr );
		// если не админский фильм, то добавялем объект с его id в локал, чтобы после не отображать его при загрузке страницы
		let removeFilmId = {
			'id': filmId,
		}

		removeFilmsArr.push(removeFilmId);
		updateLocalStorage('removeFilmsArr', removeFilmsArr);
	}

	function removeManuallyAddedFilm (filmId, filmsArr) {
		for (let i = 0; i < filmsArr.length; i++) {
			if (filmId == filmsArr[i].id) {
				filmsArr.splice(i, 1);
				updateLocalStorage('manuallyAddedFilms', filmsArr);
				return;
			}
		}
	}
	
});


