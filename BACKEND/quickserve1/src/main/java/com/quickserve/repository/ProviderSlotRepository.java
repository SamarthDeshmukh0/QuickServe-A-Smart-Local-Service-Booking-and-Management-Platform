// ============================================================
// FILE: src/main/java/com/quickserve/repository/ProviderSlotRepository.java
// ============================================================

package com.quickserve.repository;

import com.quickserve.model.ProviderSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderSlotRepository extends JpaRepository<ProviderSlot, Long> {
    List<ProviderSlot> findByProviderIdAndSlotDateAndIsBooked(Long providerId, LocalDate slotDate, Boolean isBooked);
    List<ProviderSlot> findByProviderIdAndSlotDate(Long providerId, LocalDate slotDate);
    List<ProviderSlot> findByProviderId(Long providerId);
    Optional<ProviderSlot> findByProviderIdAndSlotDateAndSlotTime(Long providerId, LocalDate slotDate, String slotTime);
    Optional<ProviderSlot> findByBookingId(Long bookingId);
}