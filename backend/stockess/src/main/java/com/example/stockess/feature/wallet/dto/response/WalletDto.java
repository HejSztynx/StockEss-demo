package com.example.stockess.feature.wallet.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class WalletDto {
    private Long id;
    private String name;
    private String description;
    private LocalDate createdAt;
    private Double totalProfit;
    private Double profitPercent;
}
