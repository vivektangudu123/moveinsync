export const verify_jwt = async (token) => {

    await fetch("http://localhost:5001" + '/auth/jwt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },

        body: JSON.stringify({
         jwt:token
        })
    })
        .then(response => {
            console.log(response)
            response.text()
        })
        .then(data => {
            console.log(data)
                return data;
        })
        .catch(error => {
            console.log(error)
        });
};