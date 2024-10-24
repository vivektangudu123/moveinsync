# Shuttle Ride

by Vivek Tangudu

### Scope of the project

- **Users**
    - Book a bus seat
    - View Seat plan of the bus along with ETA
    - Cancel booking
    - Register in the website
- Admin
    - Add a bus
    - Modify bus

### Tech stack

- **Frontend**: React.js
- **Backend**: Springboot
- **Database**: Mysql ( Used an instance of AWS)

### Session management

- We generate a JWT token after successful login and pass it to the frontend for storage in the webpage. For subsequent operations, we send this token back to the backend for verification. The JWT also serves as the user identifier—by decoding it, we can retrieve the user_id. If the JWT has expired or is malfunctioning, authorization for any operations is denied. (Note: This process doesn't work in the Terminal.)

### Search

- Search for buses works using a pair of integers (representing longitude and latitude). We added stops using pairs of integers as well. To search for a journey from one place to another, we use these integer pairs. (We need to improve this to find buses within a particular radius.)

DB design. 

![Screenshot 2024-10-24 at 5.30.57 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_5.30.57_PM.png)

## API’s List

- **Login**
    - **Desc**: When a user wants to login, He uses this api tho send his mobile number.
    - **Endpoint:**  `/auth/send_otp`
    - **Method**: POST
    - **Request Body**: Details of the user (mobile number).
    - **Response**: Confirmation message or error response.( can be message where mobile number can't be found in the DB). For this I have twillio api to send an sms. ( works for verified numbers).
    
- **Verify otp**
    - **Desc**: Verify his OTP
    - **Endpoint:**`/auth/verify_otp`
    - **Method**: POST
    - **Request Body**: mobile number, OTP.
    - **Response**: Confirmation message or error response. along with JWT token.
- **Verify JWT**
    - **Desc**: When a users opens home page, we verify his JWT token.
    - **Endpoint:**`/auth/jwt`
    - **Method**: POST
    - **Request Body**:  JWT
    - **Response:**  valid token or not. if it is invalid token, User moves to login page.
- **Register**
    - **Desc**: User wants to register himself.
    - **Endpoint:**  `/users/create`
    - **Method**: POST
    - **Request Body**: mobileNumber, gender, email, Name
    - **Response**: True or false. And then he is moved to login page.  While registering same email or phone_number can't be used again. Sends an error message if you use it again.
    
- **getUserBookings**
    - **Desc**: User wants to have all his past bookings made by him.
    - **Endpoint:**  `/users/bookings`
    - **Method**: POST
    - **Request Body**: JWT
    - **Response**: List of all the bookings based on the user id.
- **book_seat**
    - **Desc**: User selected a seat and wants to book the seat.
    - **Endpoint:**  `/users/seat-booking`
    - **Method**: POST
    - **Request Body**: JWT, seat, source_latitude, source_longtitude,destination_latitude,destination_longitude
    - **Response**: True or false. True means booking was confirm and False means failed to book the seat.    If two people wants to book same seat at the same time, Only one can get the seats in the database seat changes to unavailable . So the other person can't.
    
- **Search_buses**
    - **Desc**: User wants to search for buses between some source and destination.
    - **Endpoint:** `/users/search`
    - **Method**: POST
    - **Request Body**: JWT, seat, source_latitude, source_longtitude,destination_latitude,destination_longitude
    - **Response**: True or false. True means booking was confirm and False means failed to book the seat.
- **Cancel_booking**
    - **Desc**: User wants to cancel a booking.
    - **Endpoint:** `/users/cancel-booking`
    - **Method**: POST
    - **Request Body**: JWT, bookingId
    - **Response**: True or false. True means the operation was Successful and false means failed to do.

**Interactions by the admin can be only done through terminal whereas the User can interaction with both Web and Terminal.**

### User flow in terminal.

![Screenshot 2024-10-24 at 4.15.37 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.15.37_PM.png)

2 for login. After entering my mobile number. I received an OTP.

![Screenshot 2024-10-24 at 4.16.15 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.16.15_PM.png)

![Screenshot 2024-10-24 at 4.17.30 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.17.30_PM.png)

![Screenshot 2024-10-24 at 4.22.19 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.22.19_PM.png)

And then List of busses are shown 

![Screenshot 2024-10-24 at 4.22.51 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.22.51_PM.png)

Now you can view the seat plan 

![Screenshot 2024-10-24 at 4.23.14 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.23.14_PM.png)

red seats are unavailable and remaining are available.

By selecting a Seat, he will get confirmation message.

### User flow in web

![Screenshot 2024-10-24 at 4.44.23 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.44.23_PM.png)

Landing page.

![Screenshot 2024-10-24 at 4.44.51 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.44.51_PM.png)

login page 

![Screenshot 2024-10-24 at 4.46.42 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.46.42_PM.png)

enter otp

![Screenshot 2024-10-24 at 9.13.16 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_9.13.16_PM.png)

![Screenshot 2024-10-24 at 4.47.20 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.47.20_PM.png)

Home page 

![Screenshot 2024-10-24 at 4.47.51 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.47.51_PM.png)

Booking page. ( another button will be present, if the booking was not cancelled).

![Screenshot 2024-10-24 at 4.48.41 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.48.41_PM.png)

Search results.

![Screenshot 2024-10-24 at 4.49.14 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.49.14_PM.png)

![Screenshot 2024-10-24 at 4.50.58 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.50.58_PM.png)

colour of the bus changes, based on the availability.

![Screenshot 2024-10-24 at 4.49.51 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/835612a2-0890-402e-bd09-1411cc352875.png)

Select a seat if you want to book and press book. To confirm booking, Booking status will given as an alert.

### Admin flow

![Screenshot 2024-10-24 at 4.53.27 PM.png](Shuttle%20Ride%201299dfc3ead18019912bc4a50d7eaef3/Screenshot_2024-10-24_at_4.53.27_PM.png)

As of now admin can only add a bus. 

### Future scope

- Use a builder method to create different types of Buses ( economy bus, luxury bus). Can also do for seats.
- Have a better seat locking mechanism, (scalability is an issue).
- Notifications.
    - Different types of notifications, using interfaces ( important, promotional) and sending them in different ways.( text, mail).
    - Notifications in a trip. Set of passengers that belongs to that trip, sending them about their trip.
- Strategy pattern
    - Searching buses based on ETA or based on duration.
    - Search buses around particular radius( 1KM , stops around 1km vicnity of user).

[https://github.com/vivektangudu123/moveinsync](https://github.com/vivektangudu123/moveinsync)

### Refernce project

[https://github.com/vivektangudu123/clickcare](https://github.com/vivektangudu123/clickcare)