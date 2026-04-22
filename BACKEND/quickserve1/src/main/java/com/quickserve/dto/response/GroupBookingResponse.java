// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/GroupBookingResponse.java
// NEW FILE — returned after package booking is created
// ============================================================

package com.quickserve.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class GroupBookingResponse {

    private Long id;
    private String groupId;
    private Long customerId;
    private String customerName;
    private Long packageId;
    private String packageName;
    private String address;
    private String problem;
    private LocalDate date;
    private String timeSlot;
    private Double subtotal;
    private Double discountAmount;
    private Double discountPercent;
    private Double totalAmount;
    private String status;
    private LocalDateTime createdAt;

    // The list of individual sub-bookings created
    private List<BookingResponse> subBookings;

    public GroupBookingResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getGroupId() { return groupId; }
    public void setGroupId(String groupId) { this.groupId = groupId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getProblem() { return problem; }
    public void setProblem(String problem) { this.problem = problem; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }

    public Double getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Double discountPercent) { this.discountPercent = discountPercent; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<BookingResponse> getSubBookings() { return subBookings; }
    public void setSubBookings(List<BookingResponse> subBookings) { this.subBookings = subBookings; }
}