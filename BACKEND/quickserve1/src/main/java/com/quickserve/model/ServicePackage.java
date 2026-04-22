// ============================================================
// FILE: src/main/java/com/quickserve/model/ServicePackage.java
// NEW FILE — defines the 4 available service packages
// ============================================================

package com.quickserve.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_packages")
public class ServicePackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g. "Home Renovation Package"
    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    // Discount percentage applied to the total price
    // e.g. 10.0 = 10% off the sum of all service amounts
    @Column(name = "discount_percent", nullable = false)
    private Double discountPercent;

    // Comma-separated service names
    // e.g. "Plumber,Electrician,Carpenter"
    @Column(name = "service_types", nullable = false, length = 300)
    private String serviceTypes;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public ServicePackage() {}

    // ── Getters & Setters ─────────────────────────────────────
    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Double discountPercent) { this.discountPercent = discountPercent; }

    public String getServiceTypes() { return serviceTypes; }
    public void setServiceTypes(String serviceTypes) { this.serviceTypes = serviceTypes; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}