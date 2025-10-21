package com.example.stockess.feature.report.service;

import com.example.stockess.external.stockapi.StockAPIClient;
import com.example.stockess.feature.insight.model.dto.report.FinancialReportDto;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ReportService {
    private StockAPIClient stockAPIClient;

    public FinancialReportDto fetchReports(String ticker) {
        return stockAPIClient.fetchReports(ticker);
    }
}
