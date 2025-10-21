package com.example.stockess.init.update;

import com.example.stockess.external.stockapi.StockAPIClient;
import com.example.stockess.feature.insight.model.Prediction;
import com.example.stockess.feature.insight.model.PredictionId;
import com.example.stockess.feature.insight.model.dto.update.NewUpdateDto;
import com.example.stockess.feature.insight.model.dto.update.OldUpdateDto;
import com.example.stockess.feature.insight.model.dto.update.PredictionHistoryUpdateDto;
import com.example.stockess.feature.insight.repository.PredictionRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class PredictionHistoryUpdateService {

    private final static LocalDate TEST_DATE = LocalDate.of(2025, 3, 24);
//    private final static LocalDate TEST_DATE = LocalDate.of(2025, 4, 28);

    private final StockAPIClient stockAPIClient;
    private final PredictionRepository predictionRepository;

    public void runUpdate(LocalDate lastKnownDate) {
//        LocalDate lastKnownDate = TEST_DATE;
        System.out.println("Last date: " + lastKnownDate);

        List<String> tickers = stockAPIClient.fetchTickers();

        tickers.forEach(ticker -> {
            PredictionHistoryUpdateDto updateDto = stockAPIClient.fetchUpdate(ticker, lastKnownDate);
            createNewPredictions(ticker, updateDto.newUpdates());
            updateOldPredictions(ticker, updateDto.oldUpdates());
            System.out.println("Updated db for ticker: " + ticker);
        });
    }

    private void createNewPredictions(String ticker, List<NewUpdateDto> newUpdates) {
        List<Prediction> predictions = newUpdates.stream().map(newUpdate -> {
            PredictionId id = new PredictionId(ticker, newUpdate.date());
            Prediction prediction = new Prediction();
            prediction.setId(id);
            prediction.setPastPrice(newUpdate.price());
            prediction.setPrediction1m(newUpdate.prediction1m());
            prediction.setPrediction3m(newUpdate.prediction3m());
            prediction.setPrediction6m(newUpdate.prediction6m());
            prediction.setPrediction1y(newUpdate.prediction1y());

            return prediction;
        }).toList();
        predictionRepository.saveAll(predictions);
    }

    private void updateOldPredictions(String ticker, List<OldUpdateDto> oldUpdates) {
        oldUpdates.forEach(oldUpdate -> {
            Double realPrice = oldUpdate.realPrice();

            PredictionId id1m = new PredictionId(ticker, oldUpdate.oldDate1m());
            predictionRepository.findById(id1m).ifPresent(prediction -> {
                prediction.setRealPrice1m(realPrice);
                prediction.setSurprise1m(calculateSurprise(prediction.getPrediction1m(), realPrice));
                predictionRepository.save(prediction);
            });

            PredictionId id3m = new PredictionId(ticker, oldUpdate.oldDate3m());
            predictionRepository.findById(id3m).ifPresent(prediction -> {
                prediction.setRealPrice3m(realPrice);
                prediction.setSurprise3m(calculateSurprise(prediction.getPrediction3m(), realPrice));
                predictionRepository.save(prediction);
            });

            PredictionId id6m = new PredictionId(ticker, oldUpdate.oldDate6m());
            predictionRepository.findById(id6m).ifPresent(prediction -> {
                prediction.setRealPrice6m(realPrice);
                prediction.setSurprise6m(calculateSurprise(prediction.getPrediction6m(), realPrice));
                predictionRepository.save(prediction);
            });

            PredictionId id1y = new PredictionId(ticker, oldUpdate.oldDate1y());
            predictionRepository.findById(id1y).ifPresent(prediction -> {
                prediction.setRealPrice1y(realPrice);
                prediction.setSurprise1y(calculateSurprise(prediction.getPrediction1y(), realPrice));
                predictionRepository.save(prediction);
            });
        });
    }

    private double calculateSurprise(double predictedPrice, double realPrice) {
        return (predictedPrice - realPrice) * 100 / predictedPrice;
    }
}
