package com.example.stockess.init.update;

import com.example.stockess.feature.alert.model.util.AlertMessageGenerator;
import com.example.stockess.feature.alert.service.AlertService;
import com.example.stockess.feature.alert.service.ConditionService;
import com.example.stockess.feature.alert.service.NotificationService;
import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.insight.model.dto.PriceHistoryDto;
import com.example.stockess.feature.insight.repository.PriceRepository;
import com.example.stockess.feature.insight.service.StockPricesService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
@Transactional
public class NotificationUpdateService {

    private final AlertService alertService;
    private final NotificationService notificationService;
    private final ConditionService conditionService;
    private final StockPricesService stockPricesService;
    private final AlertMessageGenerator alertMessageGenerator;
    private final PriceRepository priceRepository;

    public void runUpdate(LocalDate lastKnownDate) {
        LocalDate latestKnownDate = priceRepository.findLatestPriceDate().orElse(UpdateService.INITIAL_PRICE_DATE);
        checkAlerts(lastKnownDate, latestKnownDate);
    }

    public void checkAlerts(LocalDate lastKnownDate, LocalDate latestKnownDate) {
        List<LocalDate> daysToCheck = lastKnownDate.plusDays(1)
                .datesUntil(latestKnownDate.plusDays(1))
                .toList();

        alertService.getAllActive()
                .forEach(alert -> {
                    outerLoop:
                    for (Company company : alert.getCompanies()) {
                        PriceHistoryDto history = stockPricesService.getStockPricesData(company.getId());
                        for (LocalDate day : daysToCheck) {
                            Optional<List<String>> result = conditionService.evaluateConditionsInPresent(alert, history, day);
                            if (result.isPresent()) {
                                List<String> messages = result.get();
                                String generatedMessage = alertMessageGenerator.generate(company, day, messages);
                                notificationService.createNotification(alert, generatedMessage);
                                if (alert.isOnce()) {
                                    alertService.deactivateAlert(alert);
                                    break outerLoop;
                                }
                            }
                        }
                    }
                });
        System.out.println("Updated notifications");
    }
}
