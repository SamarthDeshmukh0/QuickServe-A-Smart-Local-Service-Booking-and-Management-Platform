// ============================================================
// FILE: src/main/java/com/quickserve/model/Booking.java
// ============================================================
/*
 * 
 
 working (old version)
package com.quickserve.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    //Null fro the urgent bookings until the provider accepts..
   // @Column(name = "provider_id", nullable = false)
    @Column(name = "provider_id")

    private Long providerId;

    @Column(nullable = false)
    private String service;

    @Column(nullable = false)
    private LocalDate date;

   //ASAP for urgent bookings — no slot selected
    @Column(name = "time_slot", nullable = false)
    private String timeSlot;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(nullable = false, length = 1000)
    private String problem;

    @Column(nullable = false)
    private Double amount;
    
    //final price setting by the provider
    @Column(name="final_amount")
    private Double finalAmount;
    
    //work description
    @Column(name = "work_description", length = 2000)
    private String workDescription;

    
    //amount receipt
    @Column(name="receipt_items", length=3000)
    private String receiptItems;
    
    //ai estimate range price
    @Column(name="ai_estimate_range", length=50)
    private String aiEstimateRange;
    
    //flag — true if provider's price was outside AI range
    @Column(name = "outside_estimate")
    //@Builder.Default
    private Boolean outsideEstimate = false;
    
    //NEW: Urgent booking fields──
    // true = urgent booking, skips slot selection, notifies all providers
    @Column(name = "is_urgent")
    @Builder.Default
    private Boolean isUrgent = false;

    // Urgent surcharge applied on top of base amount (₹99)
    @Column(name = "urgent_fee")
    @Builder.Default
    private Double urgentFee = 0.0;

    // Urgent bookings expire 30 minutes after creation if no provider accepts
    // NULL for normal bookings
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    // Reason stored when booking is cancelled (e.g. "Urgent booking expired")
    @Column(name = "cancel_reason", length = 500)
    private String cancelReason;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    //@Builder.Default
    private Status status = Status.BOOKED;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public Booking() {}
    
    //  Constructor (exclude id + timestamps)
    public Booking(Long customerId, Long providerId, String service,
                   LocalDate date, String timeSlot, String address,
                   String problem, Double amount, Status status,
                   Double finalAmount, String workDescription,
                   String receiptItems, String aiEstimateRange,
                   Boolean isUrgent, Double urgentFee, String cancelReason) {
        
    	this.customerId = customerId;
        this.providerId = providerId;
        this.service = service;
        this.date = date;
        this.timeSlot = timeSlot;
        this.address = address;
        this.problem = problem;
        this.amount = amount;
        this.status = status;
        this.finalAmount=finalAmount;
        this.workDescription=workDescription;
        this.receiptItems=receiptItems;
        this.aiEstimateRange=aiEstimateRange;
        this.isUrgent=isUrgent;
        this.urgentFee=urgentFee;
        this.cancelReason=cancelReason;
    }
    
    //getters/setters
    
    public Long getId() { return id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getProblem() { return problem; }
    public void setProblem(String problem) { this.problem = problem; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    
    
    public Double getFinalAmount() {
		return finalAmount;
	}

	public void setFinalAmount(Double finalAmount) {
		this.finalAmount = finalAmount;
	}

	public String getWorkDescription() {
		return workDescription;
	}

	public void setWorkDescription(String workDescription) {
		this.workDescription = workDescription;
	}

	public String getReceiptItems() {
		return receiptItems;
	}

	public void setReceiptItems(String receiptItems) {
		this.receiptItems = receiptItems;
	}

	public String getAiEstimateRange() {
		return aiEstimateRange;
	}

	public void setAiEstimateRange(String aiEstimateRange) {
		this.aiEstimateRange = aiEstimateRange;
	}

	public Boolean getOutsideEstimate() { return outsideEstimate; }
	public void setOutsideEstimate(Boolean outsideEstimate) { 
		this.outsideEstimate = outsideEstimate; }
	
	
	
	
	public Boolean getIsUrgent() {
		return isUrgent;
	}

	public void setIsUrgent(Boolean isUrgent) {
		this.isUrgent = isUrgent;
	}

	public Double getUrgentFee() {
		return urgentFee;
	}

	public void setUrgentFee(Double urgentFee) {
		this.urgentFee = urgentFee;
	}

	public LocalDateTime getExpiresAt() {
		return expiresAt;
	}

	public void setExpiresAt(LocalDateTime expiresAt) {
		this.expiresAt = expiresAt;
	}

	public String getCancelReason() {
		return cancelReason;
	}

	public void setCancelReason(String cancelReason) {
		this.cancelReason = cancelReason;
	}

	@PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Status {
        BOOKED, ACCEPTED, IN_PROGRESS, COMPLETED, PAID, CANCELLED
    }
}


*/


