package com.example.stockess.feature.insight.service;

import com.example.stockess.external.stockapi.StockAPIClient;
import com.example.stockess.feature.company.service.CompanyService;
import com.example.stockess.feature.insight.model.dto.formation.CandlestickPatternsDto;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
@Transactional(readOnly = true)
public class CandlestickFormationsService {

    private final StockAPIClient apiClient;
    private final CompanyService companyService;

    public CandlestickPatternsDto fetchCandlestickFormations(String ticker) {
        companyService.getById(ticker);
        return apiClient.fetchCandlestickFormations(ticker);
    }
}
