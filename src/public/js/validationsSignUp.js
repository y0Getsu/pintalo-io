	var usernameValidate = document.getElementById("usernameValidate");
	var passwordValidate = document.getElementById("passwordValidate");
	var comparePasswordValidate = document.getElementById("comparePasswordValidate");

	var validations = 0;

	var formulario = document.getElementById("formulario");

	function validateForm(){
		validateUsername();
		validatePassword();
		comparePassword();

		if(validations == 3){
			return true;
		} else {
			validations = 0;
			return false;
		}		
	}

	function validateResetPassword() {
		validatePassword();
		comparePassword();

		if(validations == 2){
			return true;
		} else {
			validations = 0;
			return false;
		}			
	}

	function validateUsername(){

		if(/^[a-zA-Z][a-zA-Z0-9-_\.]{3,16}$/.test(document.getElementById("username").value)){
			console.log("username correcto");
			usernameValidate.innerHTML = "";	
			validations++;
		} else {
			usernameValidate.innerHTML = "El usuario debe contener entre 4 y 16  carácteres alfanuméricos, sin espacios y carácteres especiales";	
			
		}		

	}

	function validatePassword(){

		if(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(document.getElementById("password").value)) {
			console.log("Contraseña correcta");
			passwordValidate.innerHTML = "";
			validations++;

		} else {
			console.log("Contraseña incorrecta");
			passwordValidate.innerHTML = "La contraseña debe tener como mínimo 8 carácteres, una mayúscula, una minúscula y un número";	
			return false;	
		}
	}

	function comparePassword(){
		let password = document.getElementById("password").value;
		let password2 = document.getElementById("password2").value;

		if(password === password2){
			console.log("Contraseña iguales");
			comparePasswordValidate.innerHTML = "";
			validations++;
		} else {
			comparePasswordValidate.innerHTML = "Las contraseñas no coinciden";
			return false;
		}
	}