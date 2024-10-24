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
  const [selectedBusId, setSelectedBusId] = useState(null); 
  const [selectedColumn, setSelectedColumns] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const viewSeatPlan = (seatPlan, busId, totalColumns) => {
    setSelectedSeatPlan(seatPlan);
    setSelectedBusId(busId); 
    setSelectedColumns(totalColumns);
    setIsModalOpen(true);
  };

  const closeseatplan = () => {
    setSelectedSeatPlan(null);
    setSelectedBusId(null); 
    setSelectedColumns(null);
    setIsModalOpen(false);
  };

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeat(seatNumber);
  };

  const handleBooking = async () => {
    const token = localStorage.getItem('JWT');
    try {
      if (selectedSeat && selectedBusId) {
        const response = await fetch("http://localhost:5001/users/seat-booking", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              BusId: selectedBusId,
              seat: selectedSeat,
              s1: sourceLatitude,
              s2: sourceLongitude,
              d1: destinationLatitude,  
              d2: destinationLongitude,  
              jwt: token
          })
        });

        const data = await response.text(); 
        if (response.ok && data === "true") {
          alert("Seat booked successfully!");
        } else {
          alert("Failed to book seat.");
        }

        setSelectedSeat(null);
        setSelectedBusId(null); 
        setIsModalOpen(false);
      } else {
        alert("Please select a seat and bus.");
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
        sourceLongitude < -1 || sourceLongitude > 20 || destinationLongitude < -1|| destinationLongitude > 20) {
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
            <button className="view-seat-plan-btn" onClick={() => viewSeatPlan(bus.seatPlan, bus.busId,bus.totalColumns)}>View Seat Plan</button>
          </div>
        ))}
      </div>


      {isModalOpen && selectedSeatPlan && (
        <div className="seat-plan-modal">
          <div className="modal-content">
            <h2>Seat Plan</h2>
            <div className="seat-grid"
                style={{ gridTemplateColumns: `repeat(${selectedColumn || 4}, 1fr)`, 
                 }}>
              {Object.keys(selectedSeatPlan)
                .sort((a, b) => {
                  const [aNumber, aLetter] = [parseInt(a[0]), a[1]];
                  const [bNumber, bLetter] = [parseInt(b[0]), b[1]];

                  if (aNumber === bNumber) {
                    return aLetter.localeCompare(bLetter); 
                  }
                  return aNumber - bNumber; 
                })
                .map((seatNumber) => (
                  <button
                    key={seatNumber}
                    className={`seat-btn ${selectedSeatPlan[seatNumber] ? 'available' : 'booked'}`}
                    disabled={!selectedSeatPlan[seatNumber]} 
                    onClick={() => handleSeatSelect(seatNumber)}
                    style={{
                      backgroundColor: selectedSeat === seatNumber
                        ? 'lightblue'
                        : selectedSeatPlan[seatNumber]
                        ? 'lightgreen'
                        : 'lightcoral',
                    }}
                  >
                    {seatNumber}
                  </button>
                ))}
            </div>

            {selectedSeat && (
              <button className="book-btn" onClick={handleBooking}>Book Seat</button>
            )}
            <button className="close-btn" onClick={() => closeseatplan()}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
