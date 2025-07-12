// src/main/java/com/vptsv1/vptsv1/service/ParkingConfigService.java
package com.vptsv1.vptsv1.service;

import com.vptsv1.vptsv1.model.ParkingConfig;
import com.vptsv1.vptsv1.repository.ParkingConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ParkingConfigService {

    private final ParkingConfigRepository parkingConfigRepository;

    public ParkingConfig getConfig() {
        List<ParkingConfig> all = parkingConfigRepository.findAll();
        return all.isEmpty() ? null : all.get(0);
    }

    public ParkingConfig saveSlots(int car, int bike, int ev) {
        ParkingConfig config = getConfig();
        if (config == null) config = new ParkingConfig();

        config.setCarSlots(car);
        config.setBikeSlots(bike);
        config.setEvSlots(ev);
        return parkingConfigRepository.save(config);
    }

    public ParkingConfig saveFees(int carFee, int bikeFee, int evFee) {
        ParkingConfig config = getConfig();
        if (config == null) config = new ParkingConfig();

        config.setCarFee(carFee);
        config.setBikeFee(bikeFee);
        config.setEvFee(evFee);
        return parkingConfigRepository.save(config);
    }

    // ✅ Add this method to expose slot config
    public Map<String, Integer> getSlotConfig() {
        ParkingConfig config = getConfig();
        if (config == null) {
            return Map.of("car", 0, "bike", 0, "ev", 0);
        }

        Map<String, Integer> slots = new HashMap<>();
        slots.put("car", config.getCarSlots());
        slots.put("bike", config.getBikeSlots());
        slots.put("ev", config.getEvSlots());
        return slots;
    }
}
