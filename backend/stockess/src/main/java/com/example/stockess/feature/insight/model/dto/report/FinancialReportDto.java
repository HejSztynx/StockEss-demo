package com.example.stockess.feature.insight.model.dto.report;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Map;

@Data
public class FinancialReportDto {
    @JsonProperty("balance_sheet")
    private Map<String, Map<String, Double>> balanceSheet;

    @JsonProperty("cashflow")
    private Map<String, Map<String, Double>> cashFlow;

    @JsonProperty("financials")
    private Map<String, Map<String, Double>> financials;

    private String ticker;
}
