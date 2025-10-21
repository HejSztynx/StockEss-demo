package com.example.stockess.feature.insight.repository;

import com.example.stockess.feature.insight.model.Prediction;
import com.example.stockess.feature.insight.model.PredictionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PredictionRepository extends JpaRepository<Prediction, PredictionId> {

    List<Prediction> findAllById_CompanyTickerOrderById_PredictionDateDesc(String companyTicker);

    @Query("SELECT MAX(p.id.predictionDate) FROM Prediction p")
    Optional<LocalDate> findLatestPredictionDate();
}
