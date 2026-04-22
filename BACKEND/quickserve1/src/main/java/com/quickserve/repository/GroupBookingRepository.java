// ============================================================
// FILE: src/main/java/com/quickserve/repository/GroupBookingRepository.java
// NEW FILE
// ============================================================

package com.quickserve.repository;

import com.quickserve.model.GroupBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GroupBookingRepository extends JpaRepository<GroupBooking, Long> {

    // All group bookings for a customer
    List<GroupBooking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    // Fetch by shared group UUID
    Optional<GroupBooking> findByGroupId(String groupId);

    // Check if all sub-bookings under a groupId are completed
    // Used to auto-update GroupBooking status to COMPLETED
    @Query("SELECT COUNT(b) FROM Booking b " +
           "WHERE b.groupBookingId = :groupId " +
           "AND b.status NOT IN ('COMPLETED', 'PAID', 'CANCELLED')")
    long countActiveSubBookings(@Param("groupId") String groupId);
}