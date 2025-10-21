package com.example.stockess.feature.company.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "companies")
@NoArgsConstructor
@Setter
@Getter
public class Company {

    @Id
    private String id;

    @Column(nullable = false)
    private String fullName;
}
