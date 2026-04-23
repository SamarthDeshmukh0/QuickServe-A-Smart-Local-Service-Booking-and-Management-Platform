// ============================================================
// FILE: src/main/java/com/quickserve/service/SlotService.java
// ============================================================

package com.quickserve.service;

import com.quickserve.dto.request.SlotRequest;
import com.quickserve.dto.response.SlotResponse;
import com.quickserve.model.ProviderSlot;
import com.quickserve.repository.ProviderSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
//@RequiredArgsConstructor
public class SlotService {

    private final ProviderSlotRepository slotRepository;
    
    public SlotService(ProviderSlotRepository slotRepository) {
        this.slotRepository = slotRepository;
    }

    // ─── Get available slots ─────────────────────────────────
    public List<SlotResponse> getAvailableSlots(Long providerId, LocalDate date) {
        return slotRepository.findByProviderIdAndSlotDateAndIsBooked(providerId, date, false)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ─── Get all slots for a provider ───────────────────────
    public List<SlotResponse> getProviderSlots(Long providerId) {
        return slotRepository.findByProviderId(providerId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ─── Create / update availability ───────────────────────
    @Transactional
    public List<SlotResponse> createSlots(SlotRequest req) {
        LocalDate date = req.getSlotDate();
        Long providerId = req.getProviderId();

        // Remove non-booked slots for this date (re-set availability)
        List<ProviderSlot> existing = slotRepository.findByProviderIdAndSlotDate(providerId, date);
        existing.stream()
                .filter(s -> !Boolean.TRUE.equals(s.getIsBooked()))
                .forEach(slotRepository::delete);

        // Create new slots from request
        List<ProviderSlot> newSlots = req.getSlotTimes().stream()
                .filter(time -> existing.stream().noneMatch(s ->
                        s.getSlotTime().equals(time) && Boolean.TRUE.equals(s.getIsBooked())))
                .map(time -> {
                    ProviderSlot slot = new ProviderSlot();
                    slot.setProviderId(providerId);
                    slot.setSlotDate(date);
                    slot.setSlotTime(time);
                    slot.setIsBooked(false);
                    return slot;
                })
                .collect(Collectors.toList());

        slotRepository.saveAll(newSlots);
        return getProviderSlots(providerId);
    }

    // ─── Delete a slot ───────────────────────────────────────
    public void deleteSlot(Long slotId) {
        ProviderSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        if (Boolean.TRUE.equals(slot.getIsBooked())) {
            throw new RuntimeException("Cannot delete a booked slot");
        }
        slotRepository.delete(slot);
    }

    private SlotResponse toResponse(ProviderSlot s) {
    	SlotResponse res = new SlotResponse();

    	res.setId(s.getId());
    	res.setProviderId(s.getProviderId());
    	res.setSlotDate(s.getSlotDate());
    	res.setSlotTime(s.getSlotTime());
    	res.setIsBooked(s.getIsBooked());
    	res.setBookingId(s.getBookingId());

    	return res;
    }
}