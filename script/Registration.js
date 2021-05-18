window.addEventListener('DOMContentLoaded', function () {
	const signupSubmitBtn = document.querySelector('#signup-submit');
	const signupClearBtn = document.querySelector('#signup-clear');
	
	//! вАЛИДАЦИЯ
	let regEmail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;

	// Метод test() выполняет поиск сопоставления регулярного выражения указанной строке. Возвращает true или false.
	// найдем все инпуты, которые должны валидировать свое содержимое (у которых есть data-rule)
	let inputs = document.querySelectorAll('input[data-rule]');
	let psw = document.querySelector('#signup-psw');
	
	for (let input of inputs) {
		// input.addEventListener('blur', function () {
		input.oninput = function() {
			// прочитаем правило
			let rule = this.dataset.rule;
			// читаем содержимое инпута
			let value = this.value;
			// message = this.value;
			let message = this.nextElementSibling;
			let check;
			if (value.length > 0) {
				switch (rule) {
					case 'length':
						if (value.length > +this.dataset.from) {
							check = true;
							message.innerHTML = '';
						} else {
							check = false;
							message.innerHTML = `Длина должна быть более ${this.dataset.from} символов`;
						}
						break;
					case 'email':
						check = regEmail.test(value);
						if (check) {
							message.innerHTML = '';
						} else {
							message.innerHTML = 'Введите корректный электронный адрес';
						}
						break;
					case 'psw-repeat':
						if (value === psw.value && value !== '') {
							check = true;
							message.innerHTML = '';
						} else {
							check = false;
							message.innerHTML = 'Попробуйте еще раз';
						}
						break;
				}
	
				if (check) {
					this.classList.remove('invalid');
					this.classList.add('valid');
					if (allInputsAreValid()) {
						signupSubmitBtn.removeAttribute('disabled');
					}
				} else {
					this.classList.remove('valid');
					this.classList.add('invalid');
				}
			}
			
		};
	}

	let usersAll = [];
	let authorizedUser;
	
	usersAll = JSON.parse(localStorage.getItem('users'));
	
	function updateUsersLocalStorage() {
		localStorage.setItem('users', JSON.stringify(usersAll));
	}
	//! функция проверки на валидность всех полей
	function allInputsAreValid() {
		let isValid = true;
		let allInputs = document.querySelectorAll('input');
		for (let i = 0; i < allInputs.length; i++) {
			if(!allInputs[i].classList.contains('valid')) {
				isValid = false;
				break;
			}
		}
		return isValid;
	}
	
	//! при нажатии на кнопку SIGN UP
	signupSubmitBtn.addEventListener('click', function () {
		let name = document.querySelector('#signup-name').value;
		let surName = document.querySelector('#signup-surname').value;
		let password = document.querySelector('#signup-psw').value;
		let email = document.querySelector('#signup-email').value;
		let user = {
			'name': name,
			'surName': surName,
			'password': password,
			'email': email,
			'isAdmin': false
		}
		usersAll.push(user);
		updateUsersLocalStorage();

		// заполним сразу объект авторизованного юзера
		authorizedUser = {};
		authorizedUser.name = user.name;
		authorizedUser.isAdmin = user.isAdmin;
		localStorage.setItem('authorizedUser', JSON.stringify(authorizedUser));
	});

	//! при нажатии на кнопку Clear
	signupClearBtn.addEventListener('click', function () {
		clearForm();
	})
	//! Функция очистки формы
	function clearForm() {
		inputs.forEach(input => {
			input.classList.remove('invalid');
			input.classList.remove('valid');
			input.value = '';
			input.nextElementSibling.innerHTML = '';
		})
	}




});
