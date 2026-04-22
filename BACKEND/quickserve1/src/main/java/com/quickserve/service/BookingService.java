//// ============================================================
//// FILE: src/main/java/com/quickserve/service/BookingService.java
//// ============================================================
//
//package com.quickserve.service;
//
//import com.quickserve.dto.request.BookingRequest;
//import com.quickserve.dto.request.CompleteBookingRequest;
//import com.quickserve.dto.request.UrgentBookingRequest;
//import com.quickserve.dto.response.BookingResponse;
//import com.quickserve.model.Booking;
//import com.quickserve.model.Provider;
//import com.quickserve.model.ProviderSlot;
//import com.quickserve.model.User;
//import com.quickserve.repository.*;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
////@RequiredArgsConstructor
//public class BookingService {
//
//    private final BookingRepository bookingRepository;
//    private final UserRepository userRepository;
//    private final ProviderRepository providerRepository;
//    private final ProviderSlotRepository slotRepository;
//    private final RatingRepository ratingRepository;
//    //Urgent booking surcharge in INR
//    private static final double URGENT_FEE = 99.0;
//
//    //How long an urgent booking stays open before expiry
//    private static final int URGENT_EXPIRY_MINUTES = 30;
//    
//    public BookingService(BookingRepository bookingRepository,
//            UserRepository userRepository,
//            ProviderRepository providerRepository,
//            ProviderSlotRepository slotRepository,
//		    RatingRepository ratingRepository) {
//		this.bookingRepository = bookingRepository;
//		this.userRepository = userRepository;
//		this.providerRepository = providerRepository;
//		this.slotRepository = slotRepository;
//		this.ratingRepository = ratingRepository;
//}
//
//    // ─── Create Booking ──────────────────────────────────────
////    @Transactional
////    public BookingResponse createBooking(BookingRequest req) {
////        // Mark slot as booked
////        slotRepository.findByProviderIdAndSlotDateAndSlotTime(
////                req.getProviderId(), req.getDate(), req.getTimeSlot()
////        ).ifPresent(slot -> {
////            if (Boolean.TRUE.equals(slot.getIsBooked())) {
////                throw new RuntimeException("This slot is already booked");
////            }
////        });
////
////        Booking booking = new Booking();
////        booking.setCustomerId(req.getCustomerId());
////        booking.setProviderId(req.getProviderId());
////        booking.setService(req.getService());
////        booking.setDate(req.getDate());
////        booking.setTimeSlot(req.getTimeSlot());
////        booking.setAddress(req.getAddress());
////        booking.setProblem(req.getProblem());
////        booking.setAmount(req.getAmount());
////        booking.setIsUrgent(false);
////        booking.setUrgentFee(0.0);
////        booking.setStatus(Booking.Status.BOOKED);
////        
////        Booking savedBooking = bookingRepository.save(booking);
////
////        // Lock the slot
////        slotRepository.findByProviderIdAndSlotDateAndSlotTime(
////                req.getProviderId(), req.getDate(), req.getTimeSlot()
////        ).ifPresent(slot -> {
////            slot.setIsBooked(true);
////            slot.setBookingId(savedBooking.getId());
////            slotRepository.save(slot);
////        });
////
////        return toResponse(booking);
////    }
//    
//    
//    //trialll
//    @Transactional
//    public BookingResponse createBooking(BookingRequest req) {
//        slotRepository.findByProviderIdAndSlotDateAndSlotTime(
//                req.getProviderId(), req.getDate(), req.getTimeSlot()
//        ).ifPresent(slot -> {
//            if (Boolean.TRUE.equals(slot.getIsBooked()))
//                throw new RuntimeException("This slot is already booked");
//        });
//
//        Booking booking = new Booking();
//        booking.setCustomerId(req.getCustomerId());
//        booking.setProviderId(req.getProviderId());   // always set for normal bookings
//        booking.setService(req.getService());
//        booking.setDate(req.getDate());
//        booking.setTimeSlot(req.getTimeSlot());
//        booking.setAddress(req.getAddress());
//        booking.setProblem(req.getProblem());
//        booking.setAmount(req.getAmount());
//        booking.setIsUrgent(false);
//        booking.setUrgentFee(0.0);
//        booking.setOutsideEstimate(false);
//        booking.setStatus(Booking.Status.BOOKED);
//
//        Booking saved = bookingRepository.save(booking);
//
//        final Long bookingId = saved.getId();
//        slotRepository.findByProviderIdAndSlotDateAndSlotTime(
//                req.getProviderId(), req.getDate(), req.getTimeSlot()
//        ).ifPresent(slot -> {
//            slot.setIsBooked(true);
//            slot.setBookingId(bookingId);
//            slotRepository.save(slot);
//        });
//
//        return toResponse(saved);
//    }
//    
//    // ── Create urgent booking (NEW) ───────────────────────────
//    // No provider assigned yet — status BOOKED — visible to ALL providers
//    // in the same city. First provider to accept wins.
//    @Transactional
//    public BookingResponse createUrgentBooking(UrgentBookingRequest req) {
//        Booking booking = new Booking();
//            booking.setCustomerId(req.getCustomerId());
//            booking.setProviderId(null);               // no provider yet — first-accept wins
//            booking.setService(req.getService());
//            booking.setDate(LocalDate.now());          // today — ASAP
//            booking.setTimeSlot("ASAP");
//            booking.setAddress(req.getAddress());
//            booking.setProblem(req.getProblem());
//            booking.setAmount(req.getAmount());
//            booking.setIsUrgent(true);
//            booking.setUrgentFee(URGENT_FEE);
//            booking.setExpiresAt(LocalDateTime.now().plusMinutes(URGENT_EXPIRY_MINUTES));
//            booking.setOutsideEstimate(false);
//            booking.setStatus(Booking.Status.BOOKED);
//                
//
//        return toResponse(bookingRepository.save(booking));
//    }
//    
//    // ── Accept urgent booking (NEW) ───────────────────────────
//    // Uses optimistic locking via DB constraint — first provider to call
//    // this method sets the providerId and status.
//    // Subsequent calls fail because status is no longer BOOKED.
//    @Transactional
//    public BookingResponse acceptUrgentBooking(Long bookingId, Long providerId) {
//        Booking booking = bookingRepository.findById(bookingId)
//                .orElseThrow(() -> new RuntimeException("Booking not found"));
//
//        // Check it's still open — another provider may have accepted already
//        if (booking.getStatus() != Booking.Status.BOOKED) {
//            throw new RuntimeException("This urgent job has already been taken");
//        }
//
//        if (!Boolean.TRUE.equals(booking.getIsUrgent())) {
//            throw new RuntimeException("This is not an urgent booking. Use the normal accept endpoint.");
//        }
//
//        // Check not expired
//        if (booking.getExpiresAt() != null &&
//            LocalDateTime.now().isAfter(booking.getExpiresAt())) {
//            throw new RuntimeException("This urgent booking has expired");
//        }
//
//        // Assign this provider and accept
//        booking.setProviderId(providerId);
//        booking.setStatus(Booking.Status.ACCEPTED);
//        bookingRepository.save(booking);
//        return toResponse(booking);
//    }
//
//    // ── Get urgent jobs visible to a provider ─────────────────
//    // Returns all open urgent bookings regardless of service type
//    // (providers see all urgent jobs in their city)
//    public List<BookingResponse> getOpenUrgentBookings() {
//        return bookingRepository.findAllOpenUrgentBookings()
//                .stream()
//                .filter(b -> b.getExpiresAt() == null ||
//                             LocalDateTime.now().isBefore(b.getExpiresAt()))
//                .map(this::toResponse)
//                .collect(Collectors.toList());
//    }
//
//    // ─── Get customer bookings ───────────────────────────────
//    public List<BookingResponse> getCustomerBookings(Long customerId) {
//        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
//                .stream().map(this::toResponse).collect(Collectors.toList());
//    }
//
//    // ─── Get provider bookings ───────────────────────────────
//    public List<BookingResponse> getProviderBookings(Long providerId) {
//        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(providerId)
//                .stream().map(this::toResponse).collect(Collectors.toList());
//    }
//
//    // ─── Get by ID ───────────────────────────────────────────
//    public BookingResponse getBookingById(Long id) {
//        return toResponse(bookingRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Booking not found")));
//    }
//
//    // ─── Accept booking ──────────────────────────────────────
//    public BookingResponse acceptBooking(Long id) {
//        return updateStatus(id, Booking.Status.ACCEPTED);
//    }
//
//    // ─── Reject booking ──────────────────────────────────────
//    @Transactional
//    public BookingResponse rejectBooking(Long id) {
//        releaseSlot(id);
//        return updateStatus(id, Booking.Status.CANCELLED);
//    }
//
//    // ─── Start booking ───────────────────────────────────────
//    public BookingResponse startBooking(Long id) {
//        return updateStatus(id, Booking.Status.IN_PROGRESS);
//    }
//
//    // ─── Complete booking ────────────────────────────────────
////    public BookingResponse completeBooking(Long id) {
////        return updateStatus(id, Booking.Status.COMPLETED);
////    }
//    
//    @Transactional
//    public BookingResponse completeBooking(Long id, CompleteBookingRequest req) {
//        Booking booking = bookingRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Booking not found"));
//
//        if (booking.getStatus() != Booking.Status.IN_PROGRESS) {
//            throw new RuntimeException("Job must be IN_PROGRESS to mark as complete");
//        }
//
//        // Save provider-set final price and receipt details
//        booking.setFinalAmount(req.getFinalAmount());
//        booking.setWorkDescription(req.getWorkDescription());
//        booking.setReceiptItems(req.getReceiptItems());
//        booking.setAiEstimateRange(req.getAiEstimateRange());
//
//        // Check if final price is outside the AI estimate range (soft limit)
//        boolean outside = false;
//        if (req.getAiEstimateRange() != null && !req.getAiEstimateRange().isBlank()) {
//            try {
//                String[] parts = req.getAiEstimateRange().split("-");
//                double minEst = Double.parseDouble(parts[0].trim());
//                double maxEst = Double.parseDouble(parts[1].trim());
//                outside = req.getFinalAmount() < minEst || req.getFinalAmount() > maxEst;
//            } catch (Exception ignored) {
//                // Malformed range string — skip the check
//            }
//        }
//        booking.setOutsideEstimate(outside);
//        booking.setStatus(Booking.Status.COMPLETED);
//        bookingRepository.save(booking);
//
//        return toResponse(booking);
//    }
//    
//    // ─── Cancel booking ──────────────────────────────────────
//    @Transactional
//    public BookingResponse cancelBooking(Long id) {
//        releaseSlot(id);
//        return updateStatus(id, Booking.Status.CANCELLED);
//    }
//
//    // ─── Mark as paid (called from PaymentService) ───────────
//    public void markAsPaid(Long id) {
//        updateStatus(id, Booking.Status.PAID);
//    }
//
//    // ─── Helpers ─────────────────────────────────────────────
//    private BookingResponse updateStatus(Long id, Booking.Status newStatus) {
//        Booking booking = bookingRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Booking not found"));
//        booking.setStatus(newStatus);
//        bookingRepository.save(booking);
//        return toResponse(booking);
//    }
//
//    private void releaseSlot(Long bookingId) {
//        slotRepository.findByBookingId(bookingId).ifPresent(slot -> {
//            slot.setIsBooked(false);
//            slot.setBookingId(null);
//            slotRepository.save(slot);
//        });
//    }
//
//    private BookingResponse toResponse(Booking b) {
//        String customerName = userRepository.findById(b.getCustomerId())
//                .map(User::getName).orElse("Unknown");
//        Provider provider = providerRepository.findById(b.getProviderId()).orElse(null);
//        boolean rated = ratingRepository.existsByBookingId(b.getId());
//
//        BookingResponse res = new BookingResponse();
//
//        res.setId(b.getId());
//        res.setCustomerId(b.getCustomerId());
//        res.setCustomerName(customerName);
//        res.setProviderId(b.getProviderId());
//        res.setProviderName(provider != null ? provider.getName() : "Unknown");
//        res.setProviderCity(provider != null ? provider.getCity() : "");
//        res.setService(b.getService());
//        res.setDate(b.getDate());
//        res.setTimeSlot(b.getTimeSlot());
//        res.setAddress(b.getAddress());
//        res.setProblem(b.getProblem());
//        res.setAmount(b.getAmount());
//        //for the smart price
//        res.setFinalAmount(b.getFinalAmount());
//        res.setWorkDescription(b.getWorkDescription());
//        res.setReceiptItems(b.getReceiptItems());
//        res.setAiEstimateRange(b.getAiEstimateRange());
//        res.setOutsideEstimate(b.getOutsideEstimate());
//        
//        res.setStatus(b.getStatus().name());
//        res.setRated(rated);
//        res.setCreatedAt(b.getCreatedAt());
//
//        return res;
//    }
//}









