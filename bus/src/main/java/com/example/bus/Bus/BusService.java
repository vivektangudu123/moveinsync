package com.example.bus.Bus;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;

import javafx.util.Pair;
import org.springframework.stereotype.Service;

@Service
public class BusService {
    @Autowired
    private BusRepository busRepository;

    public Bus addBus(Bus bus) {
        return busRepository.save(bus);
    }

    public Bus updateBus(int id,Bus updatedBus) {
        Optional<Bus> optionalBus = busRepository.findById(id);
        if (optionalBus.isPresent()) {
            Bus bus = optionalBus.get();
            bus.setBusName(updatedBus.getBusName());
            bus.setTotalColumns(updatedBus.getTotalColumns());
            bus.setTotalRows(updatedBus.getTotalRows());
            bus.setCurrentOccupancy(updatedBus.getCurrentOccupancy());
            bus.setRoute(updatedBus.getRoute());
            bus.setAvailableDays(updatedBus.getAvailableDays());
            bus.setLive(updatedBus.isLive());
            return busRepository.save(bus);
        }
        return null;
    }

    public void deleteBus(int id) {
        busRepository.deleteById(id);
    }


    public List<Bus> getAvailableBuses(Pair<Integer, Integer> source, Pair<Integer, Integer> destination) {
        List<Bus> buses = busRepository.findAll();
        List<Bus> matchingBuses = new ArrayList<>();

        for (Bus bus : buses) {
            List<Pair<Integer, Integer>> route = bus.getRoute();
            int sourceIndex = route.indexOf(source);
            int destinationIndex = route.indexOf(destination);

            if (sourceIndex != -1 && destinationIndex != -1 && destinationIndex > sourceIndex) {
                matchingBuses.add(bus);
            }
        }
        return matchingBuses;
    }

    public String bookSeat(int id,String seatNumber) {
        Optional<Bus> optionalBus = busRepository.findById(id);
        if (optionalBus.isPresent()) {
            Bus bus = optionalBus.get();
            boolean success = bus.bookSeat(seatNumber);
            if (success) {
                busRepository.save(bus);
                return "Seat " + seatNumber + " booked successfully!";
            } else {
                return "Seat " + seatNumber + " is already booked or does not exist!";
            }
        }
        return "Bus not found";
    }

    public String cancelSeat(int id,String seatNumber) {
        Optional<Bus> optionalBus = busRepository.findById(id);
        if (optionalBus.isPresent()) {
            Bus bus = optionalBus.get();
            boolean success = bus.cancelSeatBooking(seatNumber);
            if (success) {
                busRepository.save(bus);
                return "Seat " + seatNumber + " canceled successfully!";
            } else {
                return "Seat " + seatNumber + " was not booked!";
            }
        }
        return "Bus not found";
    }

    public Bus findBybusId(int a) {
        return busRepository.findBybusId(a);
    }
    public void addBus() {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Enter Bus Name:");
        String busName = scanner.nextLine();

        System.out.println("Enter Total Rows:  (default value)");
        int totalrows = scanner.nextInt();
        System.out.println("Enter Total Columns:  (default value)");
        int totalcolums = scanner.nextInt();
        System.out.println("Enter Current Occupancy (number of booked seats): 0");
//        int currentOccupancy = scanner.nextInt();

        System.out.println("Enter number of stops in the route:");
        int numStops = scanner.nextInt();
        List<Pair<Integer, Integer>> route = new ArrayList<>();

        for (int i = 0; i < numStops; i++) {
            System.out.println("Enter longitude for stop " + (i + 1) + ":");
            int c1 = scanner.nextInt();
            System.out.println("Enter latitude for stop " + (i + 1) + ":");
            int c2 = scanner.nextInt();
            route.add(new Pair<>(c1, c2));
        }


        Bus bus = new Bus(busName,totalcolums,totalrows, 0, route);

        busRepository.save(bus);

        System.out.println("Bus added successfully!");
    }
}
