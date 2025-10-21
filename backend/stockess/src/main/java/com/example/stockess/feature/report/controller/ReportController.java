package com.example.stockess.feature.report.controller;

import com.example.stockess.feature.insight.model.dto.report.FinancialReportDto;
import com.example.stockess.feature.report.service.ReportService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@AllArgsConstructor
@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping()
    public ResponseEntity<FinancialReportDto> getReports(@RequestParam("ticker") String ticker) {
        FinancialReportDto financialReportDto = reportService.fetchReports(ticker);
        return ResponseEntity.ok(financialReportDto);
    }
}
