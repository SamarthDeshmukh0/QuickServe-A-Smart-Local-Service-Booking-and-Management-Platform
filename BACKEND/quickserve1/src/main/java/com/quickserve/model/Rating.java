// ============================================================
// FILE: src/main/java/com/quickserve/model/Rating.java
// ============================================================

package com.quickserve.model;

import jakarta.persistence.*;
//import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false, unique = true)
    private Long bookingId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "provider_id", nullable = false)
    private Long providerId;

    @Column(nullable = false)
    private Integer stars;

    @Column(length = 300)
    private String review;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    
    public Rating() {}
    public Rating(Long id, Long bookingId, Long customerId, Long providerId, Integer stars, String review,
			LocalDateTime createdAt) {
		super();
		this.id = id;
		this.bookingId = bookingId;
		this.customerId = customerId;
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

	@PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}