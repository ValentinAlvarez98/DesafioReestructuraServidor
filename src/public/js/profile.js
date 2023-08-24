const form = document.getElementById('profileForm');

form.addEventListener('submit', (e) => {

      e.preventDefault();

      const data = new FormData(form);

      const obj = {}

      data.forEach((value, key) => {
            obj[key] = ['email', 'first_name', 'last_name'].includes(key) ? value.toLowerCase() : value;
      });

      fetch('/api/sessions/profile', {

            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
            }

      }).then(result => {

            if (result.status === 200) {

                  alert('Perfil actualizado correctamente');
                  window.location.href = '/profile';

            } else {

                  alert('Error al actualizar el perfil');

            };

      });

});

const deleteForm = document.getElementById('deleteForm');

deleteForm.addEventListener('submit', (e) => {

      e.preventDefault();

      fetch('/api/sessions/delete', {

            method: 'GET',
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')} `
            }

      }).then(response => {

            if (response.status === 200) {

                  response.json().then(data => {

                        localStorage.removeItem('token');

                        setTimeout(() => {
                              window.location.replace('/login');
                        }, 1250);

                  });

            } else {

                  response.json().then(data => {

                        throw new Error(data);

                  });

            }


      });

});

window.onload = function () {

      if (!localStorage.getItem('token')) {

            fetch('/api/sessions/githubToken', {

                  method: 'GET',
                  headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }

            }).then(response => {

                  if (response.status === 200) {

                        response.json().then(data => {
                              localStorage.setItem('token', data.token);
                        });

                  } else {

                        throw new Error('Error al obtener el token');

                  };

            });

      }

};