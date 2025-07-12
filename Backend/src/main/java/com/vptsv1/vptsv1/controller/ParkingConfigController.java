// ParkingConfigController
package com.vptsv1.vptsv1.controller;

import com.vptsv1.vptsv1.model.ParkingConfig;
import com.vptsv1.vptsv1.service.ParkingConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/config/parking")
@RequiredArgsConstructor
public class ParkingConfigController {

    private final ParkingConfigService service;

    @GetMapping
    public ResponseEntity<?> getParkingConfig() {
        ParkingConfig config = service.getConfig();
        if (config == null) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Config not found"));
        }

        return ResponseEntity.ok(Map.of(
                "slots", Map.of(
                        "car", config.getCarSlots(),
                        "bike", config.getBikeSlots(),
                        "ev", config.getEvSlots()
                ),
                "fees", Map.of(
                        "car", config.getCarFee(),
                        "bike", config.getBikeFee(),
                        "ev", config.getEvFee()
                )
        ));
    }

    @PostMapping("/slots")
    public ResponseEntity<?> updateSlots(@RequestBody Map<String, Integer> request) {
        ParkingConfig updated = service.saveSlots(request.get("car"), request.get("bike"), request.get("ev"));
        return ResponseEntity.ok(Map.of("success", true, "message", "Parking slots updated successfully"));
    }

    @PostMapping("/fees")
    public ResponseEntity<?> updateFees(@RequestBody Map<String, Integer> request) {
        ParkingConfig updated = service.saveFees(request.get("car"), request.get("bike"), request.get("ev"));
        return ResponseEntity.ok(Map.of("success", true, "message", "Parking fees updated successfully"));
    }

}
