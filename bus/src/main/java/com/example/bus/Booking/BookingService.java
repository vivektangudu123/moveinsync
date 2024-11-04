package com.example.bus.Booking;

import com.example.bus.Bus.Bus;
import com.example.bus.Bus.BusRepository;
import com.example.bus.User.User;
import javafx.util.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static com.example.bus.Booking.BookingStatus.SUCCESSFUL;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private BusRepository busRepository;


    public boolean addBooking(User user, String seatNumber, Bus bus, LocalDateTime bookingTime, LocalDate travelDate, Pair<Integer, Integer> source, Pair<Integer, Integer> destination) {
        if(bus.bookSeat(seatNumber)){
            Booking booking = new Booking(user, seatNumber, bus, bookingTime, travelDate, source, destination);
            booking.setStatus(SUCCESSFUL);
            bus.bookSeat(seatNumber);
            busRepository.save(bus);
            bookingRepository.save(booking);
            return true;
        }
        return false;
    }

    // Change booking status
    public Booking changeBookingStatus(int bookingId, BookingStatus newStatus) throws Exception {
        Optional<Booking> bookingOptional = bookingRepository.findById((long) bookingId);

        if (!bookingOptional.isPresent()) {
            throw new Exception("Booking with id " + bookingId + " not found.");
        }

        Booking booking = bookingOptional.get();
        booking.setStatus(newStatus);
        return bookingRepository.save(booking);
    }

    // Get all bookings based on userId
    public List<Booking> getBookingsByUserId(int userId) {
        return bookingRepository.findByUser_userId(userId);
    }

    // Get all bookings based on busId
    public List<Booking> getBookingsByBusId(int busId) {
        return bookingRepository.findByBus_busId(busId);
    }

    // Get booking by bookingId
    public Optional<Booking> getBookingById(int bookingId) {
        return bookingRepository.findById((long) bookingId);
    }
}
