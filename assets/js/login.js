const loginForm = $.getElementById('login-form');

loginForm.addEventListener('submit', handleLoginFormSubmit);

async function handleLoginFormSubmit(e) {
    e.preventDefault();
    const { emailOrName, password } = loginForm;
    const user = {
        emailOrName: emailOrName.value,
        password: password.value,
    }

    try {
        const response = await fetch(`http://127.0.0.1:3000/users/login`, {
            body: JSON.stringify(user),
            method: 'POST',
            headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200) {
            const { token } = await response.json();
            localStorage.setItem('token', token);
            window.location.href = '/';
        }
    } catch (err) {
        if (err) throw err;
    }

}