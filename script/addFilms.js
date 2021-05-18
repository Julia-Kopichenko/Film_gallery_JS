window.addEventListener('DOMContentLoaded', function () {
	const addFilmButton = document.querySelector('#addFilmButton');
	const clearFilmButton = document.querySelector('#clearFilmButton');
	
	//! изменим страницу для зарегистрированного пользователя
	//! для кнопок регситрации (копипаст,но пока так)
	const buttonLogout = document.querySelector('.button-logout');
	const userName = document.querySelector('.user-name');
	const body = document.querySelector('body');
	let genresJson = JSON.parse(localStorage.getItem('genres'));
	let manuallyAddedFilms = [];


//! заполнение селекта жанров фильма
	let select = document.querySelector('#addFilmGenres');
	select.innerHTML = '';

	genresJson.forEach(element => {
		select.innerHTML += `
			<option value='${element.id}'>${element.name}</option>
		`;
	});
	
	//! получим данные о юзере
	let authorizedUser;
	let nameAuthorizedUser;
	let isAdminAuthorizedUser;
	if (localStorage.getItem('authorizedUser')) {
		authorizedUser = JSON.parse(localStorage.getItem('authorizedUser'));
		nameAuthorizedUser = authorizedUser.name;
		isAdminAuthorizedUser = authorizedUser.isAdmin;
	}
	
	if (!isAdminAuthorizedUser) {
		location.href = "/NotFoudPage.html";
	}
	if (authorizedUser) {
		body.classList.add('autorized');
		userName.innerHTML = nameAuthorizedUser;
	}
	//! при клике на кнопку log out
	buttonLogout.addEventListener('click', function () {
		body.classList.remove('autorized');
		body.classList.remove('admin');
		localStorage.removeItem('authorizedUser');
		location.href = "/NotFoudPage.html";
	})

	//! вАЛИДАЦИЯ
	// let inputs = document.querySelectorAll('[data-rule]');
	let inputs = document.querySelectorAll('.form__input');
	// let regNumber = /^\d+$/; // любое положительное число (в том числе и дробное). popularity
	let regNumber = /^[-+]?[0-9]*[.,]?[0-9]+(?:[eE][-+]?[0-9]+)?$/; // любое положительное число (в том числе и дробное). popularity
	let regNumberTo10 = /^([1-9]|1[0])$/; // целое число от 0 до 10(включительно)

	
	for (let input of inputs) {
		input.oninput = function() {
			// прочитаем правило
			let rule = this.dataset.rule;
			// читаем содержимое инпута
			let value = this.value;
			// message = this.value;
			let message = this.nextElementSibling;
			let check;

			if (value.length > 0) {
				check = true;

				let length, from, to;
				switch (rule) {
					
					case 'lengthFrom':
						if (value.length > +this.dataset.from) {
							check = true;
							message.innerHTML = '';
						} else {
							check = false;
							message.innerHTML = `Длина должна быть более ${this.dataset.from} символов`;
						}
						break;

					case 'lengthFromTo':
						length = value.length;
						from = +this.dataset.from;
						to = +this.dataset.to;
						if (length > from && length <= to) {
							check = true;
							message.innerHTML = '';
						} else {
							check = false;
							message.innerHTML = `Длина должна быть более ${from} и менее ${to} символов`;
						}
						break;
					
					case 'number':
						check = regNumber.test(value);
						if (check) {
							message.innerHTML = '';
						} else {
							message.innerHTML = 'Введите число';
						}
						break;
					
					case 'numberTo10':
						check = regNumberTo10.test(value);
						if (check) {
							message.innerHTML = '';
						} else {
							message.innerHTML = 'Введите целое число от 1 до 10';
						}
						break;
				}
	
				if (check) {
					this.classList.remove('invalid');
					this.classList.add('valid');

					if (allInputsAreValid()) {
						addFilmButton.removeAttribute('disabled');
					}
				} else {
					this.classList.remove('valid');
					this.classList.add('invalid');
				}
			} 
		};
	}
	
	//! функция проверки на валидность всех полей
	function allInputsAreValid() {
		let isValid = true;
		let allInputs = document.querySelectorAll('.form__input');
		for (let i = 0; i < allInputs.length; i++) {
			if(!allInputs[i].classList.contains('valid')) {
				isValid = false;
				break;
			}
		}
		return isValid;
	}
	
	//! при нажатии на кнопку SIGN UP

	if (localStorage.getItem('manuallyAddedFilms')) {
		manuallyAddedFilms = JSON.parse(localStorage.getItem('manuallyAddedFilms'));
	}

	function updateManuallyAddedFilmsLocalStorage() {
		localStorage.setItem('manuallyAddedFilms', JSON.stringify(manuallyAddedFilms));
	}

	addFilmButton.addEventListener('click', function () {
		let title = document.querySelector('#addFilmTitle').value;
		let overview = document.querySelector('#addFilmOverview').value;
		let poster_path = document.querySelector('#addFilmPosterPath').value;
		let popularity = document.querySelector('#addFilmPopularity').value;
		let release_date = document.querySelector('#addFilmReleaseDate').value;
		let genre_ids = Array.from(select.options)
    .filter(option => option.selected)
    .map(option => +option.value);
		let vote_average = document.querySelector('#addFilmVoteAverage').value;
		let vote_count = document.querySelector('#addFilmVoteCount').value;
		let adult = document.querySelector('#addFilmAdult').checked;

		let film = {
			'id': Date.now(),
			'title': title,
			'overview': overview,
			'poster_path': poster_path,
			'popularity': popularity,
			'release_date': release_date,
			'genre_ids': genre_ids,
			'vote_average': vote_average,
			'vote_count': vote_count,
			'adult': adult
		}
		console.log(film);
		manuallyAddedFilms.push(film);
		updateManuallyAddedFilmsLocalStorage();
	});

	//! при нажатии на кнопку Clear
	clearFilmButton.addEventListener('click', function () {
		clearForm();
	})
	//! Функция очистки формы
	function clearForm() {
		inputs.forEach(input => {
			input.classList.remove('invalid');
			input.classList.remove('valid');
			addFilmButton.setAttribute('disabled');
		})
	}

})
