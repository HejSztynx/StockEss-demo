package com.example.stockess.feature.wallet.model;

import com.example.stockess.feature.user.model.User;
import com.example.stockess.feature.user.model.UserAccessible;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "wallets")
@NoArgsConstructor
@Setter
@Getter
public class Wallet implements UserAccessible {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "owner_id")
    private User user;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private LocalDate createdAt;

    @OneToMany(mappedBy = "wallet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StockEntry> stockEntries;

    public void addEntry(StockEntry entry) {
        if (stockEntries == null) {
            stockEntries = new ArrayList<>();
        }
        stockEntries.add(entry);
        entry.setWallet(this);
    }
}
