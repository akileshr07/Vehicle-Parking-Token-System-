package com.vptsv1.vptsv1.model;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // car, bike, ev
    private String number;
    private String token;
    private String location;
    private String status; // active, exited

    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
}
