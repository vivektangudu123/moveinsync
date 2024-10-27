package com.example.bus.Bus;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import org.springframework.stereotype.Service;

@Repository
@Service
public interface BusRepository extends JpaRepository<Bus, Integer> {

    Bus findBybusId(int busId);
}
