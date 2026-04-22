// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/EarningsResponse.java
// ============================================================

package com.quickserve.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EarningsResponse {
    private Double total;
    private Double thisMonth;
    private Double thisWeek;
    private Double today;
    private Long completedJobs;
    private Long cancelledJobs;
    private List<MonthlyEarning> monthly;
    private List<EarningHistoryItem> history;
    
    public EarningsResponse() {}
    

    public EarningsResponse(Double total, Double thisMonth, Double thisWeek, Double today, Long completedJobs,
			Long cancelledJobs, List<MonthlyEarning> monthly, List<EarningHistoryItem> history) {
		super();
		this.total = total;
		this.thisMonth = thisMonth;
		this.thisWeek = thisWeek;
		this.today = today;
		this.completedJobs = completedJobs;
		this.cancelledJobs = cancelledJobs;
		this.monthly = monthly;
		this.history = history;
	}
    
    
	public Double getTotal() {
		return total;
	}


	public void setTotal(Double total) {
		this.total = total;
	}


	public Double getThisMonth() {
		return thisMonth;
	}


	public void setThisMonth(Double thisMonth) {
		this.thisMonth = thisMonth;
	}


	public Double getThisWeek() {
		return thisWeek;
	}


	public void setThisWeek(Double thisWeek) {
		this.thisWeek = thisWeek;
	}


	public Double getToday() {
		return today;
	}


	public void setToday(Double today) {
		this.today = today;
	}


	public Long getCompletedJobs() {
		return completedJobs;
	}


	public void setCompletedJobs(Long completedJobs) {
		this.completedJobs = completedJobs;
	}


	public Long getCancelledJobs() {
		return cancelledJobs;
	}


	public void setCancelledJobs(Long cancelledJobs) {
		this.cancelledJobs = cancelledJobs;
	}


	public List<MonthlyEarning> getMonthly() {
		return monthly;
	}


	public void setMonthly(List<MonthlyEarning> monthly) {
		this.monthly = monthly;
	}


	public List<EarningHistoryItem> getHistory() {
		return history;
	}


	public void setHistory(List<EarningHistoryItem> history) {
		this.history = history;
	}




	@Data
    @Builder
    public static class MonthlyEarning {
        private String month;
        private Double amount;
        
        //No-args constructor
        public MonthlyEarning() {}
        
        //constructor
        public MonthlyEarning(String month, Double amount) {
        	this.month=month;
        	this.amount=amount;
        }

		public String getMonth() {
			return month;
		}

		public void setMonth(String month) {
			this.month = month;
		}

		public Double getAmount() {
			return amount;
		}

		public void setAmount(Double amount) {
			this.amount = amount;
		}
        
    }

    @Data
    @Builder
    public static class EarningHistoryItem {
        private java.time.LocalDateTime earnedAt;
        private String customerName;
        private String service;
        private Double amount;
        private String paymentMethod;
        
        //no-args const
        public EarningHistoryItem() {}
        
		public EarningHistoryItem(LocalDateTime earnedAt, String customerName, String service, Double amount,
				String paymentMethod) {
			super();
			this.earnedAt = earnedAt;
			this.customerName = customerName;
			this.service = service;
			this.amount = amount;
			this.paymentMethod = paymentMethod;
		}

		public java.time.LocalDateTime getEarnedAt() {
			return earnedAt;
		}

		public void setEarnedAt(java.time.LocalDateTime earnedAt) {
			this.earnedAt = earnedAt;
		}

		public String getCustomerName() {
			return customerName;
		}

		public void setCustomerName(String customerName) {
			this.customerName = customerName;
		}

		public String getService() {
			return service;
		}

		public void setService(String service) {
			this.service = service;
		}

		public Double getAmount() {
			return amount;
		}

		public void setAmount(Double amount) {
			this.amount = amount;
		}

		public String getPaymentMethod() {
			return paymentMethod;
		}

		public void setPaymentMethod(String paymentMethod) {
			this.paymentMethod = paymentMethod;
		}
        
        
    }
}