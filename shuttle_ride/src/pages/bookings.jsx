import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageBookings.css"; // Ensure you have styles for this component
import { getUserBookings, cancelBooking } from "../apicalls/user"; // API calls

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getUserBookings();
        console.log(response)// Fetch bookings from the backend
        setBookings(response); // Directly set the bookings array
        if (response.length === 0) {
          setError("No bookings found."); // Handle no bookings
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings."); // Set error message
      } finally {
        setLoading(false); // Always set loading to false after fetch attempt
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      const response = await cancelBooking(bookingId); // Call to cancel booking
      console.log(response)
      if (response.ok) {
        alert("Booking cancelled successfully!");
        // Update the booking status locally
        const updatedBookings = bookings.map((booking) =>
          booking.bookingId === bookingId ? { ...booking, status: "CANCELLED" } : booking
        );
        
        setBookings(updatedBookings);
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("An error occurred while cancelling the booking."); // Alert for cancellation error
    }
  };

  if (loading) {
    return <p>Loading bookings...</p>; // Display loading message
  }

  if (error) {
    return <p>{error}</p>; // Display error message if there's an error
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

    const date = new Date(year, month - 1, day, hour, minute, second, millisecond);

    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });

    const formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `${formattedDate}, ${formattedTime}`; 
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
