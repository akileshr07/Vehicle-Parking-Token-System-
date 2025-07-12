package com.vptsv1.vptsv1.service;

import com.vptsv1.vptsv1.dto.DashboardStatsDTO;
import com.vptsv1.vptsv1.dto.DashboardStatsDTO.SlotStatus;
import com.vptsv1.vptsv1.model.Vehicle;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VehicleService vehicleService;
    private final ParkingConfigService configService;

    public DashboardStatsDTO getDashboardStats() {
        List<Vehicle> allVehicles = vehicleService.getAllVehicles();

        int totalVehicles = allVehicles.size();
        long activeCount = allVehicles.stream()
                .filter(v -> "active".equalsIgnoreCase(v.getStatus()))
                .count();

        int todayRevenue = calculateTodayRevenue(allVehicles);

        Map<String, Integer> totalSlots = configService.getSlotConfig(); // static or DB-driven

        Map<String, Long> occupiedCountByType = allVehicles.stream()
                .filter(v -> "active".equalsIgnoreCase(v.getStatus()))
                .collect(Collectors.groupingBy(Vehicle::getType, Collectors.counting()));

        Map<String, SlotStatus> parkingStatus = new HashMap<>();
        int availableSlotsTotal = 0;

        for (Map.Entry<String, Integer> entry : totalSlots.entrySet()) {
            String type = entry.getKey();
            int total = entry.getValue();
            int occupied = occupiedCountByType.getOrDefault(type, 0L).intValue();
            int available = Math.max(0, total - occupied); // prevent negative

            SlotStatus slot = new SlotStatus();
            slot.setTotal(total);
            slot.setOccupied(occupied);
            slot.setAvailable(available);

            parkingStatus.put(type, slot);
            availableSlotsTotal += available;
        }

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalVehicles(totalVehicles);
        stats.setActiveTokens((int) activeCount);
        stats.setAvailableSlots(availableSlotsTotal);
        stats.setTodayRevenue(todayRevenue);
        stats.setParkingStatus(parkingStatus);

        return stats;
    }

    private int calculateTodayRevenue(List<Vehicle> vehicles) {
        LocalDate today = LocalDate.now();

        return vehicles.stream()
                .filter(v -> v.getExitTime() != null && today.equals(v.getExitTime().toLocalDate()))
                .mapToInt(v -> {
                    long hours = Duration.between(v.getEntryTime(), v.getExitTime()).toHours();
                    int feePerHour = switch (v.getType().toLowerCase()) {
                        case "car" -> 20;
                        case "bike" -> 10;
                        case "ev" -> 15;
                        default -> 0;
                    };
                    return (int) (feePerHour * hours);
                })
                .sum();
    }
}
