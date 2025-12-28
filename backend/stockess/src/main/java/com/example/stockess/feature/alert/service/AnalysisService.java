package com.example.stockess.feature.alert.service;

import com.example.stockess.feature.alert.dto.response.AnalysisResponseDto;
import com.example.stockess.feature.alert.dto.response.OccurrenceDto;
import com.example.stockess.feature.alert.model.Alert;
import com.example.stockess.feature.alert.model.util.AlertMessageGenerator;
import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.company.service.CompanyService;
import com.example.stockess.feature.insight.model.dto.PriceHistoryDto;
import com.example.stockess.feature.insight.service.StockPricesService;
import com.example.stockess.feature.user.service.UserAuthService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class AnalysisService {

    private final CompanyService companyService;
    private final AlertService alertService;
    private final UserAuthService userAuthService;
    private final StockPricesService stockPricesService;
    private final ConditionService conditionService;
    private final AlertMessageGenerator alertMessageGenerator;

    public AnalysisResponseDto performAnalysis(Long alertId, String ticker) {
        Company company = companyService.getById(ticker);
        Alert alert = alertService.getById(alertId);
        userAuthService.authenticateUsersAccess(alert);

        AnalysisResponseDto responseDto = new AnalysisResponseDto();

        PriceHistoryDto history = stockPricesService.getStockPricesData(company.getId());
        LocalDate firstDay = history.getOhlcHistory().getFirst().getDate();
        LocalDate last = history.getOhlcHistory().getLast().getDate();
        for (LocalDate day : firstDay.datesUntil(last.plusDays(1)).toList()) {
            Optional<List<String>> result = conditionService.evaluateConditionsInPast(alert, history, day);
            if (result.isPresent()) {
                List<String> messages = result.get();
                String generatedMessage = alertMessageGenerator.generate(company, day, messages);
                responseDto.getOccurrences().add(new OccurrenceDto(day, generatedMessage));
            }
        }
        return responseDto;
    }
}
