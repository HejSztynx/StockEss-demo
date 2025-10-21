package com.example.stockess.feature.user.model;

import com.example.stockess.feature.alert.model.Alert;
import com.example.stockess.feature.wallet.model.Wallet;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "user", orphanRemoval = true)
    private List<Wallet> wallets;

    @OneToMany(mappedBy = "user", orphanRemoval = true)
    private List<Alert> alerts;

    public void addWallet(Wallet wallet) {
        wallets.add(wallet);
        wallet.setUser(this);
    }

    public void removeWallet(Wallet wallet) {
        wallets.remove(wallet);
        wallet.setUser(null);
    }

    public void addAlert(Alert alert) {
        alerts.add(alert);
        alert.setUser(this);
    }

    public void removeAlert(Alert alert) {
        alerts.remove(alert);
        alert.setUser(null);
    }
}
