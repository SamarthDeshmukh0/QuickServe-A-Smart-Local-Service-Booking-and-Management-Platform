// ============================================================
// FILE: src/main/java/com/quickserve/dto/request/CompleteBookingRequest.java
// NEW FILE — request body when provider marks job as complete
// ============================================================

package com.quickserve.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

//@Data
public class CompleteBookingRequest {

    @NotNull(message = "Final amount is required")
    @Positive(message = "Final amount must be greater than zero")
    private Double finalAmount;

    // What the provider fixed — mandatory
    @NotBlank(message = "Work description is required")
    @Size(min = 10, max = 2000, message = "Work description must be 10-2000 characters")
    private String workDescription;

    // Itemised list of parts/materials used — optional but encouraged
    // Front-end sends as plain text: "10ft PVC pipe ₹200\nLabour ₹350"
    @Size(max = 3000)
    private String receiptItems;

    // AI estimate range for soft-limit check — front-end sends as "minPrice-maxPrice"
    // Example: "650-950"
    private String aiEstimateRange;
    
    
    //constructors..
	public CompleteBookingRequest(
			@NotNull(message = "Final amount is required") @Positive(message = "Final amount must be greater than zero") Double finalAmount,
			@NotBlank(message = "Work description is required") @Size(min = 10, max = 2000, message = "Work description must be 10-2000 characters") String workDescription,
			@Size(max = 3000) String receiptItems, String aiEstimateRange) {
		super();
		this.finalAmount = finalAmount;
		this.workDescription = workDescription;
		this.receiptItems = receiptItems;
		this.aiEstimateRange = aiEstimateRange;
	}

	//getters-setters..
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
	

}