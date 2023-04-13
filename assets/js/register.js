const registerForm = $.getElementById('register-form');

registerForm.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(e) {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
        const { name, password, email } = registerForm;
        const newUser = {
            name: name.value,
            password: password.value,
            email: email.value
        }

        try {
            const response = await fetch(`http://127.0.0.1:3000/users`, {
                body: JSON.stringify(newUser),
                method: 'POST',
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 201) {
                const { token } = await response.json();
                localStorage.setItem('token', token);
                window.location.href = '/';
            }
        } catch (err) {
            if (err) throw err;
        }
    }
}