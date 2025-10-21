package com.example.stockess.feature.insight.service;

import com.example.stockess.external.stockapi.StockAPIClient;
import com.example.stockess.feature.company.service.CompanyService;
import com.example.stockess.feature.insight.model.dto.PriceHistoryDto;
import com.example.stockess.feature.insight.model.dto.SinglePredictionDto;
import com.example.stockess.feature.insight.model.dto.current.CurrentPricesDto;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
@Transactional(readOnly = true)
public class StockPricesService {

    private final StockAPIClient apiClient;
    private final CompanyService companyService;

    public SinglePredictionDto fetchStockPricesPrediction(String ticker, String period) {
        companyService.getById(ticker);
        return apiClient.fetchStockPricesPrediction(ticker, period);
    }

    public PriceHistoryDto fetchStockPricesData(String ticker) {
        companyService.getById(ticker);
        return apiClient.fetchStockPricesData(ticker);
    }

    public CurrentPricesDto fetchCurrentStockPrices() {
        return apiClient.fetchCurrentStockPrices();
    }
}
