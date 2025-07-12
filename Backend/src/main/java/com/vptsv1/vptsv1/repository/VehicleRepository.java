package com.vptsv1.vptsv1.repository;

import com.vptsv1.vptsv1.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByToken(String token);
    List<Vehicle> findByType(String type);
}
