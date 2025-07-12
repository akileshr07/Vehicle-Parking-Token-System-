//VehicleController
package com.vptsv1.vptsv1.controller;

import com.vptsv1.vptsv1.dto.VehicleResponseDTO;
import com.vptsv1.vptsv1.dto.GenericResponseDTO;
import com.vptsv1.vptsv1.model.Vehicle;
import com.vptsv1.vptsv1.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping("/entry")
    public ResponseEntity<VehicleResponseDTO> addVehicle(@RequestBody Vehicle vehicle) {
        Vehicle saved = vehicleService.addVehicle(vehicle);
        return ResponseEntity.status(201).body(
                new VehicleResponseDTO(true, "Vehicle entry recorded successfully", saved)
        );
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        Map<String, Object> response = new HashMap<>();
        response.put("vehicles", vehicles);
        response.put("total", vehicles.size());
        response.put("active", vehicles.stream().filter(v -> "active".equals(v.getStatus())).count());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{token}")
    public ResponseEntity<?> getVehicleByToken(@PathVariable String token) {
        return vehicleService.getByToken(token)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body(
                        new GenericResponseDTO<>(false, "Token not found", null)
                ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GenericResponseDTO> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(new GenericResponseDTO(true, "Vehicle deleted successfully", null));
    }
}
