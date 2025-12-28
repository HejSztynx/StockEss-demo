package com.example.stockess.feature.insight.repository;

import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.insight.model.Prediction;
import com.example.stockess.feature.insight.model.CompanyDateId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PredictionRepository extends JpaRepository<Prediction, CompanyDateId> {

    List<Prediction> findAllById_Company(Company company);

    @Query("SELECT MAX(p.id.date) FROM Prediction p")
    Optional<LocalDate> findLatestPredictionDate();

    Optional<Prediction> findFirstById_CompanyOrderById_DateDesc(Company company);
}
