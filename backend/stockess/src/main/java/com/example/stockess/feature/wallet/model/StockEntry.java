package com.example.stockess.feature.wallet.model;

import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.wallet.dto.request.CloseStockEntryRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "stock_entries")
@NoArgsConstructor
@Setter
@Getter
public class StockEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @ManyToOne()
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private Long quantity;

    @Column(nullable = false)
    private Double commission;

    @Column(nullable = false)
    private Double buyPrice;

    @Column(nullable = false)
    private LocalDate buyDate;

    @Column(nullable = false)
    private boolean isOpen;

    private Double sellPrice;

    private LocalDate sellDate;

    public void closePosition(CloseStockEntryRequest closeStockEntryRequest) {
        this.sellPrice = closeStockEntryRequest.getSellPrice();
        this.sellDate = closeStockEntryRequest.getSellDate();
        this.isOpen = false;
    }
}
