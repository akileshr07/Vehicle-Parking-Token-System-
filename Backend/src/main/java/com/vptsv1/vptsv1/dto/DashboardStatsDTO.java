// src/main/java/com/vptsv1/vptsv1/dto/DashboardStatsDTO.java
package com.vptsv1.vptsv1.dto;

import lombok.Data;
import java.util.Map;

@Data
public class DashboardStatsDTO {
    private int totalVehicles;
    private int activeTokens;
    private int availableSlots;
    private int todayRevenue;

    // parkingStatus: car/bike/ev → { available, total, occupied }
    private Map<String, SlotStatus> parkingStatus;

    @Data
    public static class SlotStatus {
        private int available;
        private int total;
        private int occupied;
    }
}
