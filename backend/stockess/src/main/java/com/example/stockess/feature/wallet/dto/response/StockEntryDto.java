package com.example.stockess.feature.wallet.dto.response;

import com.example.stockess.feature.company.model.Company;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StockEntryDto {
    private Long id;
    private Company company;
    private Long quantity;
    private Double commission;
    private Double buyPrice;
    private LocalDate buyDate;
    private boolean isOpen;
    private Double sellPrice;
    private LocalDate sellDate;
}
