function fetchAllProducts() {
    const userToken = localStorage.getItem('token');
    if (userToken) {
        try {
            const response = fetch(`${apiUrl}/items`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            });
            return response;
        } catch (err) {
            if (err) throw err;
        }
    }
}


async function addProductInCart(productId, quantity) {
    const userToken = localStorage.getItem('token');
    if (userToken) {
        const cartProduct = {
            itemId: productId,
            quantity,
        }
        const response = await fetch(`${apiUrl}/cart`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cartProduct)
        });
        if (response.status === 200) {
            return response.json();
        }
    }
}
