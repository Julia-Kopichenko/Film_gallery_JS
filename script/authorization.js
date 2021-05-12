window.addEventListener('DOMContentLoaded', function () {
	const signinSubmitBtn = document.querySelector('#signin-submit');
	let inputs = document.querySelectorAll('input[data-rule]');
	let usersAll = [];
	
	usersAll = JSON.parse(localStorage.getItem('users'));

	//! вАЛИДАЦИЯ 
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
					case 'isExistingUser':
						for (let i = 0; i < usersAll.length; i++) {
							if (value === usersAll[i].email) {
								check = true;
								message.innerHTML = '';
								break;
							} else {
								check = false;
								message.innerHTML = 'Данный пользователь в системе не зарегистрирован';
							}
						}
						break;
					case 'CorrectPsw':
						let emailInputValue = document.querySelector('#email').value;
						for (let i = 0; i < usersAll.length; i++) {
							if (emailInputValue === usersAll[i].email && value === usersAll[i].password) {
								check = true;
								message.innerHTML = '';
								break;
							} else {
								check = false;
								message.innerHTML = 'Введенный пароль не верен';
							}
						}
						break;
				}
				if (check) {
					this.classList.remove('invalid');
					this.classList.add('valid');
					if (allInputsAreValid()) {
						//снять аттрибут и класс disabled
						signinSubmitBtn.classList.remove('button-disabled');
						signinSubmitBtn.classList.add('button-primary');
						signinSubmitBtn.removeAttribute('disabled');
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
		let allInputs = document.querySelectorAll('input');

		for (let i = 0; i < allInputs.length; i++) {
			if(!allInputs[i].classList.contains('valid')) {
				isValid = false;
				break;
			}
		}
		return isValid;
	}
	//! при нажатии на кнопку SIGN IN (не сработала)
	// signinSubmitBtn.addEventListener('click', function () {
	// 	// location.replace('/index.html');
	// 	console.log('Вот, работает');
	// 	document.location.href = "/index.html";
	// });


});
