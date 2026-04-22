// ============================================================
// FILE: src/main/java/com/quickserve/dto/request/SlotRequest.java
// ============================================================

package com.quickserve.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class SlotRequest {

    @NotNull
    private Long providerId;

    @NotNull
    private LocalDate slotDate;

    @NotNull
    private List<String> slotTimes;

	public SlotRequest(@NotNull Long providerId, @NotNull LocalDate slotDate, @NotNull List<String> slotTimes) {
		super();
		this.providerId = providerId;
		this.slotDate = slotDate;
		this.slotTimes = slotTimes;
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

	public List<String> getSlotTimes() {
		return slotTimes;
	}

	public void setSlotTimes(List<String> slotTimes) {
		this.slotTimes = slotTimes;
	}
    
    
}