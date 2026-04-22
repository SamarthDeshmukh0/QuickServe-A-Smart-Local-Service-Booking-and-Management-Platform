// ============================================================
// FILE: src/main/java/com/quickserve/dto/request/PackageBookingRequest.java
// NEW FILE — sent from BookPackage.jsx when customer confirms
// ============================================================

package com.quickserve.dto.request;

import jakarta.validation.constraints.*;

public class PackageBookingRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Package ID is required")
    private Long packageId;

    @NotBlank(message = "Address is required")
    @Size(min = 10, message = "Address must be at least 10 characters")
    private String address;

    @NotBlank(message = "Problem description is required")
    @Size(min = 10, message = "Problem must be at least 10 characters")
    private String problem;

    @NotNull(message = "Date is required")
    private String date;              // ISO date string "2026-05-01"

    @NotBlank(message = "Time slot is required")
    private String timeSlot;          // e.g. "10:00-11:00"

    @NotBlank(message = "City is required")
    private String city;

    public PackageBookingRequest() {}

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getProblem() { return problem; }
    public void setProblem(String problem) { this.problem = problem; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}