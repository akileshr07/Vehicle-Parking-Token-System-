package com.vptsv1.vptsv1.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ParkingConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int carSlots;
    private int bikeSlots;
    private int evSlots;

    private int carFee;
    private int bikeFee;
    private int evFee;
}
