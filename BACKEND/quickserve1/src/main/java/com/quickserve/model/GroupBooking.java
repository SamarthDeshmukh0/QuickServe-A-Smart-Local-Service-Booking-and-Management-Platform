// ============================================================
// FILE: src/main/java/com/quickserve/model/GroupBooking.java
// NEW FILE — tracks a group of sub-bookings under one package
// ============================================================

package com.quickserve.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "group_bookings")
public class GroupBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique UUID string shared by all sub-bookings in this group
    // e.g. "gb-550e8400-e29b-41d4-a716-446655440000"
    @Column(name = "group_id", nullable = false, unique = true, length = 60)
    private String groupId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "package_id", nullable = false)
    private Long packageId;

    @Column(name = "package_name", nullable = false)
    private String packageName;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(length = 1000)
    private String problem;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "time_slot", nullable = false)
    private String timeSlot;

    // Total BEFORE discount
    @Column(name = "subtotal", nullable = false)
    private Double subtotal;

    // Discount amount in INR (not percentage)
    @Column(name = "discount_amount", nullable = false)
    private Double discountAmount;

    // Final total after discount
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    // Overall status — COMPLETED only when ALL sub-bookings are COMPLETED
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GroupStatus status = GroupStatus.ACTIVE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum GroupStatus {
        ACTIVE,     // at least one sub-booking still in progress
        COMPLETED,  // all sub-bookings COMPLETED
        PAID,       // full group payment done
        CANCELLED   // customer cancelled before any provider started
    }

    public GroupBooking() {}

    // ── Getters & Setters ─────────────────────────────────────
    public Long getId() { return id; }

    public String getGroupId() { return groupId; }
    public void setGroupId(String groupId) { this.groupId = groupId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

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

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public GroupStatus getStatus() { return status; }
    public void setStatus(GroupStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}