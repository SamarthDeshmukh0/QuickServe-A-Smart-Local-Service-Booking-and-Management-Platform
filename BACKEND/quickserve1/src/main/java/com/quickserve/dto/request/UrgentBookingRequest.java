// ============================================================
// FILE: src/main/java/com/quickserve/dto/request/UrgentBookingRequest.java
// NEW FILE
// ============================================================


/*
package com.quickserve.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

//@Data
public class UrgentBookingRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    // Service type — e.g. "Plumber", "Electrician"
    @NotBlank(message = "Service is required")
    private String service;

    // Customer's address — where provider should come
    @NotBlank(message = "Address is required")
    @Size(min = 10, message = "Address must be at least 10 characters")
    private String address;

    // Problem description
    @NotBlank(message = "Problem description is required")
    @Size(min = 10, message = "Problem description must be at least 10 characters")
    private String problem;

    // Customer's city — used to find available providers in same city
    @NotBlank(message = "City is required")
    private String city;

    // Base service amount (from SERVICES constants on frontend)
    @NotNull(message = "Amount is required")
    @Positive
    private Double amount;

	public UrgentBookingRequest(@NotNull(message = "Customer ID is required") Long customerId,
			@NotBlank(message = "Service is required") String service,
			@NotBlank(message = "Address is required") @Size(min = 10, message = "Address must be at least 10 characters") String address,
			@NotBlank(message = "Problem description is required") @Size(min = 10, message = "Problem description must be at least 10 characters") String problem,
			@NotBlank(message = "City is required") String city,
			@NotNull(message = "Amount is required") @Positive Double amount) {
		super();
		this.customerId = customerId;
		this.service = service;
		this.address = address;
		this.problem = problem;
		this.city = city;
		this.amount = amount;
	}

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public String getService() {
		return service;
	}

	public void setService(String service) {
		this.service = service;
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

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}
    
    
    
}

*/


// ============================================================
// FILE: src/main/java/com/quickserve/dto/request/UrgentBookingRequest.java
// FULL REPLACEMENT — no Lombok
// ============================================================

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