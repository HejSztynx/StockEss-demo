package com.example.stockess.feature.wallet.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddStockEntryRequest {
    @NotNull(message = "Field 'walletId' is required")
    private Long walletId;

    @NotNull(message = "Field 'data' is required")
    @Valid
    private BaseStockEntryRequest data;
}
