package com.example.stockess.feature.wallet.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddWalletRequest {
    @NotNull(message = "Field 'name' is required")
    private String name;

    @NotNull(message = "Field 'description' is required")
    private String description;
}
