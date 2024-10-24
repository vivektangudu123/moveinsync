
export const loginUser = async (mobileNumber, Role) => {
    try {
        const response = await fetch('http://localhost:5001/auth/send_otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mobileNumber: mobileNumber, 
                role: Role                   
            })
        });

        if (response.ok) {
            const data = await response.text();
            return data === "pending" ? "pending" : data;
        } else {
            console.log(`Request failed with status: ${response.status}`);
            return "error";
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const Login_OTP = async (mobileNumber, otp) => {
    try {
        const response = await fetch("http://localhost:5001/auth/verify_otp", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                mobileNumber: mobileNumber, 
                otp: otp                   
            })
        });
        if (response.ok) {
            const data = await response.text();
            if (data === "-1") {
                return false;
            } else {
                localStorage.setItem("JWT", data);
                return true;
            }
        }else {
            console.log("Request failed with status:", response.status);
            return "error";
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }

}
export const getUserBookings = async () => {
    const token = localStorage.getItem('JWT');
    const response = await fetch("http://localhost:5001/users/bookings", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jwt: token
        })
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data; 
};
export const book_seat = async (busId,seat,s1,s2,d1,d2) => {
    const token = localStorage.getItem('JWT');
    const response = await fetch("http://localhost:5001/users/seat-booking", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            BusId: busId,
            seat: seat,
            s1: s1,
            s2: s2,
            d1: d1,
            d2: d2,
            jwt: token
        })
    }).then(response => response.text()) 
    .then(data => {
        console.log(data); 
        return true;
    })
    .catch(error => {
      console.error('Error:', error);
    });
};
export const cancelBooking = async (bookingId) => {
    const token = localStorage.getItem('JWT');
    console.log(bookingId);
    const response = await fetch("http://localhost:5001/users/cancel-booking", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            BookingID:bookingId,
            jwt:token
           })
    });
    return response;
};
export const search_busses = async (s1, s2, d1, d2) => {
    const token = localStorage.getItem('JWT');
    const response = await fetch("http://localhost:5001/users/search", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({
            s1: s1,
            s2: s2,
            d1: d1,
            d2: d2
        })
    });

    const data = await response.json();
    return data; 
};

    