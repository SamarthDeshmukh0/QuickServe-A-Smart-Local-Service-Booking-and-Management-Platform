// ============================================================
// FILE: src/main/java/com/quickserve/service/UrgentBookingExpiryJob.java
// NEW FILE — @Scheduled job that auto-cancels expired urgent bookings
// ============================================================

package com.quickserve.service;

import com.quickserve.model.Booking;
import com.quickserve.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Runs every 60 seconds.
 * Finds urgent bookings in BOOKED status whose expiresAt has passed
 * and auto-cancels them so the slot frees up and the customer is notified.
 *
 * To enable @Scheduled, add @EnableScheduling to your main application class
 * or to any @Configuration class.
 */
@Component
//@RequiredArgsConstructor
public class UrgentBookingExpiryJob {

    private final BookingRepository bookingRepository;
    

    public UrgentBookingExpiryJob(BookingRepository bookingRepository) {
		super();
		this.bookingRepository = bookingRepository;
	}
    
    //getter/setters
	public BookingRepository getBookingRepository() {
		return bookingRepository;
	}


	@Scheduled(fixedRate = 60_000)   // runs every 60 seconds
    @Transactional
    public void expireUrgentBookings() {
        List<Booking> expired =
                bookingRepository.findExpiredUrgentBookings(LocalDateTime.now());

        if (expired.isEmpty()) return;

        for (Booking booking : expired) {
            booking.setStatus(Booking.Status.CANCELLED);
            booking.setCancelReason(
                "Urgent booking expired — no provider was available " +
                "within 30 minutes. Please try again."
            );
        }

        bookingRepository.saveAll(expired);

        System.out.printf(
            "[UrgentExpiryJob] Auto-cancelled %d expired urgent booking(s)%n",
            expired.size()
        );
    }


}