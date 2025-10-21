package com.example.stockess.feature.wallet.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EditStockEntryRequest {
    @NotNull(message = "Field 'id' is required")
    private Long id;

    @NotNull(message = "Field 'data' is required")
    @Valid
    private BaseStockEntryRequest data;
}
