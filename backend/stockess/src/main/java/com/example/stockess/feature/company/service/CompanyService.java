package com.example.stockess.feature.company.service;

import com.example.stockess.feature.company.exception.NoCompanyFoundException;
import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.company.repository.CompanyRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;

    public Company getById(String id) {
        return companyRepository.findCompanyById(id).orElseThrow(NoCompanyFoundException::new);
    }
}
