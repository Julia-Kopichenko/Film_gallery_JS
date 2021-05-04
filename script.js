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
	let url = 'https://api.themoviedb.org/3/discover/movie?api_key=43042c8dc5edb5f45ccc79e88d4730b0';
	let galary = document.querySelector('.film-galary'); // секция с фильмами
	let pagination = document.querySelector('.pagination'); // секция с кнопками пагинации
	const PAGE = 'page';
	const HIDDEN = 'hidden';
	const prevPagesId = 'prev5Pages';
	const nextPagesId = 'next5Pages';
	const firstPageId = 'firstPage';
	const lastPageId = 'lastPage';
	const prevPageId = 'prevPage';
	const nextPageId = 'nextPage';
	const paginationSet1Start = 1; // номер первой страницы первого блока из 5ти страниц
	const paginationSet1End = 5;
	const paginationSet2Start = 6; // номер первой страницы второго блока из 5ти страниц
	const paginationSet2End = 10;
	const paginationSet3Start = 11; // номер первой страницы третьего блока из 5ти страниц
	const paginationSet3End = 15;

	//! Функция получений данных по запросу. Нам возвращается промис. 
	async function getResponseByPage(pageNumber) { // возвращает промис
		const result = await fetch(`${url}&page=${pageNumber}`)
			.then(response => response.json())
			.then(response => response = response.results);
		return result;
	}
	createFilmCard(getResponseByPage(1)); // грузим  сразу 1-ю страницу

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

	//! Предварительная предзагрузка  первых страниц (под вопросом)
	let pageNumbersArr = [1, 2, 3, 4, 5];
	let buferPag1, buferPag2, buferPag3, buferPag4, buferPag5;
	let buferArr = [buferPag1, buferPag2, buferPag3, buferPag4, buferPag5];

	function feelBufer(pagesArr, buferArr) {
		for (let i = 0; i < pagesArr.length; i++) {
			buferArr[i] = getResponseByPage(pagesArr[i]);
		}
	}
	feelBufer(pageNumbersArr,buferArr);
	//! Функция создания карточек фильмов (в параметр - промис)
	async function createFilmCard(responsePromise) {
		let response = await responsePromise;

		galary.innerHTML = ''; 
		response.forEach(element => {
			let card = document.createElement('li');

			card.classList.add('film-item');
			card.innerHTML = `
				<a href='#'>
          <img src='https://image.tmdb.org/t/p/w200${element.poster_path}' alt='Name of film' class='film-img'>
        </a>
				<div class = 'by-hover'>
					<h2 class = 'film-title'>${element.title}</h2>
					<p class = 'film-raiting'>Рейтинг: ${element.vote_average}</p>
					<p class = 'film-release-date'>Дата релиза: ${element.release_date}</p>
				</div>
				`;
			galary.appendChild(card);
		});
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

	// !------------------------------------------ PAGINATION START-----------------------------------------

	let paginationItems = document.querySelectorAll('.pagination-item'); // все кнопки пагинации
	
	//! функция перехода на секциии страниц в обоих направлениях (активный первый элемент секции)
	function changePageSection(paginationSetStart, paginationSetEnd, isForward) {
		updatePaginationItems(paginationSetStart, paginationSetEnd, isForward); // перерисовываем кнопки пагинации
		createFilmCard(getResponseByPage(paginationSetStart)); // прорисовываем стартовую страницу секции страницу
		addActiveClass(pagination.querySelector(`#${PAGE}${paginationSetStart}`)); // добавляем класс к кнопке стартовой страницы
	}

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
					createFilmCard(getResponseByPage(pageNumber));
				}
			}
			// если клик по кнопке 'First'
			if (eventTarget.id === firstPageId) {
				if (pagination.querySelector(`#${PAGE}${paginationSet3Start}`)) {
					updatePaginationItems(paginationSet2Start, paginationSet2End, false); // перерисовываем кнопки пагинации
				} if (pagination.querySelector(`#${PAGE}${paginationSet2Start}`)) {
					updatePaginationItems(paginationSet1Start, paginationSet1End, false); // перерисовываем кнопки пагинации
				}
				createFilmCard(buferArr[0]);
				addActiveClass(pagination.querySelector(`#${PAGE}${paginationSet1Start}`)); // добавляем класс Active к кнопке 1й 
			}
			// если клик по кнопке 'Last'
			if (eventTarget.id === lastPageId) {
				if (pagination.querySelector(`#${PAGE}${paginationSet1Start}`)) {
					updatePaginationItems(paginationSet2Start, paginationSet2End, true); // перерисовываем кнопки пагинации
				} if (pagination.querySelector(`#${PAGE}${paginationSet2Start}`)) {
					updatePaginationItems(paginationSet3Start, paginationSet3End, true); // перерисовываем кнопки пагинации
				}
				createFilmCard(getResponseByPage(paginationSet3End)); // прорисовываем 6-ю страницу
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
					createFilmCard(getResponseByPage(activePageNumber + 1));
				}
			}
			// если клик по Prev
			if (eventTarget.id === prevPageId) {

				if (activePageNumber === paginationSet2Start) {
					updatePaginationItems(paginationSet1Start, paginationSet1End, false); // перерисовываем кнопки пагинации
					createFilmCard(getResponseByPage(activePageNumber - 1)); // прорисовываем стартовую страницу секции страницу
					addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber - 1}`)); 
				} else if (activePageNumber === paginationSet3Start) {
					updatePaginationItems(paginationSet2Start, paginationSet2End, false); 
					createFilmCard(getResponseByPage(activePageNumber - 1)); 
					addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber - 1}`));
				} else if (activePageNumber === paginationSet1Start) {
					addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber}`));
				} else {
					addActiveClass(pagination.querySelector(`#${PAGE}${activePageNumber - 1}`));
					createFilmCard(getResponseByPage(activePageNumber - 1));
				}
			}
		});
	});
	// !------------------------------------------ PAGINATION END-----------------------------------------

	// !------------------------------------------ФИЛЬТРАЦИЯ START-----------------------------------------
	
	

	
});
