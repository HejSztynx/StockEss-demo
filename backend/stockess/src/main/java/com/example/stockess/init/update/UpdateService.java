package com.example.stockess.init.update;

import com.example.stockess.feature.insight.repository.PredictionRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@AllArgsConstructor
public class UpdateService {

    public final static LocalDate INITIAL_DATE = LocalDate.of(2023, 12, 31);

    private final PredictionRepository predictionRepository;
    private final NotificationUpdateService notificationUpdateService;
    private final PredictionHistoryUpdateService predictionHistoryUpdateService;

    public void runUpdate() {
        LocalDate lastKnownDate = getLatestPredictionDate();
        predictionHistoryUpdateService.runUpdate(lastKnownDate);
        notificationUpdateService.runUpdate(lastKnownDate);
    }

    private LocalDate getLatestPredictionDate() {
        return predictionRepository.findLatestPredictionDate().orElse(INITIAL_DATE);
    }
}