// ============================================================
// FILE: src/main/java/com/quickserve/service/BookingService.java
// FULL REPLACEMENT — no Lombok, all features included  doing this because for the urgent booking
// ============================================================

package com.quickserve.service;

import com.quickserve.dto.request.BookingRequest;
import com.quickserve.dto.request.CompleteBookingRequest;
import com.quickserve.dto.request.UrgentBookingRequest;
import com.quickserve.dto.response.BookingResponse;
import com.quickserve.model.Booking;
import com.quickserve.model.Provider;
import com.quickserve.model.User;
import com.quickserve.repository.BookingRepository;
import com.quickserve.repository.ProviderRepository;
import com.quickserve.repository.ProviderSlotRepository;
import com.quickserve.repository.RatingRepository;
import com.quickserve.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository      bookingRepository;
    private final UserRepository         userRepository;
    private final ProviderRepository     providerRepository;
    private final ProviderSlotRepository slotRepository;
    private final RatingRepository       ratingRepository;

    private static final double URGENT_FEE            = 99.0;
    private static final int    URGENT_EXPIRY_MINUTES = 30;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          ProviderRepository providerRepository,
                          ProviderSlotRepository slotRepository,
                          RatingRepository ratingRepository) {
        this.bookingRepository  = bookingRepository;
        this.userRepository     = userRepository;
        this.providerRepository = providerRepository;
        this.slotRepository     = slotRepository;
        this.ratingRepository   = ratingRepository;
    }

    // ── Create normal booking ─────────────────────────────────
    @Transactional
    public BookingResponse createBooking(BookingRequest req) {
        slotRepository.findByProviderIdAndSlotDateAndSlotTime(
                req.getProviderId(), req.getDate(), req.getTimeSlot()
        ).ifPresent(slot -> {
            if (Boolean.TRUE.equals(slot.getIsBooked()))
                throw new RuntimeException("This slot is already booked");
        });

        Booking booking = new Booking();
        booking.setCustomerId(req.getCustomerId());
        booking.setProviderId(req.getProviderId());
        booking.setService(req.getService());
        booking.setDate(req.getDate());
        booking.setTimeSlot(req.getTimeSlot());
        booking.setAddress(req.getAddress());
        booking.setProblem(req.getProblem());
        booking.setAmount(req.getAmount());
        booking.setIsUrgent(false);
        booking.setUrgentFee(0.0);
        booking.setOutsideEstimate(false);
        booking.setStatus(Booking.Status.BOOKED);

        Booking saved = bookingRepository.save(booking);
        final Long bookingId = saved.getId();

        slotRepository.findByProviderIdAndSlotDateAndSlotTime(
                req.getProviderId(), req.getDate(), req.getTimeSlot()
        ).ifPresent(slot -> {
            slot.setIsBooked(true);
            slot.setBookingId(bookingId);
            slotRepository.save(slot);
        });

        return toResponse(saved);
    }

    // ── Create urgent booking ─────────────────────────────────
    @Transactional
    public BookingResponse createUrgentBooking(UrgentBookingRequest req) {
        Booking booking = new Booking();
        booking.setCustomerId(req.getCustomerId());
        booking.setProviderId(null);
        booking.setService(req.getService());
        booking.setDate(LocalDate.now());
        booking.setTimeSlot("ASAP");
        booking.setAddress(req.getAddress());
        booking.setProblem(req.getProblem());
        booking.setAmount(req.getAmount());
        booking.setIsUrgent(true);
        booking.setUrgentFee(URGENT_FEE);
        booking.setExpiresAt(LocalDateTime.now().plusMinutes(URGENT_EXPIRY_MINUTES));
        booking.setOutsideEstimate(false);
        booking.setStatus(Booking.Status.BOOKED);

        return toResponse(bookingRepository.save(booking));
    }

    // ── Accept urgent booking — first-accept-wins ─────────────
    @Transactional
    public BookingResponse acceptUrgentBooking(Long bookingId, Long providerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != Booking.Status.BOOKED)
            throw new RuntimeException("This urgent job has already been taken");

        if (!Boolean.TRUE.equals(booking.getIsUrgent()))
            throw new RuntimeException("Not an urgent booking");

        if (booking.getExpiresAt() != null &&
            LocalDateTime.now().isAfter(booking.getExpiresAt()))
            throw new RuntimeException("This urgent booking has expired");

        booking.setProviderId(providerId);
        booking.setStatus(Booking.Status.ACCEPTED);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    // ── Get all open urgent bookings ──────────────────────────
    public List<BookingResponse> getOpenUrgentBookings() {
        return bookingRepository.findAllOpenUrgentBookings()
                .stream()
                .filter(b -> b.getExpiresAt() == null ||
                             LocalDateTime.now().isBefore(b.getExpiresAt()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── Get customer bookings ─────────────────────────────────
    public List<BookingResponse> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Get provider bookings ─────────────────────────────────
    public List<BookingResponse> getProviderBookings(Long providerId) {
        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(providerId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Get by ID ─────────────────────────────────────────────
    public BookingResponse getBookingById(Long id) {
        return toResponse(bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found")));
    }

    // ── Accept normal booking ─────────────────────────────────
    public BookingResponse acceptBooking(Long id) {
        return updateStatus(id, Booking.Status.ACCEPTED);
    }

    // ── Reject booking ────────────────────────────────────────
    @Transactional
    public BookingResponse rejectBooking(Long id) {
        releaseSlot(id);
        return updateStatus(id, Booking.Status.CANCELLED);
    }

    // ── Start work ────────────────────────────────────────────
    public BookingResponse startBooking(Long id) {
        return updateStatus(id, Booking.Status.IN_PROGRESS);
    }

    // ── Complete with receipt ─────────────────────────────────
    @Transactional
    public BookingResponse completeBooking(Long id, CompleteBookingRequest req) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != Booking.Status.IN_PROGRESS)
            throw new RuntimeException("Job must be IN_PROGRESS to complete");

        booking.setFinalAmount(req.getFinalAmount());
        booking.setWorkDescription(req.getWorkDescription());
        booking.setReceiptItems(req.getReceiptItems());
        booking.setAiEstimateRange(req.getAiEstimateRange());

        boolean outside = false;
        if (req.getAiEstimateRange() != null && !req.getAiEstimateRange().isBlank()) {
            try {
                String[] parts = req.getAiEstimateRange().split("-");
                double min = Double.parseDouble(parts[0].trim());
                double max = Double.parseDouble(parts[1].trim());
                outside = req.getFinalAmount() < min || req.getFinalAmount() > max;
            } catch (Exception ignored) { }
        }
        booking.setOutsideEstimate(outside);
        booking.setStatus(Booking.Status.COMPLETED);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    // ── Cancel ────────────────────────────────────────────────
    @Transactional
    public BookingResponse cancelBooking(Long id) {
        releaseSlot(id);
        return updateStatus(id, Booking.Status.CANCELLED);
    }

    // ── Mark as paid ──────────────────────────────────────────
    public void markAsPaid(Long id) {
        updateStatus(id, Booking.Status.PAID);
    }

    // ── Private helpers ───────────────────────────────────────
    private BookingResponse updateStatus(Long id, Booking.Status newStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(newStatus);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    private void releaseSlot(Long bookingId) {
        slotRepository.findByBookingId(bookingId).ifPresent(slot -> {
            slot.setIsBooked(false);
            slot.setBookingId(null);
            slotRepository.save(slot);
        });
    }

    public BookingResponse toResponse(Booking b) {
        String customerName = userRepository.findById(b.getCustomerId())
                .map(User::getName).orElse("Unknown");

        Provider provider = b.getProviderId() != null
                ? providerRepository.findById(b.getProviderId()).orElse(null)
                : null;

        boolean rated = ratingRepository.existsByBookingId(b.getId());

        BookingResponse res = new BookingResponse();
        res.setId(b.getId());
        res.setCustomerId(b.getCustomerId());
        res.setCustomerName(customerName);
        res.setProviderId(b.getProviderId());
        res.setProviderName(provider != null ? provider.getName() : "—");
        res.setProviderCity(provider != null ? provider.getCity() : "");
        res.setService(b.getService());
        res.setDate(b.getDate());
        res.setTimeSlot(b.getTimeSlot());
        res.setAddress(b.getAddress());
        res.setProblem(b.getProblem());
        res.setAmount(b.getAmount());
        res.setFinalAmount(b.getFinalAmount());
        res.setWorkDescription(b.getWorkDescription());
        res.setReceiptItems(b.getReceiptItems());
        res.setAiEstimateRange(b.getAiEstimateRange());
        res.setOutsideEstimate(b.getOutsideEstimate());
        res.setIsUrgent(b.getIsUrgent());
        res.setUrgentFee(b.getUrgentFee());
        res.setExpiresAt(b.getExpiresAt());
        res.setCancelReason(b.getCancelReason());
        res.setStatus(b.getStatus().name());
        res.setRated(rated);
        res.setCreatedAt(b.getCreatedAt());
        return res;
    }
}