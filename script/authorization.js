window.addEventListener('DOMContentLoaded', function () {
	const signinSubmitBtn = document.querySelector('#signin-submit');
	let inputs = document.querySelectorAll('input[data-rule]');
	
	let usersAll = [];
	let authorizedUser;
	
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
				let emailInputValue;

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
						emailInputValue = document.querySelector('#email').value;

						for (let i = 0; i < usersAll.length; i++) {
							if (emailInputValue === usersAll[i].email && value === usersAll[i].password) {
								check = true;
								message.innerHTML = '';
								authorizedUser = {};
								authorizedUser.name = usersAll[i].name;
								authorizedUser.isAdmin = usersAll[i].isAdmin;
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
	//! при нажатии на кнопку SIGN IN 
	signinSubmitBtn.addEventListener('click', function () {
		if (authorizedUser) {
			localStorage.setItem('authorizedUser', JSON.stringify(authorizedUser));
		}
	});
});
