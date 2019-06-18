$(document).ready(function() {
	$('.hidden').fadeIn('slow');

	function hideErrorMessage(){
		setTimeout( () => {
			$(".errorMessage").fadeOut('slow');
		}, 2500);	
	}

	setTimeout( () => {
		$(".successfullMessage").fadeOut('slow');
	}, 2500);		
	
	$('#enviarUsername').click(function (req, res) {
		if(/^[a-zA-Z][a-zA-Z0-9-_\.]{3,16}$/.test($('#username').val())) {
			console.log('usuario correcto');

		} else {
			console.log('usuario NO correcto');
			let errorValidation = `<div class="errorMessage"><i class="fas fa-exclamation-triangle"></i>Recuerda que usuario debe contener entre 4 y 16  carácteres alfanuméricos, sin espacios y carácteres especiales</div>`;
			$('.contenedorNombreUsuario').append(errorValidation);
			hideErrorMessage();
			return false;


		}			
	});

	$('#enviarPassword').click(function () {
		if(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test($('#password').val())) {
			console.log('password correcta');

		} else {
			console.log('password NO correcta');
			let errorValidation = `<div class="errorMessage"><i class="fas fa-exclamation-triangle"></i>Recuerda que la contraseña debe tener como mínimo 8 carácteres, una mayúscula, una minúscula y un número</div>`;
			$('.contenedorNombreUsuario').append(errorValidation);
			hideErrorMessage();
			return false;

		}			
	});


});