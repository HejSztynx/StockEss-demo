package com.example.stockess.feature.alert.service;

import com.example.stockess.feature.alert.dto.ConditionDto;
import com.example.stockess.feature.alert.dto.request.AlertDtoRequest;
import com.example.stockess.feature.alert.dto.response.AlertDto;
import com.example.stockess.feature.alert.exception.NoAlertFoundException;
import com.example.stockess.feature.alert.model.Alert;
import com.example.stockess.feature.alert.model.condition.BaseCondition;
import com.example.stockess.feature.alert.repository.AlertRepository;
import com.example.stockess.feature.alert.repository.ConditionRepository;
import com.example.stockess.feature.alert.util.AlertMapper;
import com.example.stockess.feature.alert.util.ConditionFactory;
import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.company.service.CompanyService;
import com.example.stockess.feature.user.model.User;
import com.example.stockess.feature.user.service.UserAuthService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
@Transactional
public class AlertService {

    private final CompanyService companyService;
    private final UserAuthService userAuthService;
    private final AlertRepository alertRepository;
    private final ConditionRepository conditionRepository;
    private final AlertMapper alertMapper;
    private final ConditionFactory conditionFactory;

    public Alert getById(Long id) {
        return alertRepository.findById(id).orElseThrow(NoAlertFoundException::new);
    }

    public List<Alert> getAllActive() {
        return alertRepository.findAllByIsActiveIsTrue();
    }

    public List<AlertDto> getAll() {
        User user = userAuthService.getAuthenticatedUser();

        return alertRepository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(alertMapper::toAlertDto)
                .toList();
    }

    public void updateAlert(AlertDtoRequest request) {
        Long alertId = request.getId();
        Alert alert = getById(alertId);
        userAuthService.authenticateUsersAccess(alert);

        List<Company> companies = request.getCompanies().stream()
                .map(companyService::getById)
                .toList();
        alert.setCompanies(new ArrayList<>(companies));

        alertMapper.updateAlert(alert, request);

        List<BaseCondition> newConditions = new ArrayList<>();
        for (ConditionDto dto : request.getConditions()) {
            BaseCondition condition = conditionFactory.findOrCreate(dto);
            conditionRepository.save(condition);
            condition.getAlerts().add(alert);
            newConditions.add(condition);
        }
        alert.setConditions(newConditions);

        alertRepository.save(alert);
    }

    public void createAlert(AlertDtoRequest request) {
        User user = userAuthService.getAuthenticatedUser();
        List<Company> companies = request.getCompanies().stream()
                .map(companyService::getById)
                .toList();
        Alert alert = alertMapper.toAlert(request);
        alert.setCompanies(companies);

        for (ConditionDto conditionDto : request.getConditions()) {
            BaseCondition condition = conditionFactory.findOrCreate(conditionDto);
            conditionRepository.save(condition);
            alert.addCondition(condition);
        }
        user.addAlert(alert);
        alertRepository.save(alert);
    }

    public void activateAlert(Long id) {
        Alert alert = getById(id);
        userAuthService.authenticateUsersAccess(alert);

        alert.setActive(true);
        alertRepository.save(alert);
    }

    public void deactivateAlert(Long id) {
        Alert alert = getById(id);
        userAuthService.authenticateUsersAccess(alert);

        alert.setActive(false);
        alertRepository.save(alert);
    }

    public void deactivateAlert(Alert alert) {
        alert.setActive(false);
        alertRepository.save(alert);
    }

    public void deleteAlert(Long id) {
        User user = userAuthService.getAuthenticatedUser();
        Alert alert = getById(id);
        userAuthService.authenticateUsersAccess(alert);

        List<BaseCondition> relatedConditions = new ArrayList<>(alert.getConditions());
        relatedConditions.forEach(alert::removeCondition);

        user.removeAlert(alert);
        alertRepository.delete(alert);

        relatedConditions.forEach(cond -> {
            if (cond.getAlerts().isEmpty()) {
                conditionRepository.delete(cond);
            }
        });
    }
}
