package com.example.stockess.init;
import com.example.stockess.external.stockapi.StockAPIClient;
import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.company.repository.CompanyRepository;
import com.example.stockess.feature.insight.model.Price;
import com.example.stockess.feature.insight.model.dto.PriceHistoryDto;
import com.example.stockess.feature.insight.repository.PriceRepository;
import com.example.stockess.feature.insight.util.PriceMapper;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class StartupDataLoader {

    private final CompanyRepository companyRepository;
    private final PriceRepository priceRepository;
    private final StockAPIClient stockAPIClient;

    private final List<String> companiesData = List.of(
            "CDR.WA - CD Projekt RED",
            "PGE.WA - PGE Polska Grupa Energetyczna",
            "PKN.WA - PKN Orlen",
            "KRU.WA - Kruk",
            "KGH.WA - KGHM Polska Miedź",
            "PZU.WA - PZU",
            "PKO.WA - PKO Bank Polski",
            "PEO.WA - Pekao",
            "MBK.WA - mBank",
            "SPL.WA - Santander Bank Polska",
            "ALR.WA - Alior Bank",
            "OPL.WA - Orange Polska",
            "ALE.WA - Allegro",
            "DNP.WA - Dino Polska",
            "JSW.WA - Jastrzębska Spółka Węglowa",
            "KTY.WA - Grupa Kety",
            "BDX.WA - Budimex",
            "CCC.WA - CCC",
            "LPP.WA - LPP",
            "PCO.WA - Pepco Group"
    );

    @Transactional
    public void add_initial_data() {
        add_initial_company_data();
    }

    private void add_initial_company_data() {
        if (companyRepository.count() == 0) {
            List<Company> companies = companiesData.stream()
                    .map(data -> {
                        String[] parts = data.split(" - ", 2);
                        Company company = new Company();
                        company.setId(parts[0]);
                        company.setFullName(parts.length > 1 ? parts[1] : "Unknown Name");
                        return company;
                    })
                    .toList();

            companyRepository.saveAll(companies);
            System.out.println("Added " + companies.size() + " companies to database.");
        } else {
            System.out.println("Companies already present in database, skipping insert.");
        }
    }
}

