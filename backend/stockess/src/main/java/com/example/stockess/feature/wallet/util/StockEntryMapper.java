package com.example.stockess.feature.wallet.util;

import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.wallet.dto.request.BaseStockEntryRequest;
import com.example.stockess.feature.wallet.dto.response.StockEntryDto;
import com.example.stockess.feature.wallet.model.StockEntry;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class StockEntryMapper {

    public void updateStockEntry(StockEntry entry, BaseStockEntryRequest data, Company company) {
        entry.setCompany(company);
        entry.setQuantity(data.getQuantity());
        entry.setCommission(data.getCommission());
        entry.setBuyPrice(data.getBuyPrice());
        entry.setBuyDate(data.getBuyDate());
        entry.setSellPrice(data.getSellPrice());
        entry.setSellDate(data.getSellDate());
    }

    public StockEntry toStockEntry(BaseStockEntryRequest data, Company company) {
        StockEntry entry = new StockEntry();
        entry.setCompany(company);
        entry.setQuantity(data.getQuantity());
        entry.setCommission(data.getCommission());
        entry.setBuyPrice(data.getBuyPrice());
        entry.setBuyDate(data.getBuyDate());
        entry.setOpen(true);
        return entry;
    }

    public StockEntryDto toStockEntryDto(StockEntry stockEntry) {
        StockEntryDto dto = new StockEntryDto();
        dto.setId(stockEntry.getId());
        dto.setCompany(stockEntry.getCompany());
        dto.setQuantity(stockEntry.getQuantity());
        dto.setCommission(stockEntry.getCommission());
        dto.setBuyPrice(stockEntry.getBuyPrice());
        dto.setBuyDate(stockEntry.getBuyDate());
        dto.setOpen(stockEntry.isOpen());
        dto.setSellPrice(stockEntry.getSellPrice());
        dto.setSellDate(stockEntry.getSellDate());
        return dto;
    }
}
