package com.example.stockess.feature.wallet.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BaseStockEntryRequest {

    @NotNull(message = "(data) Field 'company' is required")
    private String company;

    @NotNull(message = "(data) Field 'quantity' is required")
    private Long quantity;

    @NotNull(message = "(data) Field 'buyPrice' is required")
    private Double buyPrice;

    @NotNull(message = "(data) Field 'commission' is required")
    private Double commission;

    @NotNull(message = "(data) Field 'buyDate' is required")
    private LocalDate buyDate;

    private Double sellPrice;

    private LocalDate sellDate;
}