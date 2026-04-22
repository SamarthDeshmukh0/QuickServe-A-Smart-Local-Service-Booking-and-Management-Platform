// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/AnalyticsResponse.java
// ============================================================


/*
package com.quickserve.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AnalyticsResponse {
	
    private Long totalCustomers;
    private Long totalProviders;
    private Long totalBookings;
    private Double totalRevenue;
    private Long pendingApprovals;
    private Long todayBookings;
    private Long activeBookings;

    private List<ServiceStat> serviceStats;
    private List<MonthlyRevenue> monthlyRevenue;
    private List<CityStat> cityStats;
    private List<ProviderResponse> topProviders;
    private List<UserGrowth> userGrowth;
    private List<ActivityItem> recentActivity;
    private List<HeatmapCell> bookingHeatmap;

    
    
 //  No-args constructor
    public AnalyticsResponse() {}

    // GETTERS/SETTERS

    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }

    public Long getTotalProviders() { return totalProviders; }
    public void setTotalProviders(Long totalProviders) { this.totalProviders = totalProviders; }

    public Long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getPendingApprovals() { return pendingApprovals; }
    public void setPendingApprovals(Long pendingApprovals) { this.pendingApprovals = pendingApprovals; }

    public Long getTodayBookings() { return todayBookings; }
    public void setTodayBookings(Long todayBookings) { this.todayBookings = todayBookings; }

    public Long getActiveBookings() { return activeBookings; }
    public void setActiveBookings(Long activeBookings) { this.activeBookings = activeBookings; }

    public List<ServiceStat> getServiceStats() { return serviceStats; }
    public void setServiceStats(List<ServiceStat> serviceStats) { this.serviceStats = serviceStats; }

    public List<MonthlyRevenue> getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(List<MonthlyRevenue> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

    public List<CityStat> getCityStats() { return cityStats; }
    public void setCityStats(List<CityStat> cityStats) { this.cityStats = cityStats; }

    public List<ProviderResponse> getTopProviders() { return topProviders; }
    public void setTopProviders(List<ProviderResponse> topProviders) { this.topProviders = topProviders; }

    public List<UserGrowth> getUserGrowth() { return userGrowth; }
    public void setUserGrowth(List<UserGrowth> userGrowth) { this.userGrowth = userGrowth; }

    public List<ActivityItem> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<ActivityItem> recentActivity) { this.recentActivity = recentActivity; }
    
    public List<HeatmapCell> getBookingHeatmap() {
		return bookingHeatmap;
	}

	public void setBookingHeatmap(List<HeatmapCell> bookingHeatmap) {
		this.bookingHeatmap = bookingHeatmap;
	}






	public static class ServiceStat {
        private String service;
        private Long count;
        
        public ServiceStat() {}
        
        public String getService() { return service; }
        public void setService(String service) { this.service = service; }

        public Long getCount() { return count; }
        public void setCount(Long count) { this.count = count; }
    }
    
    

   
    public static class MonthlyRevenue {
        private String month;
        private Double revenue;
        
        public MonthlyRevenue() {}
        
        public String getMonth() {return month;}
        public void setMonth(String month) {this.month=month;}
        
        public Double getRevenue() {return revenue;}
        public void setRevenue(Double revenue) {this.revenue=revenue;}
    }

    
    
    public static class CityStat {
        private String city;
        private Long count;
        
        public CityStat() {}
        
        public String getCity() {return city;}
        public void setCity(String city) {this.city=city;}
        
        public Long getCount() {return count;}
        public void setCount(Long count) {this.count=count;}
    }

    
    
    public static class UserGrowth {
        private String month;
        private Long customers;
        private Long providers;
        
        public UserGrowth() {}

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }

        public Long getCustomers() { return customers; }
        public void setCustomers(Long customers) { this.customers = customers; }

        public Long getProviders() { return providers; }
        public void setProviders(Long providers) { this.providers = providers; }
   
    }

    
    
    public static class ActivityItem {
        private String icon;
        private String description;
        private java.time.LocalDateTime createdAt;
        
        public ActivityItem() {}

        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
  
    }
    
    public static class HeatmapCell {
        private int    dayIndex;    // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
        private String dayLabel;    // "Mon", "Tue", etc.
        private String slot;        // "08:00-09:00"
        private String slotLabel;   // "8 AM"
        private long   count;       // number of bookings in this cell
        
        //constructors
        public HeatmapCell() {}
		public HeatmapCell(int dayIndex, String dayLabel, String slot, String slotLabel, long count) {
			super();
			this.dayIndex = dayIndex;
			this.dayLabel = dayLabel;
			this.slot = slot;
			this.slotLabel = slotLabel;
			this.count = count;
		}
		public int getDayIndex() {
			return dayIndex;
		}
		public void setDayIndex(int dayIndex) {
			this.dayIndex = dayIndex;
		}
		public String getDayLabel() {
			return dayLabel;
		}
		public void setDayLabel(String dayLabel) {
			this.dayLabel = dayLabel;
		}
		public String getSlot() {
			return slot;
		}
		public void setSlot(String slot) {
			this.slot = slot;
		}
		public String getSlotLabel() {
			return slotLabel;
		}
		public void setSlotLabel(String slotLabel) {
			this.slotLabel = slotLabel;
		}
		public long getCount() {
			return count;
		}
		public void setCount(long count) {
			this.count = count;
		}
    }
}

this is the older version
*/


//new version
// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/AnalyticsResponse.java
// FULL REPLACEMENT — no Lombok, adds HeatmapCell inner class
// ============================================================

