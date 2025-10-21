package com.example.stockess.feature.wallet.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CloseStockEntryRequest {
    @NotNull(message = "Field 'id' is required")
    private Long id;

    @NotNull(message = "Field 'sellPrice' is required")
    private Double sellPrice;

    @NotNull(message = "Field 'sellDate' is required")
    private LocalDate sellDate;
}
