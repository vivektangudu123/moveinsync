import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { search_busses ,book_seat} from '../apicalls/user';
import { verify_jwt } from "../apicalls/axiosInstance";
import './HomePage.css'; 

const HomePage = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [sourceLatitude, setSourceLatitude] = useState("");
  const [sourceLongitude, setSourceLongitude] = useState("");
  const [destinationLatitude, setDestinationLatitude] = useState("");
  const [destinationLongitude, setDestinationLongitude] = useState("");
  const [selectedSeatPlan, setSelectedSeatPlan] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedBusId, setSelectedBusId] = useState(null); // New state for busId
  const [isModalOpen, setIsModalOpen] = useState(false);

  // JWT verification
  useEffect(() => {
    const token = localStorage.getItem('JWT');
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await verify_jwt(token);
          if (response === "-1" || response === "-2") {
            navigate("/login");
          }
        } catch (error) {
          console.error("Error verifying JWT:", error);
          navigate("/login");
        }
      };
      verifyToken();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleManageBookings = () => {
    navigate("/manage-bookings");
  };

  const handleLogout = () => {
    localStorage.removeItem('JWT');
    navigate("/login");
  };

  const viewSeatPlan = (seatPlan, busId) => {
    setSelectedSeatPlan(seatPlan);
    setSelectedBusId(busId); // Set the selected busId
    setIsModalOpen(true);
  };

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeat(seatNumber);
  };

  const handleBooking = async () => {
    try {
      if (selectedSeat && selectedBusId) {
        // Uncomment this line and implement your booking API call
        await book_seat(selectedBusId, selectedSeat,sourceLatitude,sourceLongitude,destinationLatitude,destinationLongitude); // Call the booking API with busId and seat
        alert(`Seat booked: ${selectedSeat} on Bus ID: ${selectedBusId}`);
        // Reset everything
        setSelectedSeat(null);
        setSelectedBusId(null); // Reset the busId
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error booking seat:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (sourceLatitude === "" || sourceLongitude === "" || destinationLatitude === "" || destinationLongitude === "") {
      alert("Please fill in both source and destination coordinates.");
      return;
    }
    if (sourceLatitude < -1 || sourceLatitude > 20 || destinationLatitude < -1 || destinationLatitude > 20 ||
      sourceLongitude < -1 || sourceLongitude > 20 || destinationLongitude < -1 || destinationLongitude > 20) {
      alert("Invalid latitude or longitude values. Please enter valid coordinates.");
      return;
    }

    try {
      const busData = await search_busses(sourceLatitude, sourceLongitude, destinationLatitude, destinationLongitude);
      setBuses(busData);
    } catch (err) {
      console.error('Error fetching buses:', err);
    }
  };

  return (
    <div className="homepage-container">
      <div className="top-buttons">
        <button onClick={handleManageBookings} className="top-btn">Manage Bookings</button>
        <button onClick={handleLogout} className="top-btn">Logout</button>
      </div>

      <div className="search-container">
        <h1>Bus Search</h1>
        <form onSubmit={handleSearch} className="horizontal-form">
          <div className="coordinate-input">
            <label>Source Latitude</label>
            <input
              type="number"
              value={sourceLatitude}
              onChange={(e) => setSourceLatitude(e.target.value)}
              placeholder="Source Latitude"
              required
            />
          </div>
          <div className="coordinate-input">
            <label>Source Longitude</label>
            <input
              type="number"
              value={sourceLongitude}
              onChange={(e) => setSourceLongitude(e.target.value)}
              placeholder="Source Longitude"
              required
            />
          </div>
          <div className="coordinate-input">
            <label>Destination Latitude</label>
            <input
              type="number"
              value={destinationLatitude}
              onChange={(e) => setDestinationLatitude(e.target.value)}
              placeholder="Destination Latitude"
              required
            />
          </div>
          <div className="coordinate-input">
            <label>Destination Longitude</label>
            <input
              type="number"
              value={destinationLongitude}
              onChange={(e) => setDestinationLongitude(e.target.value)}
              placeholder="Destination Longitude"
              required
            />
          </div>
          <button type="submit" className="search-btn">Search Buses</button>
        </form>
      </div>

      <div className="bus-list">
        {buses.map((bus) => (
          <div key={bus.busId} className={`bus-item ${bus.live ? 'live' : 'not-live'}`} style={{ backgroundColor: bus.color }}>
            <h3>{bus.busName} (ID: {bus.busId})</h3>
            <p>Total Seats: {bus.totalSeats}</p>
            <p>Current Occupancy: {bus.currentOccupancy}</p>
            <p className="live-status" style={{ color: bus.live ? 'white' : 'blue' }}>{bus.live ? 'Live' : 'Not Live'}</p>
            <button className="view-seat-plan-btn" onClick={() => viewSeatPlan(bus.seatPlan, bus.busId)}>View Seat Plan</button>
          </div>
        ))}
      </div>

      {/* Seat Plan Modal */}
      {isModalOpen && selectedSeatPlan && (
        <div className="seat-plan-modal">
          <div className="modal-content">
            <h2>Seat Plan</h2>
            <div className="seat-grid">
              {Object.keys(selectedSeatPlan)
                .sort((a, b) => {
                  // Extract number and letter from seat (e.g., "1A")
                  const [aNumber, aLetter] = [parseInt(a[0]), a[1]];
                  const [bNumber, bLetter] = [parseInt(b[0]), b[1]];

                  // Sort by number first, then by letter
                  if (aNumber === bNumber) {
                    return aLetter.localeCompare(bLetter); // Sort alphabetically if numbers are the same
                  }
                  return aNumber - bNumber; // Sort numerically
                })
                .map((seatNumber) => (
                  <button
                    key={seatNumber}
                    className={`seat-btn ${selectedSeatPlan[seatNumber] ? 'available' : 'booked'}`}
                    disabled={!selectedSeatPlan[seatNumber]} // Disable button if seat is booked
                    onClick={() => handleSeatSelect(seatNumber)}
                    style={{
                      backgroundColor: selectedSeat === seatNumber ? 'lightblue' : (selectedSeatPlan[seatNumber] ? 'lightgreen' : 'lightcoral'),
                    }}
                  >
                    {seatNumber}
                  </button>
                ))}
            </div>

            {/* Display Book button only if one seat is selected */}
            {selectedSeat && (
              <button className="book-btn" onClick={handleBooking}>Book Seat</button>
            )}
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
