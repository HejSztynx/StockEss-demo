package com.example.stockess;

import com.example.stockess.configuration.properties.ExternalApiProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableConfigurationProperties(ExternalApiProperties.class)
@EnableScheduling
public class StockessApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockessApplication.class, args);
	}

}
