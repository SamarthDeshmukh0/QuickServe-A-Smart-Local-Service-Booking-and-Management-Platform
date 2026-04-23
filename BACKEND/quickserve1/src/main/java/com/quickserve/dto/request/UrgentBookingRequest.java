// FILE: src/main/java/com/quickserve/dto/request/UrgentBookingRequest.java

package com.quickserve.dto.request;

import jakarta.validation.constraints.*;

public class UrgentBookingRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotBlank(message = "Service is required")
    private String service;

    @NotBlank(message = "Address is required")
    @Size(min = 10, message = "Address must be at least 10 characters")
    private String address;

    @NotBlank(message = "Problem description is required")
    @Size(min = 10, message = "Problem must be at least 10 characters")
    private String problem;

    @NotBlank(message = "City is required")
    private String city;

    @NotNull(message = "Amount is required")
    @Positive
    private Double amount;

    public UrgentBookingRequest() {}

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getProblem() { return problem; }
    public void setProblem(String problem) { this.problem = problem; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}