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
	//! 1. GET-запрос по адресу
	
	fetch("https://api.themoviedb.org/3/discover/movie?api_key=43042c8dc5edb5f45ccc79e88d4730b0")
	
	//! 2. обработаем приходящие после запроса данные. Нам возвращается промис. Использум метод then. Его синтаксис
	//* promise.then(
	//* 	function(result) { /* обработает успешное выполнение */ },
	//* 	function(error) { /* обработает ошибку */ }
	//* );
	// Запрос прошел успешно и мы получили данные (response). Сервер нам отдает JSON-файл. Его надо распарсить, т.е.превратить в обычный массив
	//*response.json() – декодирует ответ в формате JSON
	
		.then(response => response.json()) // но эта команда возвращает промис
		// .then(response => console.log(response)) // просто проверка 
		.then(response => createFilmCard(response.results));
	
	//! 3. Пишем ф-цию создания карточек фильмов
	// в пеерменной response должен придти будет массив (response.results)
	// метод forEach позвол.без изменения исходного массива перебрать каждый элемент и выполнить опред.операции
	function createFilmCard(response) {
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
			document.querySelector('.film-galary').appendChild(card);
		});
	}
	// ! Пагинация
	const paginationItems = document.querySelectorAll('.pagination-item');
	
	paginationItems.forEach(element => {
		element.addEventListener('click', function (event) {
			removeActiveClass(paginationItems);
			addActiveClass(event.target);
		})
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