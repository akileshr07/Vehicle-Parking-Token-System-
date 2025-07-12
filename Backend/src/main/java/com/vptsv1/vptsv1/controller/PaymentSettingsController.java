package com.vptsv1.vptsv1.controller;

import com.vptsv1.vptsv1.model.PaymentSettings;
import com.vptsv1.vptsv1.service.PaymentSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/config/payment")
@RequiredArgsConstructor
public class PaymentSettingsController {

    private final PaymentSettingsService service;

    @GetMapping
    public ResponseEntity<?> getPaymentSettings() {
        PaymentSettings settings = service.getSettings();
        if (settings == null) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Not configured"));
        }

        return ResponseEntity.ok(Map.of(
                "upiId", settings.getUpiId(),
                "qrCodeUrl", settings.getQrCodeUrl()
        ));
    }

    @PostMapping
    public ResponseEntity<?> updatePayment(@RequestBody Map<String, String> request) {
        PaymentSettings updated = service.updateUPI(request.get("upiId"));
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment settings updated successfully",
                "qrCodeUrl", updated.getQrCodeUrl()
        ));
    }
}
