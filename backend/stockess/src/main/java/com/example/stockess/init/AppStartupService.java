package com.example.stockess.init;

import com.example.stockess.external.stockapi.StockAPIClient;
import com.example.stockess.init.update.UpdateService;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class AppStartupService {

    private final StockAPIClient stockAPIClient;
    private final UpdateService updateService;
    private final StartupDataLoader startupDataLoader;

    @PostConstruct
    public void onStartup() {
        runUpdate();
    }

    @Scheduled(cron = "0 40 * * * *")
    public void scheduledCheck() {
//        runUpdate();
    }

    private void runUpdate() {
        startupDataLoader.add_initial_data();

        while (!stockAPIClient.ping()) {
            System.out.println("Waiting for Stock API...");
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        System.out.println("Stock API available!");
        updateService.runUpdate();
    }
}