package com.quickserve.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class AnalyticsResponse {

    private Long totalCustomers;
    private Long totalProviders;
    private Long totalBookings;
    private Double totalRevenue;
    private Long pendingApprovals;
    private Long todayBookings;
    private Long activeBookings;

    private List<ServiceStat>    serviceStats;
    private List<MonthlyRevenue> monthlyRevenue;
    private List<CityStat>       cityStats;
    private List<ProviderResponse> topProviders;
    private List<UserGrowth>     userGrowth;
    private List<ActivityItem>   recentActivity;
    private List<HeatmapCell>    bookingHeatmap;

    public AnalyticsResponse() {}

    // ── Getters & Setters ─────────────────────────────────────
    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long v) { this.totalCustomers = v; }

    public Long getTotalProviders() { return totalProviders; }
    public void setTotalProviders(Long v) { this.totalProviders = v; }

    public Long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Long v) { this.totalBookings = v; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double v) { this.totalRevenue = v; }

    public Long getPendingApprovals() { return pendingApprovals; }
    public void setPendingApprovals(Long v) { this.pendingApprovals = v; }

    public Long getTodayBookings() { return todayBookings; }
    public void setTodayBookings(Long v) { this.todayBookings = v; }

    public Long getActiveBookings() { return activeBookings; }
    public void setActiveBookings(Long v) { this.activeBookings = v; }

    public List<ServiceStat> getServiceStats() { return serviceStats; }
    public void setServiceStats(List<ServiceStat> v) { this.serviceStats = v; }

    public List<MonthlyRevenue> getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(List<MonthlyRevenue> v) { this.monthlyRevenue = v; }

    public List<CityStat> getCityStats() { return cityStats; }
    public void setCityStats(List<CityStat> v) { this.cityStats = v; }

    public List<ProviderResponse> getTopProviders() { return topProviders; }
    public void setTopProviders(List<ProviderResponse> v) { this.topProviders = v; }

    public List<UserGrowth> getUserGrowth() { return userGrowth; }
    public void setUserGrowth(List<UserGrowth> v) { this.userGrowth = v; }

    public List<ActivityItem> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<ActivityItem> v) { this.recentActivity = v; }

    public List<HeatmapCell> getBookingHeatmap() { return bookingHeatmap; }
    public void setBookingHeatmap(List<HeatmapCell> v) { this.bookingHeatmap = v; }

    // ════════════════════════════════════════════════════════
    // Inner classes — no Lombok
    // ════════════════════════════════════════════════════════

    public static class ServiceStat {
        private String service;
        private Long count;
        public ServiceStat() {}
        public ServiceStat(String service, Long count) { this.service = service; this.count = count; }
        public String getService() { return service; }
        public void setService(String v) { this.service = v; }
        public Long getCount() { return count; }
        public void setCount(Long v) { this.count = v; }
    }

    public static class MonthlyRevenue {
        private String month;
        private Double revenue;
        public MonthlyRevenue() {}
        public MonthlyRevenue(String month, Double revenue) { this.month = month; this.revenue = revenue; }
        public String getMonth() { return month; }
        public void setMonth(String v) { this.month = v; }
        public Double getRevenue() { return revenue; }
        public void setRevenue(Double v) { this.revenue = v; }
    }

    public static class CityStat {
        private String city;
        private Long count;
        public CityStat() {}
        public CityStat(String city, Long count) { this.city = city; this.count = count; }
        public String getCity() { return city; }
        public void setCity(String v) { this.city = v; }
        public Long getCount() { return count; }
        public void setCount(Long v) { this.count = v; }
    }

    public static class UserGrowth {
        private String month;
        private Long customers;
        private Long providers;
        public UserGrowth() {}
        public UserGrowth(String month, Long customers, Long providers) {
            this.month = month; this.customers = customers; this.providers = providers;
        }
        public String getMonth() { return month; }
        public void setMonth(String v) { this.month = v; }
        public Long getCustomers() { return customers; }
        public void setCustomers(Long v) { this.customers = v; }
        public Long getProviders() { return providers; }
        public void setProviders(Long v) { this.providers = v; }
    }

    public static class ActivityItem {
        private String icon;
        private String description;
        private LocalDateTime createdAt;
        public ActivityItem() {}
        public ActivityItem(String icon, String description, LocalDateTime createdAt) {
            this.icon = icon; this.description = description; this.createdAt = createdAt;
        }
        public String getIcon() { return icon; }
        public void setIcon(String v) { this.icon = v; }
        public String getDescription() { return description; }
        public void setDescription(String v) { this.description = v; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    }

    // ── NEW: HeatmapCell ──────────────────────────────────────
    public static class HeatmapCell {
        private int    dayIndex;    // 0=Mon … 6=Sun
        private String dayLabel;    // "Mon", "Tue" …
        private String slot;        // "08:00-09:00"
        private String slotLabel;   // "8 AM"
        private long   count;       // number of bookings in this cell
        public HeatmapCell() {}
        public HeatmapCell(int dayIndex, String dayLabel,
                           String slot, String slotLabel, long count) {
            this.dayIndex  = dayIndex;
            this.dayLabel  = dayLabel;
            this.slot      = slot;
            this.slotLabel = slotLabel;
            this.count     = count;
        }
        public int    getDayIndex()  { return dayIndex;  }
        public void   setDayIndex(int v)    { this.dayIndex  = v; }
        public String getDayLabel()  { return dayLabel;  }
        public void   setDayLabel(String v) { this.dayLabel  = v; }
        public String getSlot()      { return slot;      }
        public void   setSlot(String v)     { this.slot      = v; }
        public String getSlotLabel() { return slotLabel; }
        public void   setSlotLabel(String v){ this.slotLabel = v; }
        public long   getCount()     { return count;     }
        public void   setCount(long v)      { this.count     = v; }
    }
}