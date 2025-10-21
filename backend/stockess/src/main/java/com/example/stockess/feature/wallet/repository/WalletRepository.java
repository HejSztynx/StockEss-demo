package com.example.stockess.feature.wallet.repository;

import com.example.stockess.feature.user.model.User;
import com.example.stockess.feature.wallet.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    List<Wallet> findAllByUser(User user);
}
