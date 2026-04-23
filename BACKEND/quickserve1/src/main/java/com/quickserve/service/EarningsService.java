// ============================================================
// FILE: src/main/java/com/quickserve/service/EarningsService.java
// ============================================================

package com.quickserve.service;

import com.quickserve.dto.response.EarningsResponse;
import com.quickserve.model.Booking;
import com.quickserve.model.Earnings;
import com.quickserve.model.Payment;
import com.quickserve.model.User;
import com.quickserve.repository.*;
//import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
//@RequiredArgsConstructor
public class EarningsService {

    private final EarningsRepository earningsRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    
    public EarningsService(EarningsRepository earningsRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository,
            PaymentRepository paymentRepository) {
			this.earningsRepository = earningsRepository;
			this.bookingRepository = bookingRepository;
			this.userRepository = userRepository;
			this.paymentRepository = paymentRepository;
			}

    public EarningsResponse getEarnings(Long providerId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay  = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek = now.toLocalDate().with(DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime startOfMonth = now.toLocalDate().withDayOfMonth(1).atStartOfDay();

        Double total     = earningsRepository.sumByProviderId(providerId);
        Double today     = earningsRepository.sumByProviderIdAndDateRange(providerId, startOfDay, now);
        Double thisWeek  = earningsRepository.sumByProviderIdAndDateRange(providerId, startOfWeek, now);
        Double thisMonth = earningsRepository.sumByProviderIdAndDateRange(providerId, startOfMonth, now);

        long completedJobs = bookingRepository.countCompletedByProvider(providerId);
        long cancelledJobs = bookingRepository.countCancelledByProvider(providerId);

        // Monthly earnings chart (last 12 months)
        List<EarningsResponse.MonthlyEarning> monthly = earningsRepository.getMonthlyEarnings(providerId)
                .stream().map(row -> {
                    EarningsResponse.MonthlyEarning me = new EarningsResponse.MonthlyEarning();
                    me.setMonth(
                            Month.of(((Number) row[0]).intValue())
                                    .getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
                    );
                    me.setAmount(row[2] != null ? ((Number) row[2]).doubleValue() : 0.0);
                    return me;
                })
                .collect(Collectors.toList());

        // Earnings history
        List<EarningsResponse.EarningHistoryItem> history = earningsRepository
                .findByProviderIdOrderByEarnedAtDesc(providerId).stream()
                .map(e -> {
                    Booking booking = bookingRepository.findById(e.getBookingId()).orElse(null);
                    String customerName = booking != null ?
                            userRepository.findById(booking.getCustomerId())
                                    .map(User::getName).orElse("Unknown") : "Unknown";
                    String service = booking != null ? booking.getService() : "—";
                    String method = paymentRepository.findByBookingId(e.getBookingId())
                            .map(Payment::getMethod).orElse("—");
                    
                    EarningsResponse.EarningHistoryItem item = new EarningsResponse.EarningHistoryItem();

                    item.setEarnedAt(e.getEarnedAt());
                    item.setCustomerName(customerName);
                    item.setService(service);
                    item.setAmount(e.getAmount());
                    item.setPaymentMethod(method);

                    return item;
                }).collect(Collectors.toList());

        EarningsResponse res = new EarningsResponse();

        res.setTotal(total != null ? total : 0.0);
        res.setToday(today != null ? today : 0.0);
        res.setThisWeek(thisWeek != null ? thisWeek : 0.0);
        res.setThisMonth(thisMonth != null ? thisMonth : 0.0);
        res.setCompletedJobs(completedJobs);
        res.setCancelledJobs(cancelledJobs);
        res.setMonthly(monthly);
        res.setHistory(history);

        return res;
    }
}