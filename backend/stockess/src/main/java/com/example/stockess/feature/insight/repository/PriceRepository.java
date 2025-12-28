package com.example.stockess.feature.insight.repository;

import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.insight.model.CompanyDateId;
import com.example.stockess.feature.insight.model.Price;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PriceRepository extends JpaRepository<Price, CompanyDateId> {

    List<Price> findAllById_Company(Company company);

    Optional<Price> findFirstById_CompanyOrderById_DateDesc(Company company);

    @Query("SELECT MAX(p.id.date) FROM Price p")
    Optional<LocalDate> findLatestPriceDate();
}
