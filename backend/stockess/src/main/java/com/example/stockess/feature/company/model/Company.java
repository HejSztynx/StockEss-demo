package com.example.stockess.feature.company.model;

import com.example.stockess.feature.insight.model.Prediction;
import com.example.stockess.feature.insight.model.Price;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

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

    @JsonIgnore
    @OneToMany(mappedBy = "id.company")
    @OrderBy("id.date DESC")
    private List<Prediction> predictions = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "id.company")
    @OrderBy("id.date ASC")
    private List<Price> prices = new ArrayList<>();
}
