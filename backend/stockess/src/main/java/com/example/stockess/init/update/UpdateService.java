package com.example.stockess.init.update;

import com.example.stockess.feature.insight.repository.PredictionRepository;
import com.example.stockess.feature.insight.repository.PriceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@AllArgsConstructor
public class UpdateService {

    public final static LocalDate INITIAL_PREDICTION_DATE = LocalDate.of(2023, 12, 31);
    public final static LocalDate INITIAL_PRICE_DATE = LocalDate.of(2005, 12, 31);

    private final PredictionRepository predictionRepository;
    private final PriceRepository priceRepository;
    private final NotificationUpdateService notificationUpdateService;
    private final PredictionHistoryUpdateService predictionHistoryUpdateService;
    private final PriceUpdateService priceUpdateService;

    public void runUpdate() {
        LocalDate lastKnownPriceDate = getLatestPriceDate();
        System.out.println("----------------UPDATING-PRICES-----------------");
        priceUpdateService.runUpdate(lastKnownPriceDate);
        System.out.println("--------------UPDATING-PREDICTIONS--------------");
        predictionHistoryUpdateService.runUpdate(getLatestPredictionDate());
        System.out.println("-------------UPDATING-NOTIFICATIONS-------------");
        notificationUpdateService.runUpdate(lastKnownPriceDate);
        System.out.println("----------------UPDATES-FINISHED----------------");
    }

    private LocalDate getLatestPredictionDate() {
        return predictionRepository.findLatestPredictionDate().orElse(INITIAL_PREDICTION_DATE);
    }

    private LocalDate getLatestPriceDate() {
        return priceRepository.findLatestPriceDate().orElse(INITIAL_PRICE_DATE);
    }
}
