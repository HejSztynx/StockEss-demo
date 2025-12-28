package com.example.stockess.feature.wallet.repository;

import com.example.stockess.feature.wallet.model.StockEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockEntryRepository extends JpaRepository<StockEntry, Long> {

}
