// ============================================================
// FILE: src/main/java/com/quickserve/service/AdminService.java
// ============================================================


/*
package com.quickserve.service;

import com.quickserve.dto.response.AnalyticsResponse;
import com.quickserve.dto.response.BookingResponse;
import com.quickserve.dto.response.ProviderResponse;
import com.quickserve.model.Booking;
import com.quickserve.model.Provider;
import com.quickserve.model.User;
import com.quickserve.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
//@RequiredArgsConstructor
public class AdminService {

    private final ProviderRepository providerRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final EarningsRepository earningsRepository;
    private final ProviderService providerService;
    private final BookingService bookingService;
    private final BadgeService badgeService;

    //constructor
    public AdminService(ProviderRepository providerRepository,
            UserRepository userRepository,
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository,
            EarningsRepository earningsRepository,
            ProviderService providerService,
            BookingService bookingService,
            BadgeService badgeService) {
    	
			this.providerRepository = providerRepository;
			this.userRepository = userRepository;
			this.bookingRepository = bookingRepository;
			this.paymentRepository = paymentRepository;
			this.earningsRepository = earningsRepository;
			this.providerService = providerService;
			this.bookingService = bookingService;
			this.badgeService=badgeService;
			
    		}
    
    // ─── Get all providers (with optional status filter) ─────
    public List<ProviderResponse> getAllProviders() {
        return providerRepository.findAll().stream()
                .map(providerService::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Approve provider ────────────────────────────────────
    public ProviderResponse approveProvider(Long id) {
        Provider p = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        p.setStatus(Provider.Status.APPROVED);
        providerRepository.save(p);
        
        badgeService.updateAutoBadges(id);
        return providerService.toResponse(p);
    }

    // ─── Reject provider ─────────────────────────────────────
    public ProviderResponse rejectProvider(Long id) {
        Provider p = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        p.setStatus(Provider.Status.REJECTED);
        providerRepository.save(p);
        return providerService.toResponse(p);
    }

    // ─── Get all bookings ────────────────────────────────────
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
                .map(b -> bookingService.getBookingById(b.getId()))
                .collect(Collectors.toList());
    }

    // ─── Full analytics ──────────────────────────────────────
    public AnalyticsResponse getAnalytics() {
        LocalDate today = LocalDate.now();

        long totalCustomers = userRepository.countByRole(User.Role.CUSTOMER);
        long totalProviders = providerRepository.countByStatus(Provider.Status.APPROVED);
        long totalBookings  = bookingRepository.count();
        Double totalRevenue = bookingRepository.getTotalRevenue();
        long pendingApprovals = providerRepository.countByStatus(Provider.Status.PENDING);
        long todayBookings  = bookingRepository.countTodayBookings(today);
        long activeBookings = bookingRepository.findActiveBookings().size();

        // Service stats
        List<AnalyticsResponse.ServiceStat> serviceStats = bookingRepository.countByServiceGrouped()
                .stream().map(row -> {
                    AnalyticsResponse.ServiceStat stat = new AnalyticsResponse.ServiceStat();
                    stat.setService((String) row[0]);
                    stat.setCount((Long) row[1]);
                    return stat;
                })
                   .collect(Collectors.toList());

        // Monthly revenue
        List<AnalyticsResponse.MonthlyRevenue> monthlyRevenue = bookingRepository.getMonthlyRevenue()
                .stream().map(row -> {
                    int month = ((Number) row[0]).intValue();
                    Double rev = row[2] != null ? ((Number) row[2]).doubleValue() : 0.0;
                    AnalyticsResponse.MonthlyRevenue mr = new AnalyticsResponse.MonthlyRevenue();
                    mr.setMonth(Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
                    mr.setRevenue(rev);
                    return mr;
                }).collect(Collectors.toList());

        // City stats
        Map<String, Long> cityMap = new LinkedHashMap<>();
        bookingRepository.findAll().forEach(b -> {
            providerRepository.findById(b.getProviderId()).ifPresent(p ->
                    cityMap.merge(p.getCity(), 1L, Long::sum));
        });
        List<AnalyticsResponse.CityStat> cityStats = cityMap.entrySet().stream()
        		.map(e -> {
        		    AnalyticsResponse.CityStat cs = new AnalyticsResponse.CityStat();
        		    cs.setCity(e.getKey());
        		    cs.setCount(e.getValue());
        		    return cs;
        		}).collect(Collectors.toList());

        // Top providers
        List<ProviderResponse> topProviders = providerRepository.findTopProviders()
                .stream().limit(5)
                .map(p -> {
                    ProviderResponse res = providerService.toResponse(p);
                    res.setRecommendationScore(
                            (double) bookingRepository.countCompletedByProvider(p.getId()));
                    return res;
                }).collect(Collectors.toList());

        // User growth (last 6 months)
        List<AnalyticsResponse.UserGrowth> userGrowth = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = YearMonth.now().minusMonths(i);
            AnalyticsResponse.UserGrowth ug = new AnalyticsResponse.UserGrowth();
            ug.setMonth(ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            ug.setCustomers(0L);
            ug.setProviders(0L);
            userGrowth.add(ug);
        }

        // Recent activity feed
        List<AnalyticsResponse.ActivityItem> activity = new ArrayList<>();
        bookingRepository.findAll().stream()
                .sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
                .limit(10)
                .forEach(b -> {
                    String customerName = userRepository.findById(b.getCustomerId())
                            .map(User::getName).orElse("Customer");
                    AnalyticsResponse.ActivityItem item = new AnalyticsResponse.ActivityItem();
                    item.setIcon("📅");
                    item.setDescription(customerName + " booked " + b.getService());
                    item.setCreatedAt(b.getCreatedAt());
                    activity.add(item);
                });

        AnalyticsResponse res = new AnalyticsResponse();

        res.setTotalCustomers(totalCustomers);
        res.setTotalProviders(totalProviders);
        res.setTotalBookings(totalBookings);
        res.setTotalRevenue(totalRevenue != null ? totalRevenue : 0.0);
        res.setPendingApprovals(pendingApprovals);
        res.setTodayBookings(todayBookings);
        res.setActiveBookings(activeBookings);
        res.setServiceStats(serviceStats);
        res.setMonthlyRevenue(monthlyRevenue);
        res.setCityStats(cityStats);
        res.setTopProviders(topProviders);
        res.setUserGrowth(userGrowth);
        res.setRecentActivity(activity);
        
        res.setBookingHeatmap(buildHeatmap());

        return res;
    }
    private List<AnalyticsResponse.HeatmapCell> buildHeatmap() {

        Map<Integer, String> dayLabels = Map.of(
            2, "Mon", 3, "Tue", 4, "Wed",
            5, "Thu", 6, "Fri", 7, "Sat", 1, "Sun"
        );

        Map<Integer, Integer> dayToIndex = Map.of(
            2, 0, 3, 1, 4, 2, 5, 3, 6, 4, 7, 5, 1, 6
        );

        Map<String, String> slotLabels = new LinkedHashMap<>();
        slotLabels.put("08:00-09:00", "8 AM");
        slotLabels.put("09:00-10:00", "9 AM");
        slotLabels.put("10:00-11:00", "10 AM");
        slotLabels.put("11:00-12:00", "11 AM");
        slotLabels.put("12:00-13:00", "12 PM");
        slotLabels.put("14:00-15:00", "2 PM");
        slotLabels.put("15:00-16:00", "3 PM");
        slotLabels.put("16:00-17:00", "4 PM");
        slotLabels.put("17:00-18:00", "5 PM");

        Map<String, Long> dbMap = new HashMap<>();

        bookingRepository.getBookingHeatmap().forEach(row -> {
            int day = ((Number) row[0]).intValue();
            String slot = (String) row[1];
            long count = ((Number) row[2]).longValue();
            dbMap.put(day + "|" + slot, count);
        });

        List<AnalyticsResponse.HeatmapCell> cells = new ArrayList<>();

        int[] dayOrder = {2, 3, 4, 5, 6, 7, 1};

        for (Map.Entry<String, String> slotEntry : slotLabels.entrySet()) {
            String slotValue = slotEntry.getKey();
            String slotLabel = slotEntry.getValue();

            for (int mysqlDay : dayOrder) {
                long count = dbMap.getOrDefault(mysqlDay + "|" + slotValue, 0L);

                AnalyticsResponse.HeatmapCell cell = new AnalyticsResponse.HeatmapCell();
                cell.setDayIndex(dayToIndex.get(mysqlDay));
                cell.setDayLabel(dayLabels.get(mysqlDay));
                cell.setSlot(slotValue);
                cell.setSlotLabel(slotLabel);
                cell.setCount(count);

                cells.add(cell);
            }
        }

        return cells;
    }
}

this is the older version.
*/

