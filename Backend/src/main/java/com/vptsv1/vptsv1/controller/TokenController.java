package com.vptsv1.vptsv1.controller;

import com.vptsv1.vptsv1.dto.TokenDetailsResponseDTO;
import com.vptsv1.vptsv1.dto.GenericResponseDTO;
import com.vptsv1.vptsv1.model.Vehicle;
import com.vptsv1.vptsv1.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/parking")
@RequiredArgsConstructor
public class TokenController {

    private final VehicleService vehicleService;

    @GetMapping("/{token}")
    public ResponseEntity<GenericResponseDTO<?>> getTokenDetails(@PathVariable String token) {
        return vehicleService.getByToken(token)
                .<ResponseEntity<GenericResponseDTO<?>>>map(vehicle -> {
                    TokenDetailsResponseDTO dto = new TokenDetailsResponseDTO();
                    dto.setToken(vehicle.getToken());
                    dto.setVehicleType(vehicle.getType());
                    dto.setVehicleNumber(vehicle.getNumber());
                    dto.setEntryTime(vehicle.getEntryTime());
                    dto.setLocation(vehicle.getLocation());
                    dto.setStatus(vehicle.getStatus());

                    long hours = Duration.between(vehicle.getEntryTime(), LocalDateTime.now()).toHours();
                    dto.setHoursParked(hours);

                    int feePerHour = switch (vehicle.getType()) {
                        case "car" -> 20;
                        case "bike" -> 10;
                        case "ev" -> 15;
                        default -> 0;
                    };
                    dto.setFees((int) (feePerHour * hours));

                    return ResponseEntity.ok(new GenericResponseDTO<>(true, "Token details found", dto));
                })
                .orElse(ResponseEntity.status(404).body(
                        new GenericResponseDTO<>(false, "Token not found", null)
                ));
    }

    @PostMapping("/exit/{token}")
    public ResponseEntity<GenericResponseDTO<?>> exitVehicle(@PathVariable String token) {
        return vehicleService.getByToken(token)
                .<ResponseEntity<GenericResponseDTO<?>>>map(vehicle -> {
                    vehicle.setStatus("exited");
                    vehicle.setExitTime(LocalDateTime.now());
                    vehicleService.addVehicle(vehicle);

                    Map<String, Object> responseData = new HashMap<>();
                    responseData.put("token", token);
                    responseData.put("exitTime", vehicle.getExitTime());

                    return ResponseEntity.ok(new GenericResponseDTO<>(true, "Vehicle exited successfully", responseData));
                })
                .orElse(ResponseEntity.status(404).body(
                        new GenericResponseDTO<>(false, "Token not found", null)
                ));
    }
}
