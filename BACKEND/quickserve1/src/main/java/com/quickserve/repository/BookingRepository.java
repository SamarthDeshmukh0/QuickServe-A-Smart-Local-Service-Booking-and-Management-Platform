//for grp bking
// ============================================================
// FILE: src/main/java/com/quickserve/repository/BookingRepository.java
// FULL REPLACEMENT — adds group_booking_id queries
// ============================================================

package com.quickserve.repository;

import com.quickserve.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Booking> findByProviderIdOrderByCreatedAtDesc(Long providerId);
    List<Booking> findByStatus(Booking.Status status);
    long countByDate(LocalDate date);
    long countByStatus(Booking.Status status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.date = :date AND b.status != 'CANCELLED'")
    long countTodayBookings(@Param("date") LocalDate date);

    @Query("SELECT b.service, COUNT(b) FROM Booking b GROUP BY b.service ORDER BY COUNT(b) DESC")
    List<Object[]> countByServiceGrouped();

    @Query("SELECT FUNCTION('MONTH', b.date), FUNCTION('YEAR', b.date), SUM(b.amount) " +
           "FROM Booking b WHERE b.status = 'PAID' " +
           "GROUP BY FUNCTION('YEAR', b.date), FUNCTION('MONTH', b.date) " +
           "ORDER BY FUNCTION('YEAR', b.date), FUNCTION('MONTH', b.date)")
    List<Object[]> getMonthlyRevenue();

    @Query("SELECT b.service FROM Booking b WHERE b.providerId = :providerId GROUP BY b.service")
    List<String> findServicesByProvider(@Param("providerId") Long providerId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = 'SUCCESS'")
    Double getTotalRevenue();

    @Query("SELECT b FROM Booking b WHERE b.status IN ('BOOKED', 'ACCEPTED', 'IN_PROGRESS')")
    List<Booking> findActiveBookings();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.providerId = :pid AND b.status IN ('COMPLETED', 'PAID')")
    long countCompletedByProvider(@Param("pid") Long providerId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.providerId = :pid AND b.status = 'CANCELLED'")
    long countCancelledByProvider(@Param("pid") Long pid);
    
 // Required for the heatmap — groups bookings by day of week and time slot
    @Query("SELECT FUNCTION('DAYOFWEEK', b.date) AS dayOfWeek, " +
           "b.timeSlot AS slot, " +
           "COUNT(b.id) AS bookingCount " +
           "FROM Booking b " +
           "WHERE b.status <> 'CANCELLED' " +
           "GROUP BY FUNCTION('DAYOFWEEK', b.date), b.timeSlot " +
           "ORDER BY FUNCTION('DAYOFWEEK', b.date), b.timeSlot")
    List<Object[]> getBookingHeatmap();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.providerId = :pid AND b.status = :status")
    long countByProviderIdAndStatus(@Param("pid") Long providerId,
                                    @Param("status") Booking.Status status);

    // ── NEW: Fetch all sub-bookings that belong to a group ────
    List<Booking> findByGroupBookingIdOrderByCreatedAtAsc(String groupBookingId);

    // ── Urgent booking queries ────────────────────────────────
    @Query("SELECT b FROM Booking b WHERE b.isUrgent = true " +
           "AND b.status = 'BOOKED' ORDER BY b.createdAt DESC")
    List<Booking> findAllOpenUrgentBookings();

    @Query("SELECT b FROM Booking b WHERE b.isUrgent = true " +
           "AND b.status = 'BOOKED' " +
           "AND b.expiresAt IS NOT NULL AND b.expiresAt < :now")
    List<Booking> findExpiredUrgentBookings(@Param("now") LocalDateTime now);
    
    //last queries are from gpt and done for to hide the error of the AdminService.java
    	@Query("SELECT b FROM Booking b WHERE b.isUrgent = true " +
    		       "AND b.status = 'BOOKED' " +
    		       "AND b.service = :service " +
    		       "AND b.address LIKE %:city% " +
    		       "ORDER BY b.createdAt DESC")
    		List<Booking> findOpenUrgentBookingsByCityAndService(
    		        @Param("city") String city,
    		        @Param("service") String service);
}












//mid old which is workiing
// ============================================================
// FILE: src/main/java/com/quickserve/repository/BookingRepository.java
// ============================================================

//package com.quickserve.repository;
//
//import com.quickserve.model.Booking;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Repository
//public interface BookingRepository extends JpaRepository<Booking, Long> {
//    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
//    List<Booking> findByProviderIdOrderByCreatedAtDesc(Long providerId);
//    List<Booking> findByStatus(Booking.Status status);

//    long countByDate(LocalDate date);
//    long countByStatus(Booking.Status status);
//    
//    long countByProviderIdAndStatus(Long providerId, Booking.Status status);
//
//
//    @Query("SELECT COUNT(b) FROM Booking b WHERE b.date = :date AND b.status != 'CANCELLED'")
//    long countTodayBookings(@Param("date") LocalDate date);
//
//    @Query("SELECT b.service, COUNT(b) FROM Booking b GROUP BY b.service ORDER BY COUNT(b) DESC")
//    List<Object[]> countByServiceGrouped();
//
//    @Query("SELECT FUNCTION('MONTH', b.date), FUNCTION('YEAR', b.date), SUM(b.amount) FROM Booking b WHERE b.status = 'PAID' GROUP BY FUNCTION('YEAR', b.date), FUNCTION('MONTH', b.date) ORDER BY FUNCTION('YEAR', b.date), FUNCTION('MONTH', b.date)")
//    List<Object[]> getMonthlyRevenue();
//
//    @Query("SELECT b.service FROM Booking b WHERE b.providerId = :providerId GROUP BY b.service")
//    List<String> findServicesByProvider(@Param("providerId") Long providerId);
//
//    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = 'SUCCESS'")
//    Double getTotalRevenue();
//
//    @Query("SELECT b FROM Booking b WHERE b.status IN ('BOOKED', 'ACCEPTED', 'IN_PROGRESS')")
//    List<Booking> findActiveBookings();
//
//    @Query("SELECT COUNT(b) FROM Booking b WHERE b.providerId = :pid AND b.status IN ('COMPLETED', 'PAID')")
//    long countCompletedByProvider(@Param("pid") Long providerId);
//
//    @Query("SELECT COUNT(b) FROM Booking b WHERE b.providerId = :pid AND b.status = 'CANCELLED'")
//    long countCancelledByProvider(@Param("pid") Long providerId);
//    
//    @Query("""
//    	    SELECT
//    	        FUNCTION('DAYOFWEEK', b.date) AS dayOfWeek,
//    	        b.timeSlot                    AS slot,
//    	        COUNT(b.id)                   AS bookingCount
//    	    FROM Booking b
//    	    WHERE b.status <> 'CANCELLED'
//    	    GROUP BY FUNCTION('DAYOFWEEK', b.date), b.timeSlot
//    	    ORDER BY FUNCTION('DAYOFWEEK', b.date), b.timeSlot
//    	    """)
//    	List<Object[]> getBookingHeatmap();
//    	
//    	// ── NEW: Find all URGENT open bookings in a city and service ──
//        // Used by provider jobs page to populate the Urgent tab
//        @Query("SELECT b FROM Booking b WHERE b.isUrgent = true " +
//               "AND b.status = 'BOOKED' " +
//               "AND b.service = :service " +
//               "AND b.address LIKE %:city% " +
//               "ORDER BY b.createdAt DESC")
//        List<Booking> findOpenUrgentBookingsByCityAndService(
//                @Param("city") String city,
//                @Param("service") String service);
//
//        // ── NEW: Find ALL open urgent bookings in a city (any service) ──
//        // Providers see all urgent jobs in their city regardless of service
//        @Query("SELECT b FROM Booking b WHERE b.isUrgent = true " +
//               "AND b.status = 'BOOKED' " +
//               "ORDER BY b.createdAt DESC")
//        List<Booking> findAllOpenUrgentBookings();
//
//        // ── NEW: Find expired urgent bookings that haven't been cancelled yet ──
//        // Called by @Scheduled job every 60 seconds
//        @Query("SELECT b FROM Booking b WHERE b.isUrgent = true " +
//               "AND b.status = 'BOOKED' " +
//               "AND b.expiresAt IS NOT NULL " +
//               "AND b.expiresAt < :now")
//        List<Booking> findExpiredUrgentBookings(@Param("now") LocalDateTime now);
//    
//}


//more old version->
// ============================================================
// FILE: src/main/java/com/quickserve/repository/BookingRepository.java
// FULL REPLACEMENT — adds 3 new queries for urgent bookings
// ============================================================

//package com.quickserve.repository;
//
//import com.quickserve.model.Booking;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Repository
//public interface BookingRepository extends JpaRepository<Booking, Long> {
//
//    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
//    List<Booking> findByProviderIdOrderByCreatedAtDesc(Long providerId);
//    List<Booking> findByStatus(Booking.Status status);
//    long countByDate(LocalDate date);
//    long countByStatus(Booking.Status status);
//
//    @Query("SELECT COUNT(b) FROM Booking b WHERE b.date = :date AND b.status != 'CANCELLED'")
//    long countTodayBookings(@Param("date") LocalDate date);
//
//    @Query("SELECT b.service, COUNT(b) FROM Booking b GROUP BY b.service ORDER BY COUNT(b) DESC")
//    List<Object[]> countByServiceGrouped();
//
//    @Query("SELECT FUNCTION('MONTH', b.date), FUNCTION('YEAR', b.date), SUM(b.amount) FROM Booking b WHERE b.status = 'PAID' GROUP BY FUNCTION('YEAR', b.date), FUNCTION('MONTH', b.date) ORDER BY FUNCTION('YEAR', b.date), FUNCTION('MONTH', b.date)")
//    List<Object[]> getMonthlyRevenue();
//
//    @Query("SELECT b.service FROM Booking b WHERE b.providerId = :providerId GROUP BY b.service")
//    List<String> findServicesByProvider(@Param("providerId") Long providerId);
//
//    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = 'SUCCESS'")
//    Double getTotalRevenue();
//
//    @Query("SELECT b FROM Booking b WHERE b.status IN ('BOOKED', 'ACCEPTED', 'IN_PROGRESS')")
//    List<Booking> findActiveBookings();
//
//    @Query("SELECT COUNT(b) FROM Booking b WHERE b.providerId = :pid AND b.status IN ('COMPLETED', 'PAID')")
//    long countCompletedByProvider(@Param("pid") Long providerId);
//
//    @Query("SELECT COUNT(b) FROM Booking b WHERE b.providerId = :pid AND b.status = 'CANCELLED'")
//    long countCancelledByProvider(@Param("pid") Long pid);
//
//    @Query("SELECT COUNT(b) FROM Booking b WHERE b.providerId = :pid AND b.status = :status")
//    long countByProviderIdAndStatus(@Param("pid") Long providerId,
//                                    @Param("status") Booking.Status status);
//
//    // ── NEW: Find all URGENT open bookings in a city and service ──
//    // Used by provider jobs page to populate the Urgent tab
//    @Query("SELECT b FROM Booking b WHERE b.isUrgent = true " +
//           "AND b.status = 'BOOKED' " +
//           "AND b.service = :service " +
//           "AND b.address LIKE %:city% " +
//           "ORDER BY b.createdAt DESC")
//    List<Booking> findOpenUrgentBookingsByCityAndService(
//            @Param("city") String city,
//            @Param("service") String service);
//
//    // ── NEW: Find ALL open urgent bookings in a city (any service) ──
//    // Providers see all urgent jobs in their city regardless of service
//    @Query("SELECT b FROM Booking b WHERE b.isUrgent = true " +
//           "AND b.status = 'BOOKED' " +
//           "ORDER BY b.createdAt DESC")
//    List<Booking> findAllOpenUrgentBookings();
//
//    // ── NEW: Find expired urgent bookings that haven't been cancelled yet ──
//    // Called by @Scheduled job every 60 seconds
//    @Query("SELECT b FROM Booking b WHERE b.isUrgent = true " +
//           "AND b.status = 'BOOKED' " +
//           "AND b.expiresAt IS NOT NULL " +
//           "AND b.expiresAt < :now")
//    List<Booking> findExpiredUrgentBookings(@Param("now") LocalDateTime now);
//}
//
