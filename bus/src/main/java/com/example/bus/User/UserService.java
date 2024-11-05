package com.example.bus.User;
import com.example.bus.Booking.Booking;
import com.example.bus.Booking.BookingService;
import com.example.bus.Booking.BookingStatus;
import com.example.bus.Bus.Bus;
import com.example.bus.Bus.BusService;
import com.example.bus.authentication.AuthenticationController;
import javafx.util.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Scanner;

@Service
public class UserService {
    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private  AuthenticationController authenticationController;
    @Autowired
    private  BusService busService;
    @Autowired
    private  BookingService bookingService;

    private int s1,s2,d1,d2;
    private final Scanner scanner;


    public UserService() {
        this.scanner = new Scanner(System.in);
    }

    public void saveUser(User user) {
        System.out.println("Saving user to the database...");
        userRepository.save(user);
        System.out.println("User saved: " + user.getName());
    }
    public boolean doAuth(String phoneNumber){
        String sendOtp = authenticationController.sendOtp(phoneNumber, 1);
        System.out.print("Enter OTP: ");
        String OTP = scanner.nextLine();
        return authenticationController.verifyOtp(phoneNumber, OTP);

    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public int registerUser() {

        System.out.println("Enter your phone number (10 digits): ");
        String phoneNumber = scanner.nextLine();
        if(userRepository.existsByPhoneNumber(phoneNumber)){
            System.out.println("Number already exists!! Try again");
            return -1;
        }
        if(!doAuth(phoneNumber)){
            System.out.println("Authentication Failed!!");
            return -1;
        }else{
            System.out.println("Authentication Success!!");
        }

        System.out.println("Enter your name: ");
        String name = scanner.nextLine();

        System.out.println("Enter your email: ");
        String email = scanner.nextLine();
        if(userRepository.existsByEmail(email)){
            System.out.println("Email already exists!! Try again");
            return -1;
        }
        System.out.println("Enter your gender (M/F): ");
        String gender = scanner.nextLine();


        User newUser = new User(name, email, gender, phoneNumber);


        userRepository.save(newUser);

        System.out.println("User registered successfully!");
        return userRepository.findByPhoneNumber(phoneNumber).getUserId();
    }
    public int loginUser(){
        System.out.println("Enter your phone number (10 digits): ");
        String phoneNumber = scanner.nextLine();
        if(!userRepository.existsByPhoneNumber(phoneNumber)){
            System.out.println("Number does not exists!! Try again");
            return -1;
        }
        if(!doAuth(phoneNumber)){
            System.out.println("Authentication Failed!!");
            return -1;
        }else {
            System.out.println("Authentication Success!!");
            return userRepository.findByPhoneNumber(phoneNumber).getUserId();
        }
    }
    public void bookBusSeat(User u){
        viewBuses();

        System.out.println("Enter Bus_id:");
        int a=scanner.nextInt();
        Bus bus=busService.findBybusId(a);
        System.out.println("Enter Seat number:");
        scanner.nextLine();
        String seat=scanner.nextLine();
        if(bookingService.addBooking(u,seat,bus, LocalDateTime.now(), LocalDate.now().plusDays(1),new Pair<>(s1,s2),new Pair<>(d1,d2))){
            System.out.println("Booking Successful");
        }else{
            System.out.println("Booking failed try again");
        }

    }
    public List<Bus> getViewBuses(int s1,int s2,int d1,int d2){
        return busService.getAvailableBuses(new Pair<>(s1,s2),new Pair<>(d1,d2));
    }
    public void viewBuses(){
        System.out.println("Enter longitude for Source:");
        s1 = scanner.nextInt();
        System.out.println("Enter latitude for Source:");
        s2 = scanner.nextInt();
        System.out.println("Enter longitude for Destination:");
        d1 = scanner.nextInt();
        System.out.println("Enter latitude for Destination:");
        d2 = scanner.nextInt();
        List<Bus> available_buses=getViewBuses(s1,s2,d1,d2);
        for (Bus a : available_buses) {
            System.out.println("Bus name: " + a.getBusName() + ",Id: " + a.getId() + ",Occupancy Rate:" + a.getSeatAvailabilityColor());
        }
        System.out.println("\n");
        while (true){
            System.out.println("Do you want to Show the seat map of any of the buses, exit(-1)\n");
            int h = scanner.nextInt();
            if(h==-1){
                return;
            }
            for(Bus a:available_buses){
                if(a.getId()==h){
                    a.printSeatPlan();
                }
            }
        }
    }
    public Bus cancelSeat(int aa) throws Exception {
        Booking bo=bookingService.changeBookingStatus(aa,BookingStatus.CANCELLED);
        Bus bus=bo.getBus();
        bus.cancelSeatBooking(bo.getSeatNumber());
        return busService.addBus(bus);
    }

    public void cancelBusSeat(User user) throws Exception {
        List<Booking> bookings=bookingService.getBookingsByUserId(user.getUserId());
        for(Booking a:bookings){
            System.out.println(a.getId());
        }
        System.out.println("Which booking you want to cancel\n");
        int aa=scanner.nextInt();
        cancelSeat(aa);
    }
    public User findByUserId(int loggedUserId) {
        return userRepository.findByuserId(loggedUserId);
    }
}
