package com.vptsv1.vptsv1.dto;

import com.vptsv1.vptsv1.model.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VehicleResponseDTO {
    private boolean success;
    private String message;
    private Vehicle vehicle;
}
