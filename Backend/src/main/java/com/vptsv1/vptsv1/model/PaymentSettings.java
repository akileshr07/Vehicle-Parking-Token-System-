package com.vptsv1.vptsv1.model;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PaymentSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String upiId;

    @Lob
    private String qrCodeUrl; // base64 image string
}
