const form = document.getElementById('registerForm');

form.addEventListener('submit', (e) => {

      e.preventDefault();

      const data = new FormData(form);

      const obj = {}

      data.forEach((value, key) => {
            obj[key] = ['email', 'first_name', 'last_name'].includes(key) ? value.toLowerCase() : value;
      });

      fetch('api/sessions/register', {

            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                  'Content-Type': 'application/json',
            },

      }).then(result => {

            if (result.status === 200) {

                  setTimeout(() => {

                        alert('Usuario registrado correctamente');
                        window.location.replace('/login');

                  }, 1250);

            } else {

                  alert('El usuario ya está registrado');

            };

      });

});