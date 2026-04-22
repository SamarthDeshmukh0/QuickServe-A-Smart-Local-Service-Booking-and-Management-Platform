// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/PackageResponse.java
// NEW FILE — sent to frontend when listing available packages
// ============================================================

package com.quickserve.dto.response;

import java.util.List;

public class PackageResponse {

    private Long id;
    private String name;
    private String description;
    private Double discountPercent;
    private Double discountAmount;   // calculated from real service prices
    private Double subtotal;         // sum of all service base prices
    private Double totalAmount;      // subtotal - discountAmount
    private List<String> serviceTypes;
    private List<ServiceInfo> services;

    public PackageResponse() {}

    // Inner class for each service included in the package
    public static class ServiceInfo {
        private String name;
        private String icon;
        private Double amount;

        public ServiceInfo() {}
        public ServiceInfo(String name, String icon, Double amount) {
            this.name = name;
            this.icon = icon;
            this.amount = amount;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Double discountPercent) { this.discountPercent = discountPercent; }

    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public List<String> getServiceTypes() { return serviceTypes; }
    public void setServiceTypes(List<String> serviceTypes) { this.serviceTypes = serviceTypes; }

    public List<ServiceInfo> getServices() { return services; }
    public void setServices(List<ServiceInfo> services) { this.services = services; }
}