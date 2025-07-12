package com.vptsv1.vptsv1.service;

import com.vptsv1.vptsv1.model.PaymentSettings;
import com.vptsv1.vptsv1.repository.PaymentSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentSettingsService {

    private final PaymentSettingsRepository repository;

    public PaymentSettings getSettings() {
        List<PaymentSettings> all = repository.findAll();
        return all.isEmpty() ? null : all.get(0);
    }

    public PaymentSettings updateUPI(String upiId) {
        PaymentSettings settings = getSettings();
        if (settings == null) settings = new PaymentSettings();

        settings.setUpiId(upiId);
        settings.setQrCodeUrl(generateQRCodeBase64(upiId));
        return repository.save(settings);
    }

    private String generateQRCodeBase64(String upiId) {
        // Dummy for now; generate a real QR code later using zxing or Google Charts API
        return ".";
    }
}
