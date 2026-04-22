// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/RatingResponse.java
// ============================================================

package com.quickserve.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class RatingResponse {
    private Long id;
    private Long bookingId;
    private Long customerId;
    private String customerName;
    private Long providerId;
    private Integer stars;
    private String review;
    private LocalDateTime createdAt;
    
    public RatingResponse() {}
	public RatingResponse(Long id, Long bookingId, Long customerId, String customerName, Long providerId, Integer stars,
			String review, LocalDateTime createdAt) {
		super();
		this.id = id;
		this.bookingId = bookingId;
		this.customerId = customerId;
		this.customerName = customerName;
		this.providerId = providerId;
		this.stars = stars;
		this.review = review;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getBookingId() {
		return bookingId;
	}

	public void setBookingId(Long bookingId) {
		this.bookingId = bookingId;
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

	public Integer getStars() {
		return stars;
	}

	public void setStars(Integer stars) {
		this.stars = stars;
	}

	public String getReview() {
		return review;
	}

	public void setReview(String review) {
		this.review = review;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
    
}