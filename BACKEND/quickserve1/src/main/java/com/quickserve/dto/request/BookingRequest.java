// ============================================================
// FILE: src/main/java/com/quickserve/dto/request/BookingRequest.java
// ============================================================

package com.quickserve.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

//@Data
public class BookingRequest {

    @NotNull
    private Long customerId;

    @NotNull
    private Long providerId;

    @NotBlank
    private String service;

    @NotNull
    @FutureOrPresent
    private LocalDate date;

    @NotBlank
    private String timeSlot;

    @NotBlank
    @Size(min = 10)
    private String address;

    @NotBlank
    @Size(min = 20)
    private String problem;

    @NotNull
    @Positive
    private Double amount;
    
    public BookingRequest() {}
    public BookingRequest(Long customerId, Long providerId, 
    		String service, LocalDate date,
    		String timeSlot, String address,
    		String problem,
    		Double amount) {
    	
    	this.customerId=customerId;
    	this.providerId=providerId;
    	this.service=service;
    	this.date=date;
    	this.timeSlot=timeSlot;
    	this.address=address;
    	this.problem=problem;
    	this.amount=amount;
    }
	public Long getCustomerId() {
		return customerId;
	}
	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}
	public Long getProviderId() {
		return providerId;
	}
	public void setProviderId(Long providerId) {
		this.providerId = providerId;
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
}