//new version

// ============================================================
// FILE: src/main/java/com/quickserve/service/AdminService.java
// FULL REPLACEMENT — no Lombok, fixes null providerId crash,
// adds heatmap, proper builder-less construction
// ============================================================

package com.quickserve.service;

import com.quickserve.dto.response.AnalyticsResponse;
import com.quickserve.dto.response.BookingResponse;
import com.quickserve.dto.response.ProviderResponse;
import com.quickserve.model.Booking;
import com.quickserve.model.Provider;
import com.quickserve.model.User;
import com.quickserve.repository.BookingRepository;
import com.quickserve.repository.EarningsRepository;
import com.quickserve.repository.PaymentRepository;
import com.quickserve.repository.ProviderRepository;
import com.quickserve.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final ProviderRepository providerRepository;
    private final UserRepository     userRepository;
    private final BookingRepository  bookingRepository;
    private final PaymentRepository  paymentRepository;
    private final EarningsRepository earningsRepository;
    private final ProviderService    providerService;
    private final BookingService     bookingService;

    public AdminService(ProviderRepository providerRepository,
                        UserRepository userRepository,
                        BookingRepository bookingRepository,
                        PaymentRepository paymentRepository,
                        EarningsRepository earningsRepository,
                        ProviderService providerService,
                        BookingService bookingService) {
        this.providerRepository = providerRepository;
        this.userRepository     = userRepository;
        this.bookingRepository  = bookingRepository;
        this.paymentRepository  = paymentRepository;
        this.earningsRepository = earningsRepository;
        this.providerService    = providerService;
        this.bookingService     = bookingService;
    }

    // ── Get all providers ─────────────────────────────────────
    public List<ProviderResponse> getAllProviders() {
        return providerRepository.findAll().stream()
                .map(providerService::toResponse)
                .collect(Collectors.toList());
    }

    // ── Approve provider ──────────────────────────────────────
    public ProviderResponse approveProvider(Long id) {
        Provider p = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        p.setStatus(Provider.Status.APPROVED);
        providerRepository.save(p);
        return providerService.toResponse(p);
    }

    // ── Reject provider ───────────────────────────────────────
    public ProviderResponse rejectProvider(Long id) {
        Provider p = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        p.setStatus(Provider.Status.REJECTED);
        providerRepository.save(p);
        return providerService.toResponse(p);
    }

    // ── Get all bookings ──────────────────────────────────────
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .sorted(Comparator.comparing(Booking::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(b -> bookingService.getBookingById(b.getId()))
                .collect(Collectors.toList());
    }

    // ── Full analytics ────────────────────────────────────────
    public AnalyticsResponse getAnalytics() {

        long totalCustomers   = userRepository.countByRole(User.Role.CUSTOMER);
        long totalProviders   = providerRepository.countByStatus(Provider.Status.APPROVED);
        long totalBookings    = bookingRepository.count();
        long pendingApprovals = providerRepository.countByStatus(Provider.Status.PENDING);
        long todayBookings    = bookingRepository.countTodayBookings(
                java.time.LocalDate.now());
        long activeBookings   = bookingRepository.findActiveBookings().size();

        Double revenueRaw = bookingRepository.getTotalRevenue();
        double totalRevenue = revenueRaw != null ? revenueRaw : 0.0;

        // ── Service stats ─────────────────────────────────────
        List<AnalyticsResponse.ServiceStat> serviceStats =
                bookingRepository.countByServiceGrouped().stream()
                        .map(row -> new AnalyticsResponse.ServiceStat(
                                (String) row[0],
                                ((Number) row[1]).longValue()))
                        .collect(Collectors.toList());

        // ── Monthly revenue ───────────────────────────────────
        List<AnalyticsResponse.MonthlyRevenue> monthlyRevenue =
                bookingRepository.getMonthlyRevenue().stream()
                        .map(row -> {
                            int m = ((Number) row[0]).intValue();
                            double rev = row[2] != null
                                    ? ((Number) row[2]).doubleValue()
                                    : 0.0;
                            return new AnalyticsResponse.MonthlyRevenue(
                                    Month.of(m).getDisplayName(
                                            TextStyle.SHORT, Locale.ENGLISH),
                                    rev);
                        })
                        .collect(Collectors.toList());

        // ── City stats ────────────────────────────────────────
        // FIX: skip bookings with null providerId (urgent bookings)
        Map<String, Long> cityMap = new LinkedHashMap<>();
        bookingRepository.findAll().forEach(b -> {
            if (b.getProviderId() == null) return;   // ← KEY FIX
            providerRepository.findById(b.getProviderId()).ifPresent(p ->
                    cityMap.merge(p.getCity(), 1L, Long::sum));
        });
        List<AnalyticsResponse.CityStat> cityStats = cityMap.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> new AnalyticsResponse.CityStat(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        // ── Top providers ─────────────────────────────────────
        List<ProviderResponse> topProviders =
                providerRepository.findTopProviders().stream()
                        .limit(5)
                        .map(p -> {
                            ProviderResponse res = providerService.toResponse(p);
                            res.setRecommendationScore(
                                    (double) bookingRepository
                                            .countCompletedByProvider(p.getId()));
                            return res;
                        })
                        .collect(Collectors.toList());

        // ── User growth — last 6 months ───────────────────────
        // Counts users registered in each of the last 6 calendar months
        List<AnalyticsResponse.UserGrowth> userGrowth = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym    = YearMonth.now().minusMonths(i);
            String monthStr = ym.getMonth().getDisplayName(
                    TextStyle.SHORT, Locale.ENGLISH);

            // Count customers registered in this month
            long custCount = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == User.Role.CUSTOMER
                            && u.getCreatedAt() != null
                            && YearMonth.from(u.getCreatedAt()).equals(ym))
                    .count();

            // Count providers registered in this month
            long provCount = providerRepository.findAll().stream()
                    .filter(p -> p.getCreatedAt() != null
                            && YearMonth.from(p.getCreatedAt()).equals(ym))
                    .count();

            userGrowth.add(new AnalyticsResponse.UserGrowth(
                    monthStr, custCount, provCount));
        }

        // ── Recent activity ───────────────────────────────────
        List<AnalyticsResponse.ActivityItem> activity = new ArrayList<>();
        bookingRepository.findAll().stream()
                .filter(b -> b.getCreatedAt() != null)
                .sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
                .limit(10)
                .forEach(b -> {
                    String cName = userRepository.findById(b.getCustomerId())
                            .map(User::getName).orElse("Customer");
                    activity.add(new AnalyticsResponse.ActivityItem(
                            "📅",
                            cName + " booked " + b.getService(),
                            b.getCreatedAt()));
                });

        // ── Booking demand heatmap ────────────────────────────
        List<AnalyticsResponse.HeatmapCell> heatmap = buildHeatmap();

        // ── Assemble response — no Lombok builder ─────────────
        AnalyticsResponse res = new AnalyticsResponse();
        res.setTotalCustomers(totalCustomers);
        res.setTotalProviders(totalProviders);
        res.setTotalBookings(totalBookings);
        res.setTotalRevenue(totalRevenue);
        res.setPendingApprovals(pendingApprovals);
        res.setTodayBookings(todayBookings);
        res.setActiveBookings(activeBookings);
        res.setServiceStats(serviceStats);
        res.setMonthlyRevenue(monthlyRevenue);
        res.setCityStats(cityStats);
        res.setTopProviders(topProviders);
        res.setUserGrowth(userGrowth);
        res.setRecentActivity(activity);
        res.setBookingHeatmap(heatmap);
        return res;
    }

    // ── Heatmap builder ───────────────────────────────────────
    private List<AnalyticsResponse.HeatmapCell> buildHeatmap() {

        // MySQL DAYOFWEEK: 1=Sun, 2=Mon … 7=Sat
        // We display Mon–Sun, so remap to 0–6 index
        Map<Integer, String> dayLabels = new HashMap<>();
        dayLabels.put(1, "Sun"); dayLabels.put(2, "Mon");
        dayLabels.put(3, "Tue"); dayLabels.put(4, "Wed");
        dayLabels.put(5, "Thu"); dayLabels.put(6, "Fri");
        dayLabels.put(7, "Sat");

        // Display order: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
        Map<Integer, Integer> dayToIndex = new HashMap<>();
        dayToIndex.put(2, 0); dayToIndex.put(3, 1); dayToIndex.put(4, 2);
        dayToIndex.put(5, 3); dayToIndex.put(6, 4); dayToIndex.put(7, 5);
        dayToIndex.put(1, 6);

        // Slot display labels
        Map<String, String> slotLabels = new LinkedHashMap<>();
        slotLabels.put("08:00-09:00", "8 AM");
        slotLabels.put("09:00-10:00", "9 AM");
        slotLabels.put("10:00-11:00", "10 AM");
        slotLabels.put("11:00-12:00", "11 AM");
        slotLabels.put("12:00-13:00", "12 PM");
        slotLabels.put("14:00-15:00", "2 PM");
        slotLabels.put("15:00-16:00", "3 PM");
        slotLabels.put("16:00-17:00", "4 PM");
        slotLabels.put("17:00-18:00", "5 PM");

        // Build lookup from DB results
        Map<String, Long> dbMap = new HashMap<>();
        try {
            bookingRepository.getBookingHeatmap().forEach(row -> {
                int    day   = ((Number) row[0]).intValue();
                String slot  = (String) row[1];
                long   count = ((Number) row[2]).longValue();
                dbMap.put(day + "|" + slot, count);
            });
        } catch (Exception e) {
            // getBookingHeatmap may not exist yet — return empty heatmap
            // rather than crashing the entire analytics endpoint
            return new ArrayList<>();
        }

        // Build full grid — every slot × every day
        int[] dayOrder = {2, 3, 4, 5, 6, 7, 1}; // Mon first
        List<AnalyticsResponse.HeatmapCell> cells = new ArrayList<>();

        for (Map.Entry<String, String> slotEntry : slotLabels.entrySet()) {
            String slotValue = slotEntry.getKey();
            String slotLabel = slotEntry.getValue();

            for (int mysqlDay : dayOrder) {
                long count = dbMap.getOrDefault(mysqlDay + "|" + slotValue, 0L);
                cells.add(new AnalyticsResponse.HeatmapCell(
                        dayToIndex.get(mysqlDay),
                        dayLabels.get(mysqlDay),
                        slotValue,
                        slotLabel,
                        count));
            }
        }
        return cells;
    }
}