//for grp bking
// ============================================================
// FILE: src/main/java/com/quickserve/model/Booking.java
// FULL REPLACEMENT — no Lombok, adds groupBookingId column
// All urgent + receipt fields included
// ============================================================

package com.quickserve.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    // Nullable — urgent bookings start with no provider
    @Column(name = "provider_id")
    private Long providerId;

    @Column(nullable = false)
    private String service;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "time_slot", nullable = false)
    private String timeSlot;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(nullable = false, length = 1000)
    private String problem;

    @Column(nullable = false)
    private Double amount;

    // Receipt / final price fields
    @Column(name = "final_amount")
    private Double finalAmount;

    @Column(name = "work_description", length = 2000)
    private String workDescription;

    @Column(name = "receipt_items", length = 3000)
    private String receiptItems;

    @Column(name = "ai_estimate_range", length = 50)
    private String aiEstimateRange;

    @Column(name = "outside_estimate")
    private Boolean outsideEstimate = false;

    // Urgent booking fields
    @Column(name = "is_urgent")
    private Boolean isUrgent = false;

    @Column(name = "urgent_fee")
    private Double urgentFee = 0.0;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "cancel_reason", length = 500)
    private String cancelReason;

    // ── NEW: Group booking field ──────────────────────────────
    // Set to GroupBooking.groupId when this booking is part of a package
    // NULL for standalone bookings
    @Column(name = "group_booking_id", length = 60)
    private String groupBookingId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.BOOKED;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Status {
        BOOKED, ACCEPTED, IN_PROGRESS, COMPLETED, PAID, CANCELLED
    }

    public Booking() {}

    // ── Getters & Setters ─────────────────────────────────────
    public Long getId() { return id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getProblem() { return problem; }
    public void setProblem(String problem) { this.problem = problem; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getFinalAmount() { return finalAmount; }
    public void setFinalAmount(Double finalAmount) { this.finalAmount = finalAmount; }

    public String getWorkDescription() { return workDescription; }
    public void setWorkDescription(String workDescription) { this.workDescription = workDescription; }

    public String getReceiptItems() { return receiptItems; }
    public void setReceiptItems(String receiptItems) { this.receiptItems = receiptItems; }

    public String getAiEstimateRange() { return aiEstimateRange; }
    public void setAiEstimateRange(String aiEstimateRange) { this.aiEstimateRange = aiEstimateRange; }

    public Boolean getOutsideEstimate() { return outsideEstimate; }
    public void setOutsideEstimate(Boolean outsideEstimate) { this.outsideEstimate = outsideEstimate; }

    public Boolean getIsUrgent() { return isUrgent; }
    public void setIsUrgent(Boolean isUrgent) { this.isUrgent = isUrgent; }

    public Double getUrgentFee() { return urgentFee; }
    public void setUrgentFee(Double urgentFee) { this.urgentFee = urgentFee; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }

    public String getGroupBookingId() { return groupBookingId; }
    public void setGroupBookingId(String groupBookingId) { this.groupBookingId = groupBookingId; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}