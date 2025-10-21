package com.example.stockess.feature.user.model;

public interface UserAccessible {
    User getUser();

    default String format() {
        return this.getClass().getSimpleName().toLowerCase();
    }
}
