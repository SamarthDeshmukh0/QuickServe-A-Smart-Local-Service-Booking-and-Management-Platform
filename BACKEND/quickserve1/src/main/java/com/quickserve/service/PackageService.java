// ============================================================
// FILE: src/main/java/com/quickserve/service/PackageService.java
// NEW FILE — core logic for group/package bookings
// ============================================================

package com.quickserve.service;

import com.quickserve.dto.request.PackageBookingRequest;
import com.quickserve.dto.response.BookingResponse;
import com.quickserve.dto.response.GroupBookingResponse;
import com.quickserve.dto.response.PackageResponse;
import com.quickserve.model.Booking;
import com.quickserve.model.GroupBooking;
import com.quickserve.model.Provider;
import com.quickserve.model.ServicePackage;
import com.quickserve.model.User;
import com.quickserve.repository.BookingRepository;
import com.quickserve.repository.GroupBookingRepository;
import com.quickserve.repository.ProviderRepository;
import com.quickserve.repository.ServicePackageRepository;
import com.quickserve.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PackageService {

    private final ServicePackageRepository packageRepository;
    private final GroupBookingRepository   groupBookingRepository;
    private final BookingRepository        bookingRepository;
    private final ProviderRepository       providerRepository;
    private final UserRepository           userRepository;
    private final BookingService           bookingService;

    // Service name → icon + base price (mirrors constants.js SERVICES)
    // Must stay in sync with the frontend SERVICES array
    private static final Map<String, double[]> SERVICE_META = new HashMap<>();
    static {
        SERVICE_META.put("Plumber",          new double[]{499});
        SERVICE_META.put("Electrician",      new double[]{399});
        SERVICE_META.put("Carpenter",        new double[]{599});
        SERVICE_META.put("AC Repair",        new double[]{699});
        SERVICE_META.put("House Cleaning",   new double[]{799});
        SERVICE_META.put("Painting",         new double[]{1499});
        SERVICE_META.put("Pest Control",     new double[]{999});
        SERVICE_META.put("Appliance Repair", new double[]{499});
        SERVICE_META.put("Water Purifier",   new double[]{349});
        SERVICE_META.put("Salon Service",    new double[]{599});
    }

    // Icon map
    private static final Map<String, String> SERVICE_ICONS = new HashMap<>();
    static {
        SERVICE_ICONS.put("Plumber",          "🔧");
        SERVICE_ICONS.put("Electrician",      "⚡");
        SERVICE_ICONS.put("Carpenter",        "🔨");
        SERVICE_ICONS.put("AC Repair",        "❄️");
        SERVICE_ICONS.put("House Cleaning",   "🏠");
        SERVICE_ICONS.put("Painting",         "🎨");
        SERVICE_ICONS.put("Pest Control",     "🐛");
        SERVICE_ICONS.put("Appliance Repair", "⚙️");
        SERVICE_ICONS.put("Water Purifier",   "💧");
        SERVICE_ICONS.put("Salon Service",    "✂️");
    }

    public PackageService(ServicePackageRepository packageRepository,
                          GroupBookingRepository groupBookingRepository,
                          BookingRepository bookingRepository,
                          ProviderRepository providerRepository,
                          UserRepository userRepository,
                          BookingService bookingService) {
        this.packageRepository      = packageRepository;
        this.groupBookingRepository = groupBookingRepository;
        this.bookingRepository      = bookingRepository;
        this.providerRepository     = providerRepository;
        this.userRepository         = userRepository;
        this.bookingService         = bookingService;
    }

    // ── Get all active packages with calculated prices ────────
    public List<PackageResponse> getAllPackages() {
        return packageRepository.findByIsActiveTrue()
                .stream()
                .map(this::toPackageResponse)
                .collect(Collectors.toList());
    }

    // ── Get single package by ID ──────────────────────────────
    public PackageResponse getPackageById(Long id) {
        ServicePackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        return toPackageResponse(pkg);
    }

    // ── Create group booking ──────────────────────────────────
    // Steps:
    //   1. Load the package definition
    //   2. Parse the service list
    //   3. For each service find the best available provider in customer city
    //   4. Create one Booking per service, all sharing the same groupId
    //   5. Save GroupBooking record
    //   6. Return full GroupBookingResponse
    @Transactional
    public GroupBookingResponse createGroupBooking(PackageBookingRequest req) {

        // Load package
        ServicePackage pkg = packageRepository.findById(req.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        // Parse service list from comma-separated string
        List<String> services = Arrays.stream(pkg.getServiceTypes().split(","))
                .map(String::trim)
                .collect(Collectors.toList());

        // Calculate prices
        double subtotal       = services.stream()
                .mapToDouble(s -> getBasePrice(s))
                .sum();
        double discountAmount = Math.round(subtotal * pkg.getDiscountPercent() / 100.0 * 100) / 100.0;
        double totalAmount    = subtotal - discountAmount;

        // Generate unique group ID
        String groupId = "gb-" + UUID.randomUUID().toString();

        // Parse date
        LocalDate serviceDate = LocalDate.parse(req.getDate());

        // Customer name
        String customerName = userRepository.findById(req.getCustomerId())
                .map(User::getName).orElse("Customer");

        // Create one sub-booking per service
        List<Booking> subBookings = new ArrayList<>();

        for (String serviceName : services) {
            // Find the best approved provider for this service in this city
            // "Best" = highest avgRating (simple fallback if no scorer available)
            List<Provider> candidates = providerRepository
                    .findByCityAndProfessionAndStatus(
                            req.getCity(),
                            serviceName,
                            Provider.Status.APPROVED
                    );

            // Pick highest rated — if none available, skip with a warning
            Provider chosen = candidates.stream()
                    .max((a, b) -> Double.compare(
                            a.getAvgRating() != null ? a.getAvgRating() : 0.0,
                            b.getAvgRating() != null ? b.getAvgRating() : 0.0))
                    .orElse(null);

            Booking sub = new Booking();
            sub.setCustomerId(req.getCustomerId());
            sub.setProviderId(chosen != null ? chosen.getId() : null);
            sub.setService(serviceName);
            sub.setDate(serviceDate);
            sub.setTimeSlot(req.getTimeSlot());
            sub.setAddress(req.getAddress());
            sub.setProblem(req.getProblem());
            sub.setAmount(getBasePrice(serviceName));
            sub.setGroupBookingId(groupId);
            sub.setIsUrgent(false);
            sub.setUrgentFee(0.0);
            sub.setOutsideEstimate(false);
            sub.setStatus(Booking.Status.BOOKED);

            subBookings.add(bookingRepository.save(sub));
        }

        // Save GroupBooking record
        GroupBooking group = new GroupBooking();
        group.setGroupId(groupId);
        group.setCustomerId(req.getCustomerId());
        group.setPackageId(pkg.getId());
        group.setPackageName(pkg.getName());
        group.setAddress(req.getAddress());
        group.setProblem(req.getProblem());
        group.setDate(serviceDate);
        group.setTimeSlot(req.getTimeSlot());
        group.setSubtotal(subtotal);
        group.setDiscountAmount(discountAmount);
        group.setTotalAmount(totalAmount);
        group.setStatus(GroupBooking.GroupStatus.ACTIVE);
        GroupBooking saved = groupBookingRepository.save(group);

        // Build response
        return toGroupResponse(saved, subBookings, customerName, pkg.getDiscountPercent());
    }

    // ── Get group booking by groupId ──────────────────────────
    public GroupBookingResponse getGroupBooking(String groupId) {
        GroupBooking group = groupBookingRepository.findByGroupId(groupId)
                .orElseThrow(() -> new RuntimeException("Group booking not found"));

        List<Booking> subBookings =
                bookingRepository.findByGroupBookingIdOrderByCreatedAtAsc(groupId);

        String customerName = userRepository.findById(group.getCustomerId())
                .map(User::getName).orElse("Customer");

        ServicePackage pkg = packageRepository.findById(group.getPackageId()).orElse(null);
        double discountPct = pkg != null ? pkg.getDiscountPercent() : 0.0;

        // Auto-update group status if all subs are complete
        long stillActive = groupBookingRepository.countActiveSubBookings(groupId);
        if (stillActive == 0 && group.getStatus() == GroupBooking.GroupStatus.ACTIVE) {
            group.setStatus(GroupBooking.GroupStatus.COMPLETED);
            groupBookingRepository.save(group);
        }

        return toGroupResponse(group, subBookings, customerName, discountPct);
    }

    // ── Get all group bookings for a customer ─────────────────
    public List<GroupBookingResponse> getCustomerGroupBookings(Long customerId) {
        String customerName = userRepository.findById(customerId)
                .map(User::getName).orElse("Customer");

        return groupBookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(group -> {
                    List<Booking> subs =
                            bookingRepository.findByGroupBookingIdOrderByCreatedAtAsc(group.getGroupId());
                    ServicePackage pkg = packageRepository.findById(group.getPackageId()).orElse(null);
                    double pct = pkg != null ? pkg.getDiscountPercent() : 0.0;
                    return toGroupResponse(group, subs, customerName, pct);
                })
                .collect(Collectors.toList());
    }

    // ── Seed default packages (call once on startup) ──────────
    // Call this from a @PostConstruct in a config class or run manually.
    @Transactional
    public void seedPackages() {
        if (packageRepository.count() > 0) return;  // already seeded

        List<ServicePackage> defaults = List.of(
            makePackage("Home Renovation Package",
                "Complete home makeover — plumbing, electrical, and carpentry in one booking",
                10.0, "Plumber,Electrician,Carpenter"),

            makePackage("Deep Clean & Pest Control",
                "Professional deep cleaning followed by full pest treatment",
                8.0, "House Cleaning,Pest Control"),

            makePackage("AC Full Service Package",
                "AC servicing plus electrical safety check",
                8.0, "AC Repair,Electrician"),

            makePackage("New Home Setup Package",
                "Get your new home ready — painting, electrical, and carpentry",
                12.0, "Painting,Electrician,Carpenter")
        );

        packageRepository.saveAll(defaults);
    }

    // ── Private helpers ───────────────────────────────────────
    private ServicePackage makePackage(String name, String desc,
                                       double discount, String services) {
        ServicePackage p = new ServicePackage();
        p.setName(name);
        p.setDescription(desc);
        p.setDiscountPercent(discount);
        p.setServiceTypes(services);
        p.setIsActive(true);
        return p;
    }

    private double getBasePrice(String serviceName) {
        double[] meta = SERVICE_META.get(serviceName);
        return meta != null ? meta[0] : 499.0;
    }

    private PackageResponse toPackageResponse(ServicePackage pkg) {
        List<String> serviceNames = Arrays.stream(pkg.getServiceTypes().split(","))
                .map(String::trim)
                .collect(Collectors.toList());

        double subtotal = serviceNames.stream().mapToDouble(this::getBasePrice).sum();
        double discount = Math.round(subtotal * pkg.getDiscountPercent() / 100.0 * 100) / 100.0;

        List<PackageResponse.ServiceInfo> serviceInfos = serviceNames.stream()
                .map(s -> new PackageResponse.ServiceInfo(
                        s,
                        SERVICE_ICONS.getOrDefault(s, "🔧"),
                        getBasePrice(s)))
                .collect(Collectors.toList());

        PackageResponse res = new PackageResponse();
        res.setId(pkg.getId());
        res.setName(pkg.getName());
        res.setDescription(pkg.getDescription());
        res.setDiscountPercent(pkg.getDiscountPercent());
        res.setDiscountAmount(discount);
        res.setSubtotal(subtotal);
        res.setTotalAmount(subtotal - discount);
        res.setServiceTypes(serviceNames);
        res.setServices(serviceInfos);
        return res;
    }

    private GroupBookingResponse toGroupResponse(GroupBooking group,
                                                  List<Booking> subs,
                                                  String customerName,
                                                  double discountPct) {
        List<BookingResponse> subResponses = subs.stream()
                .map(bookingService::toResponse)
                .collect(Collectors.toList());

        GroupBookingResponse res = new GroupBookingResponse();
        res.setId(group.getId());
        res.setGroupId(group.getGroupId());
        res.setCustomerId(group.getCustomerId());
        res.setCustomerName(customerName);
        res.setPackageId(group.getPackageId());
        res.setPackageName(group.getPackageName());
        res.setAddress(group.getAddress());
        res.setProblem(group.getProblem());
        res.setDate(group.getDate());
        res.setTimeSlot(group.getTimeSlot());
        res.setSubtotal(group.getSubtotal());
        res.setDiscountAmount(group.getDiscountAmount());
        res.setDiscountPercent(discountPct);
        res.setTotalAmount(group.getTotalAmount());
        res.setStatus(group.getStatus().name());
        res.setCreatedAt(group.getCreatedAt());
        res.setSubBookings(subResponses);
        return res;
    }
}