// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/BookingResponse.java
// ============================================================

/*
 * package com.quickserve.dto.response;
 

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

//@Data
//@Builder
public class BookingResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long providerId;
    private String providerName;
    private String providerCity;
    private String service;
    private LocalDate date;
    private String timeSlot;
    private String address;
    private String problem;
    private Double amount;
    //provider's final amount
    private Double finalAmount;
    //work description
    private String workDescription;
    //itemised recceipt
    private String receiptItems;
    // NEW — AI estimate range string e.g. "650-950"
    private String aiEstimateRange;
    // NEW — was the final price outside the AI estimate range?
    private Boolean outsideEstimate;
    
    // Urgent booking fields
    private Boolean isUrgent;
    private Double urgentFee;
    private LocalDateTime expiresAt;
    private String cancelReason;
    
    private String status;
    private boolean rated;
    private LocalDateTime createdAt;
    
    public BookingResponse() {}

	public BookingResponse(Long id, Long customerId, String customerName,
							Long providerId, String providerName,
							String providerCity, String service, LocalDate date,
							String timeSlot, String address, String problem,
							Double amount, Boolean isUrgent, Double urgentFee, 
							LocalDateTime expiresAt, String cancelReason,
							String status, Double finalAmount,
							String workDescription, String receiptItems,
							String aiEstimateRange, Boolean outsideEstimate,
							boolean rated, LocalDateTime createdAt) {
		super();
		this.id = id;
		this.customerId = customerId;
		this.customerName = customerName;
		this.providerId = providerId;
		this.providerName = providerName;
		this.providerCity = providerCity;
		this.service = service;
		this.date = date;
		this.timeSlot = timeSlot;
		this.address = address;
		this.problem = problem;
		this.amount = amount;
		this.finalAmount=finalAmount;
		this.workDescription=workDescription;
		this.receiptItems=receiptItems;
		this.aiEstimateRange=aiEstimateRange;
		this.outsideEstimate=outsideEstimate;
		this.isUrgent=isUrgent;
		this.urgentFee=urgentFee;
		this.expiresAt=expiresAt;
		this.cancelReason=cancelReason;
		this.status = status;
		this.rated = rated;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public Long getProviderId() {
		return providerId;
	}

	public void setProviderId(Long providerId) {
		this.providerId = providerId;
	}

	public String getProviderName() {
		return providerName;
	}

	public void setProviderName(String providerName) {
		this.providerName = providerName;
	}

	public String getProviderCity() {
		return providerCity;
	}

	public void setProviderCity(String providerCity) {
		this.providerCity = providerCity;
	}

	public String getService() {
		return service;
	}

	public void setService(String service) {
		this.service = service;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getTimeSlot() {
		return timeSlot;
	}

	public void setTimeSlot(String timeSlot) {
		this.timeSlot = timeSlot;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getProblem() {
		return problem;
	}

	public void setProblem(String problem) {
		this.problem = problem;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}
	
	

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

	public Boolean getOutsideEstimate() {
		return outsideEstimate;
	}

	public void setOutsideEstimate(Boolean outsideEstimate) {
		this.outsideEstimate = outsideEstimate;
	}

	
	
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public boolean isRated() {
		return rated;
	}

	public void setRated(boolean rated) {
		this.rated = rated;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
    
}
*/


// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/BookingResponse.java
// FULL REPLACEMENT — no Lombok, all fields including urgent
// ============================================================

package com.quickserve.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private Long customerId;
    private String customerName;
    private Long providerId;
    private String providerName;
    private String providerCity;
    private String service;
    private LocalDate date;
    private String timeSlot;
    private String address;
    private String problem;
    private Double amount;
    private Double finalAmount;
    private String workDescription;
    private String receiptItems;
    private String aiEstimateRange;
    private Boolean outsideEstimate;
    private Boolean isUrgent;
    private Double urgentFee;
    private LocalDateTime expiresAt;
    private String cancelReason;
    private String status;
    private boolean rated;
    private LocalDateTime createdAt;

    public BookingResponse() {}

    // ── Getters & Setters ─────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getProviderCity() { return providerCity; }
    public void setProviderCity(String providerCity) { this.providerCity = providerCity; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isRated() { return rated; }
    public void setRated(boolean rated) { this.rated = rated; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}