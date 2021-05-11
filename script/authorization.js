window.addEventListener('DOMContentLoaded', function () {
	const formaAthorization = document.querySelector('#authorization-form');
	const registrationBtn = document.querySelector('#registration-btn');
	
	//! вАЛИДАЦИЯ 

	let inputs = document.querySelectorAll('input[data-rule]');

	let usersAll = [];

	usersAll = JSON.parse(localStorage.getItem('users'));
	
	for (let input of inputs) {
		input.addEventListener('blur', function () {
			// прочитаем правило
			let rule = this.dataset.rule;
			// читаем содержимое инпута
			let value = this.value;
			// message = this.value;
			let message = this.nextElementSibling;
			let check;

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
			} else {
				this.classList.remove('valid');
				this.classList.add('invalid');
			}
		});
	}


	
});
