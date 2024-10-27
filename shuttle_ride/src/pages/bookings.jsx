import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageBookings.css"; 
import { getUserBookings, cancelBooking } from "../apicalls/user"; // API calls

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getUserBookings();
        console.log(response)
        setBookings(response); 
        if (response.length === 0) {
          setError("No bookings found."); 
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings."); 
      } finally {
        setLoading(false); 
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      const response = await cancelBooking(bookingId); 
      console.log(response)
      if (response.ok) {
        alert("Booking cancelled successfully!");
        const updatedBookings = bookings.map((booking) =>
          booking.bookingId === bookingId ? { ...booking, status: "CANCELLED" } : booking
        );
        
        setBookings(updatedBookings);
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("An error occurred while cancelling the booking."); 
    }
  };

  if (loading) {
    return <p>Loading bookings...</p>; 
  }

  if (error) {
    return <p>{error}</p>; 
  }

  return (
    <div className="manage-bookings-container">
      <h1>Manage Bookings</h1>
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Bus name</th>
            <th>Seat Number</th>
            <th>Booking Time</th>
            {/* <th>Travel Date</th> */}
            {/* <th>Source</th> */}
            {/* <th>Destination</th> */}
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.bookingId}>
              <td>{booking.bookingId}</td>
              <td>{booking.busName}</td>
              <td>{booking.seatNumber}</td>
              <td>
  {(() => {
    const [year, month, day, hour, minute, second, millisecond] = booking.bookingTime;

    return `Date: ${day}:${month}:${year}    Time: ${hour}:${minute} `; 
  })()}
</td>

              {/* <td>{new Date(booking.travelDate).toLocaleDateString()}</td> */}
              {/* <td>
                ({booking.source}, {booking.source})
              </td>
              <td>
                ({booking.destination}, {booking.destination})
              </td> */}
              <td>{booking.status}</td>
              <td>
                {booking.status === "SUCCESSFUL" ? (
                  <button onClick={() => handleCancel(booking.bookingId)} className="cancel-btn">
                    Cancel Booking
                  </button>
                ) : (
                  <span>Not cancellable</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageBookings;
