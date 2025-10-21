package com.example.stockess.init;
import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.company.repository.CompanyRepository;
import com.example.stockess.feature.insight.model.Prediction;
import com.example.stockess.feature.insight.model.PredictionId;
import com.example.stockess.feature.insight.repository.PredictionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@AllArgsConstructor
public class StartupDataLoader {

    private final PredictionRepository predictionRepository;

    private final CompanyRepository companyRepository;

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

    public void add_initial_data() {
//        doSomething();
        add_company_data();
    }

    private void add_company_data() {
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

    private void doSomething() throws Exception {
        if (predictionRepository.count() == 0) {
            System.out.println(">>> Database empty - creating sample data...");

            List<Prediction> testData = List.of(
                    createPrediction("CDR.WA",
                            LocalDate.of(2024, 1, 1),
                            180.5,
                            185.0,
                            190.0,
                            195.0,
                            200.0,
                            182.2,
                            186.8,
                            183.4,
                            176.2),
                    createPrediction("CDR.WA",
                            LocalDate.of(2024, 1, 2),
                            2700.0,
                            2720.0,
                            2750.0,
                            2800.0,
                            2850.0,
                            2600.0,
                            2650.0,
                            3000.0,
                            null),
                    createPrediction("CDR.WA",
                            LocalDate.of(2024, 1, 3),
                            320.0,
                            325.0,
                            330.0,
                            340.0,
                            350.0,
                            null,
                            null,
                            null,
                            null),
                    createPrediction("CCC.WA",
                            LocalDate.of(2024,
                                    1, 1),
                            900.0,
                            920.0,
                            950.0,
                            980.0,
                            1000.0,
                            910.0,
                            null,
                            null,
                            null),
                    createPrediction("CCC.WA",
                            LocalDate.of(2024, 1, 2),
                            3300.0,
                            3320.0,
                            3350.0,
                            3400.0,
                            3450.0,
                            null,
                            null,
                            null,
                            null)
            );


            predictionRepository.saveAll(testData);

            System.out.println(">>> Added 5 sample predictions");
        } else {
            System.out.println(">>> Something is already in predictions");
        }
    }

    private Prediction createPrediction(String ticker, LocalDate date,
                                        double past, double p1m, double p3m, double p6m, double p1y,
                                        Double realPrice1m, Double realPrice3m, Double realPrice6m, Double realPrice1y) {
        Prediction prediction = new Prediction();
        prediction.setId(new PredictionId(ticker, date));
        prediction.setPastPrice(past);
        prediction.setPrediction1m(p1m);
        prediction.setPrediction3m(p3m);
        prediction.setPrediction6m(p6m);
        prediction.setPrediction1y(p1y);
        prediction.setRealPrice1m(realPrice1m);
        prediction.setRealPrice3m(realPrice3m);
        prediction.setRealPrice6m(realPrice6m);
        prediction.setRealPrice1y(realPrice1y);
        return prediction;
    }

}

