// ============================================================
// FILE: src/main/java/com/quickserve/repository/PaymentRepository.java
// ============================================================

package com.quickserve.repository;

import com.quickserve.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingId(Long bookingId);
}