//VehicleService
package com.vptsv1.vptsv1.service;

import com.vptsv1.vptsv1.model.Vehicle;
import com.vptsv1.vptsv1.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public Vehicle addVehicle(Vehicle vehicle) {
        vehicle.setToken(generateToken());
        vehicle.setEntryTime(LocalDateTime.now());
        vehicle.setStatus("active");
        vehicle.setLocation(assignLocation(vehicle.getType())); // dummy logic
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getByToken(String token) {
        return vehicleRepository.findByToken(token);
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    private String generateToken() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private String assignLocation(String type) {
        // You can improve this later (use a slot system)
        return "Lot A - Section 1";
    }
}
