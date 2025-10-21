package com.example.stockess.feature.wallet.service;

import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.company.service.CompanyService;
import com.example.stockess.feature.user.model.User;
import com.example.stockess.feature.user.service.UserAuthService;
import com.example.stockess.feature.user.service.UserService;
import com.example.stockess.feature.wallet.dto.request.BaseStockEntryRequest;
import com.example.stockess.feature.wallet.dto.request.CloseStockEntryRequest;
import com.example.stockess.feature.wallet.dto.request.EditStockEntryRequest;
import com.example.stockess.feature.wallet.exception.NoStockEntryFoundException;
import com.example.stockess.feature.wallet.model.StockEntry;
import com.example.stockess.feature.wallet.repository.StockEntryRepository;
import com.example.stockess.feature.wallet.util.StockEntryMapper;
import com.example.stockess.feature.wallet.dto.request.AddStockEntryRequest;
import com.example.stockess.feature.wallet.dto.response.StockEntryDto;
import com.example.stockess.feature.wallet.model.Wallet;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
@Transactional
public class StockEntryService {

    private final StockEntryRepository stockEntryRepository;
    private final WalletService walletService;
    private final CompanyService companyService;
    private UserAuthService userAuthService;
    private final StockEntryMapper stockEntryMapper;

    public List<StockEntryDto> getAll(Long walletId) {
        User user = userAuthService.getAuthenticatedUser();
        Wallet wallet = walletService.getWalletById(walletId);
        userAuthService.authenticateUsersAccess(user, wallet);

        return wallet.getStockEntries().stream()
                .map(stockEntryMapper::toStockEntryDto)
                .toList();
    }

    public void addEntry(AddStockEntryRequest addStockEntryRequest) {
        User user = userAuthService.getAuthenticatedUser();
        Wallet wallet = walletService.getWalletById(addStockEntryRequest.getWalletId());
        BaseStockEntryRequest data = addStockEntryRequest.getData();
        Company company = companyService.getById(data.getCompany());
        userAuthService.authenticateUsersAccess(user, wallet);

        StockEntry stockEntry = stockEntryMapper.toStockEntry(data, company);
        wallet.addEntry(stockEntry);
        stockEntryRepository.save(stockEntry);
    }

    public void closePosition(CloseStockEntryRequest closeStockEntryRequest) {
        User user = userAuthService.getAuthenticatedUser();
        StockEntry stockEntry = stockEntryRepository.findById(closeStockEntryRequest.getId()).orElseThrow(NoStockEntryFoundException::new);
        Wallet wallet = stockEntry.getWallet();
        userAuthService.authenticateUsersAccess(user, wallet);

        stockEntry.closePosition(closeStockEntryRequest);
        stockEntryRepository.save(stockEntry);
    }

    public void editEntry(EditStockEntryRequest editStockEntryRequest) {
        User user = userAuthService.getAuthenticatedUser();
        StockEntry stockEntry = stockEntryRepository.findById(editStockEntryRequest.getId()).orElseThrow(NoStockEntryFoundException::new);
        BaseStockEntryRequest data = editStockEntryRequest.getData();
        Wallet wallet = stockEntry.getWallet();
        userAuthService.authenticateUsersAccess(user, wallet);
        String companyId = data.getCompany();
        Company company = companyService.getById(companyId);

        stockEntryMapper.updateStockEntry(stockEntry, data, company);
        stockEntryRepository.save(stockEntry);
    }

    public void deleteEntry(Long stockEntryId) {
        User user = userAuthService.getAuthenticatedUser();
        StockEntry stockEntry = stockEntryRepository.findById(stockEntryId).orElseThrow(NoStockEntryFoundException::new);
        Wallet wallet = stockEntry.getWallet();
        userAuthService.authenticateUsersAccess(user, wallet);

        stockEntryRepository.delete(stockEntry);
    }
}
