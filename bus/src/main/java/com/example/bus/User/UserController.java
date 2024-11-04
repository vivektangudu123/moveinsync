package com.example.bus.User;

import com.example.bus.Booking.Booking;
import com.example.bus.Booking.BookingDTO;
import com.example.bus.Booking.BookingService;
import com.example.bus.Bus.Bus;
import com.example.bus.Bus.BusDTO;
import com.example.bus.Bus.BusService;
import com.example.bus.authentication.AuthenticationController;
import javafx.util.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Book;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class UserController {

    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private  AuthenticationController authenticationController;
    @Autowired
    private  BookingService bookingService;
    @Autowired
    private BusService busService;
    @Autowired
    private UserService userService;

    @CrossOrigin
    @PostMapping("/users/create")
    public String register(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("Name");
        String gender = (String) payload.get("gender");
        String email = (String) payload.get("email");
        String phoneNumber = (String) payload.get("phoneNumber");


        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            return "Phone number already exists!";
        }

        if (userRepository.existsByEmail(email)) {
            return "Email already exists!";
        }

        User newUser = new User(name, email, gender, phoneNumber);
        userService.saveUser(newUser);

        return "Success";
    }

    @CrossOrigin
    @PostMapping(value="/users/bookings",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingDTO>> boookings(@RequestBody Map<String, Object> payload) {
        String jwt = (String) payload.get("jwt");
        String mobileNUmber = authenticationController.verifyJwt(jwt);
        User user = userRepository.findByPhoneNumber(mobileNUmber);
        System.out.println(user.getUserId());
        List<Booking> bookings = bookingService.getBookingsByUserId(user.getUserId());

        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(booking -> new BookingDTO(
                        booking.getId(),
                        booking.getSeatNumber(),
                        booking.getBookingTime(),
                        booking.getTravelDate(),
                        booking.getStatus(),
                        booking.getBus().getBusName()

                ))
                .collect(Collectors.toList());

//        for(BookingDTO a: bookingDTOs){
//            System.out.println(a.getBookingTime());
//        }
        return ResponseEntity.ok(bookingDTOs);
    }

    @CrossOrigin
    @PostMapping("/users/cancel-booking")
    public boolean cancelBooking(@RequestBody Map<String, Object> payload) throws Exception {
        String jwt = (String) payload.get("jwt");

        int booking_str = (Integer) payload.get("BookingID");
        System.out.println(booking_str);
        int bookingId;
        try {
//            bookingId = Integer.parseInt(booking_str);
        } catch (NumberFormatException e) {
            throw new Exception("Invalid BookingID format", e);
        }
        userService.cancelSeat(booking_str);
        return true;
    }
    @CrossOrigin
    @PostMapping("/users/seat-booking")
    public String seatBooking(@RequestBody Map<String, Object> payload) throws Exception {
        String jwt = (String) payload.get("jwt");
        int BusId = (int) payload.get("BusId");
        String seat=(String) payload.get("seat");
        String ss1=(String) payload.get("s1");
        String ss2=(String) payload.get("s2");
        String dd1=(String) payload.get("d1");
        String dd2=(String) payload.get("d2");
        String mobileNUmber = authenticationController.verifyJwt(jwt);
        User user = userRepository.findByPhoneNumber(mobileNUmber);
        int s1,s2,d1,d2,bus;
        try {
//            bus = Integer.parseInt(BusId);
            s1=Integer.parseInt(ss1);
            s2=Integer.parseInt(ss2);
            d1=Integer.parseInt(dd1);
            d2=Integer.parseInt(dd2);
        } catch (NumberFormatException e) {
            // Handle the case where the string cannot be parsed as an integer
            throw new Exception("Invalid BookingID format", e);
        }
        Bus bu=busService.findBybusId(BusId);
        if(bookingService.addBooking(user,seat,bu, LocalDateTime.now(), LocalDate.now().plusDays(1),new Pair<>(s1,s2),new Pair<>(d1,d2))){
            return "true";
        }
        return "false";
    }

    @CrossOrigin
    @PostMapping(value = "/users/search" ,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BusDTO>> search(@RequestBody Map<String, Object> payload) throws Exception {
        try {
            int s1 = Integer.parseInt((String) payload.get("s1"));
            int s2 = Integer.parseInt((String) payload.get("s2"));
            int d1 = Integer.parseInt((String) payload.get("d1"));
            int d2 = Integer.parseInt((String) payload.get("d2"));

            System.out.println("Source: " + s1 + ", " + s2);
            System.out.println("Destination: " + d1 + ", " + d2);
            List<Bus> availableBuses = userService.getViewBuses(s1, s2, d1, d2);

            List<BusDTO> bookingDTOs = availableBuses.stream()
                    .map(bus -> new BusDTO(
                            bus.getId(),
                            bus.getBusName(),
                            bus.getTotalColumns(),
                            bus.getTotalRows(),
                            bus.getCurrentOccupancy(),
                            bus.getSeatAvailabilityColor(),
                            bus.getSeatPlan(),
                            bus.getCurrentLocation(),
                            bus.isLive()
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(bookingDTOs);
        } catch (NumberFormatException e) {
            throw new Exception("Invalid input format", e);
        }
    }


}