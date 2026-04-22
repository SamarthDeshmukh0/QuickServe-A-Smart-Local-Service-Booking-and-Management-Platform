// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/AuthResponse.java
// ============================================================

package com.quickserve.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserInfo user;

    public AuthResponse() {}
    //constructor
public AuthResponse(String token, UserInfo user) {
		super();
		this.token = token;
		this.user = user;
	}

//getter/setters
public String getToken() {
	return token;
}

public void setToken(String token) {
	this.token = token;
}

public UserInfo getUser() {
	return user;
}

public void setUser(UserInfo user) {
	this.user = user;
}


    public static class UserInfo {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String city;
        private String role;
        private String profession;
        private String status;
        private Double avgRating;
        private Integer yearsExperience;
        
        public UserInfo() {}
        
        //constructor.
        public UserInfo(Long id,
         String name,
         String email,
         String phone,
         String city,
         String role,
         String profession,
         String status,
         Double avgRating,
         Integer yearsExperience) {
        	
        	this.name=name;
        	this.email=email;
        	this.phone=phone;
        	this.city=city;
        	this.role=role;
        	this.profession=profession;
        	this.status=status;
        	this.avgRating=avgRating;
        	this.yearsExperience=yearsExperience;
        	
        }

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		public String getPhone() {
			return phone;
		}

		public void setPhone(String phone) {
			this.phone = phone;
		}

		public String getCity() {
			return city;
		}

		public void setCity(String city) {
			this.city = city;
		}

		public String getRole() {
			return role;
		}

		public void setRole(String role) {
			this.role = role;
		}

		public String getProfession() {
			return profession;
		}

		public void setProfession(String profession) {
			this.profession = profession;
		}

		public String getStatus() {
			return status;
		}

		public void setStatus(String status) {
			this.status = status;
		}

		public Double getAvgRating() {
			return avgRating;
		}

		public void setAvgRating(Double avgRating) {
			this.avgRating = avgRating;
		}

		public Integer getYearsExperience() {
			return yearsExperience;
		}

		public void setYearsExperience(Integer yearsExperience) {
			this.yearsExperience = yearsExperience;
		}
    }
}