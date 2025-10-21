package com.example.stockess.feature.wallet.service;

import com.example.stockess.feature.user.model.User;
import com.example.stockess.feature.user.service.UserAuthService;
import com.example.stockess.feature.wallet.util.WalletMapper;
import com.example.stockess.feature.wallet.model.Wallet;
import com.example.stockess.feature.wallet.dto.response.WalletDto;
import com.example.stockess.feature.wallet.exception.NoWalletFoundException;
import com.example.stockess.feature.wallet.repository.WalletRepository;
import com.example.stockess.feature.wallet.dto.request.AddWalletRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
@Transactional
public class WalletService {

    private final WalletRepository walletRepository;
    private UserAuthService userAuthService;
    private final WalletMapper walletMapper;

    public Wallet getWalletById(Long walletId) {
        return walletRepository.findById(walletId).orElseThrow(NoWalletFoundException::new);
    }

    public List<WalletDto> getAll() {
        User user = userAuthService.getAuthenticatedUser();

        return walletRepository.findAllByUser(user).stream()
                .map(walletMapper::toWalletDto)
                .toList();
    }

    public void addWallet(AddWalletRequest addWalletRequest) {
        User user = userAuthService.getAuthenticatedUser();

        Wallet wallet = walletMapper.toWallet(addWalletRequest);
        user.addWallet(wallet);

        walletRepository.save(wallet);
    }

    public void deleteWallet(Long walletId) {
        User user = userAuthService.getAuthenticatedUser();
        Wallet wallet = walletRepository.findById(walletId).orElseThrow(NoWalletFoundException::new);

        userAuthService.authenticateUsersAccess(user, wallet);
        user.removeWallet(wallet);

        walletRepository.delete(wallet);
    }
}
