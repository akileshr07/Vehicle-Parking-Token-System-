// src/main/java/com/vptsv1/vptsv1/controller/DashboardController.java
package com.vptsv1.vptsv1.controller;

import com.vptsv1.vptsv1.dto.DashboardStatsDTO;
import com.vptsv1.vptsv1.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        DashboardStatsDTO stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
