window.addEventListener('DOMContentLoaded', function () {
	const addFilmButton = document.querySelector('#addFilmButton');
	const clearFilmButton = document.querySelector('#clearFilmButton');
	
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
						let length = value.length;
						let from = +this.dataset.from;
						let to = +this.dataset.to;
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


	
	// //! функция проверки на валидность всех полей
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
	// signupSubmitBtn.addEventListener('click', function () {
	// 	let name = document.querySelector('#signup-name').value;
	// 	let surName = document.querySelector('#signup-surname').value;
	// 	let password = document.querySelector('#signup-psw').value;
	// 	let email = document.querySelector('#signup-email').value;
	// 	let user = {
	// 		'name': name,
	// 		'surName': surName,
	// 		'password': password,
	// 		'email': email,
	// 		'isAdmin': false
	// 	}
	// 	usersAll.push(user);
	// 	updateUsersLocalStorage();

	// 	// заполним сразу объект авторизованного юзера
	// 	authorizedUser = {};
	// 	authorizedUser.name = user.name;
	// 	authorizedUser.isAdmin = user.isAdmin;
	// 	localStorage.setItem('authorizedUser', JSON.stringify(authorizedUser));
	// });

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

			// input.value = '';
			// input.nextElementSibling.innerHTML = '';
		})
	}




})
