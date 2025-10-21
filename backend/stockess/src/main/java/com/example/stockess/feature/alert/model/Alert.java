package com.example.stockess.feature.alert.model;

import com.example.stockess.feature.alert.model.condition.BaseCondition;
import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.user.model.User;
import com.example.stockess.feature.user.model.UserAccessible;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alert implements UserAccessible {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "once", nullable = false)
    private boolean once;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @ManyToMany()
    private List<Company> companies = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "alert_conditions",
            joinColumns = @JoinColumn(referencedColumnName = "id", name = "alert_id"),
            inverseJoinColumns = @JoinColumn(referencedColumnName = "id", name = "condition_id")
    )
    private List<BaseCondition> conditions = new ArrayList<>();

    @ManyToOne()
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "alert", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt DESC")
    private List<Notification> notifications = new ArrayList<>();

    public void addCondition(BaseCondition condition) {
        if (!conditions.contains(condition)) {
            conditions.add(condition);
            condition.getAlerts().add(this);
        }
    }

    public void removeCondition(BaseCondition condition) {
        conditions.remove(condition);
        condition.getAlerts().remove(this);
    }

    public void addNotification(Notification notification) {
        if (!notifications.contains(notification)) {
            notifications.add(notification);
            notification.setAlert(this);
        }
    }

    public void removeNotification(Notification notification) {
        if (notifications.remove(notification)) {
            notification.setAlert(null);
        }
    }
}
