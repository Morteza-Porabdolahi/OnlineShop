window.onload = function () {
    const userToken = localStorage.getItem('token');

    if (userToken) {
        const { user, exp } = parseJwt(userToken);
        const date = new Date();

        if (exp * 1000 <= date.getTime()) {
            localStorage.removeItem('token');
            location.reload();
        } else {
            changeNavBtnText(user);
        }
    }
}

function changeNavBtnText(user) {
    const navUserBtn = $.querySelector('.register-btn');
    const userAccPageLink = navUserBtn.children[1];

    userAccPageLink.href = '/pages/accountPage.html';
    userAccPageLink.textContent = user.name;
    navUserBtn.classList.remove('modal-btn');
}