// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/SlotResponse.java
// ============================================================

package com.quickserve.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

//@Data
//@Builder
public class SlotResponse {
    private Long id;
    private Long providerId;
    private LocalDate slotDate;
    private String slotTime;
    private Boolean isBooked;
    private Long bookingId;
    
    public SlotResponse() {}
	public SlotResponse(Long id, Long providerId, LocalDate slotDate, String slotTime, Boolean isBooked,
			Long bookingId) {
		super();
		this.id = id;
		this.providerId = providerId;
		this.slotDate = slotDate;
		this.slotTime = slotTime;
		this.isBooked = isBooked;
		this.bookingId = bookingId;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getProviderId() {
		return providerId;
	}
	public void setProviderId(Long providerId) {
		this.providerId = providerId;
	}
	public LocalDate getSlotDate() {
		return slotDate;
	}
	public void setSlotDate(LocalDate slotDate) {
		this.slotDate = slotDate;
	}
	public String getSlotTime() {
		return slotTime;
	}
	public void setSlotTime(String slotTime) {
		this.slotTime = slotTime;
	}
	public Boolean getIsBooked() {
		return isBooked;
	}
	public void setIsBooked(Boolean isBooked) {
		this.isBooked = isBooked;
	}
	public Long getBookingId() {
		return bookingId;
	}
	public void setBookingId(Long bookingId) {
		this.bookingId = bookingId;
	}
    
}