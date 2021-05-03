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
	let url = `https://api.themoviedb.org/3/discover/movie?api_key=43042c8dc5edb5f45ccc79e88d4730b0&page=`;
	let galary = document.querySelector('.film-galary'); // секция с фильмами
	let paginationItems = document.querySelectorAll('.pagination-item');
	let bufer = '';

	//! обработаем приходящие после запроса данные. Нам возвращается промис. Использум метод then. Его синтаксис
	//* promise.then(
	//* 	function(result) { /* обработает успешное выполнение */ },
	//* 	function(error) { /* обработает ошибку */ }
	//* );
	// Запрос прошел успешно и мы получили данные (response). Сервер нам отдает JSON-файл. Его надо распарсить, т.е.превратить в обычный массив
	//*response.json() – декодирует ответ в формате JSON
	
	async function getResponseByPage(pageNumber) { // возвращает промис
		const result = await fetch(url + pageNumber)
			.then(response => response.json())
			.then(response => response = response.results);
		return result;
	}
	createFilmCard(getResponseByPage(1));

	//! Предварительная предзагрузка  первых страниц
	pageNumber = 2; // делаем предзагрузку 2й страницы
	fetch(url + pageNumber)
		.then(response => response.json())
		.then(response => bufer = response.results); // записываем в буфер результат
	
	// const pageNumbers = [1, 2, 3, 4, 5];
	// function feelBufer(pagesArr, buferArr) {
	// 	for (let i = 0; i < pagesArr.length; i++) {
	// 		fetch(url + pageNumbers[i])
	// 			.then(response => response.json())
	// 			.then(response => buferArr[i] = response.results); // записываем в буфер результат
	// 	}
	// }
	// feelBufer(pageNumbers,buferArr);
	
	//! 3. Пишем ф-цию создания карточек фильмов
	// в пеерменной response должен придти будет массив (response.results)
	// метод forEach позвол.без изменения исходного массива перебрать каждый элемент и выполнить опред.операции
	
	async function createFilmCard(responsePromise) {
		let response = await responsePromise;
		galary.innerHTML = ''; 
		response.forEach(element => {
			let card = document.createElement('li');
			card.classList.add('film-item');
			card.innerHTML = `
				<a href="#">
          <img src="https://image.tmdb.org/t/p/w200${element.poster_path}" alt="Name of film" class="film-img">
        </a>
				<div class = 'by-hover'>
					<h2 class = 'film-title'>${element.title}</h2>
					<p class = 'film-raiting'>Рейтинг: ${element.vote_average}</p>
					<p class = 'film-release-date'>Дата релиза: ${element.release_date}</p>
				</div>
				`;
			// обращаемся к секции, в которую будем помещать карточки
			galary.appendChild(card);
		});
	}
	// ! Пэджинация
	
	paginationItems.forEach(element => {
		element.addEventListener('click', function (event) {
			removeActiveClass(paginationItems); // вызов функции добавить стиль 'active'
			addActiveClass(event.target); // вызов функции убрать стиль 'active'

			// получим содержание ссылки на номер страницы в переменную
			// let pageNumber = this.innerHTML;

			switch (pageNumber) {
				case '1' || 'First':
					getResponseByPage(pageNumber);
					break;
				case '2':
					createFilmCard(bufer); // из буфера
					break;
				case '3':
					getResponseByPage(pageNumber);
					break;
				case '4':
					getResponseByPage(pageNumber);
					break;
				case '5':
					getResponseByPage(pageNumber);
					break;
			}
		});
			
	});
	// функция добавляет стиль 'active'
	function addActiveClass(element) {
		element.classList.add('active');
	}
	// функция удаляет стиль 'active'
	function removeActiveClass(targetArray) {
		targetArray.forEach(element => {
			element.classList.remove('active');
		})
	}



});