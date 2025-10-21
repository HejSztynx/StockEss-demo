package com.example.stockess.feature.wallet.util;

import com.example.stockess.external.stockapi.StockAPIClient;
import com.example.stockess.feature.wallet.model.StockEntry;
import com.example.stockess.feature.wallet.model.Wallet;
import com.example.stockess.feature.wallet.dto.response.WalletDto;
import com.example.stockess.feature.wallet.dto.request.AddWalletRequest;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class WalletMapper {

    private final StockAPIClient stockAPIClient;

    public Wallet toWallet(AddWalletRequest request) {
        Wallet wallet = new Wallet();
        wallet.setName(request.getName());
        wallet.setDescription(request.getDescription());
        wallet.setCreatedAt(LocalDate.now());
        return wallet;
    }

    public WalletDto toWalletDto(Wallet wallet) {
        WalletDto dto = new WalletDto();
        dto.setId(wallet.getId());
        dto.setName(wallet.getName());
        dto.setDescription(wallet.getDescription());
        dto.setCreatedAt(wallet.getCreatedAt());
        dto.setTotalProfit(calculateProfit(wallet));
        return dto;
    }

    private Double calculateProfit(Wallet wallet) {
        if (wallet.getStockEntries() == null || wallet.getStockEntries().isEmpty()) return 0.0;

        Map<String, Float> currentPrices = stockAPIClient.fetchCurrentStockPrices().getCurrentPrices();

        double total = 0.0;
        for (StockEntry entry : wallet.getStockEntries()) {
            double profit;

            if (entry.isOpen()) {
                Float currentPrice = currentPrices.get(entry.getCompany().getId());
                profit = (currentPrice - entry.getBuyPrice()) * entry.getQuantity();
            } else {
                Double buyPrice = entry.getBuyPrice();
                Double sellPrice = entry.getSellPrice();
                profit = (sellPrice - buyPrice) * entry.getQuantity();
            }

            total += profit;
        }

        return total;
    }
}
