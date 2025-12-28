package com.example.stockess.feature.wallet.util;

import com.example.stockess.external.stockapi.StockAPIClient;
import com.example.stockess.feature.insight.service.StockPricesService;
import com.example.stockess.feature.wallet.model.StockEntry;
import com.example.stockess.feature.wallet.model.Wallet;
import com.example.stockess.feature.wallet.dto.response.WalletDto;
import com.example.stockess.feature.wallet.dto.request.AddWalletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class WalletMapper {

    private final StockAPIClient stockAPIClient;
    private final StockPricesService stockPricesService;

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

        double totalProfit = calculateProfit(wallet);
        dto.setTotalProfit(totalProfit);

        Double profitPercent = calculateProfitPercent(wallet);
        dto.setProfitPercent(profitPercent);

        return dto;
    }

    private Double calculateProfit(Wallet wallet) {
        if (wallet.getStockEntries() == null || wallet.getStockEntries().isEmpty()) return 0.0;

        Map<String, Float> currentPrices = stockPricesService.getCurrentStockPrices().getCurrentPrices();

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

    private Double calculateProfitPercent(Wallet wallet) {
        if (wallet.getStockEntries() == null || wallet.getStockEntries().isEmpty()) return 0.0;

        Map<String, Float> currentPrices = stockPricesService.getCurrentStockPrices().getCurrentPrices();

        double investedAmount = 0.0;
        double currentValue = 0.0;

        for (StockEntry entry : wallet.getStockEntries()) {
            double buyTotal = entry.getBuyPrice() * entry.getQuantity();
            investedAmount += buyTotal;

            double currentTotal;
            if (entry.isOpen()) {
                Float currentPrice = currentPrices.get(entry.getCompany().getId());
                currentTotal = currentPrice * entry.getQuantity();
            } else {
                currentTotal = entry.getSellPrice() * entry.getQuantity();
            }

            currentValue += currentTotal;
        }

        if (investedAmount == 0) return 0.0;

        return ((currentValue - investedAmount) / investedAmount) * 100;
    }
}
