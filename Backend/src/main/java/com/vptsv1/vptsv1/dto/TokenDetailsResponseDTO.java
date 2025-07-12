package com.vptsv1.vptsv1.dto;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TokenDetailsResponseDTO {
    private String token;
    private String vehicleType;
    private String vehicleNumber;
    private LocalDateTime entryTime;
    private String location;
    private String status;
    private long hoursParked;
    private int fees;
}
