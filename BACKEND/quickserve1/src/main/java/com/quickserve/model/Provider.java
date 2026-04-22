// ============================================================
// FILE: src/main/java/com/quickserve/model/Provider.java
// ============================================================

package com.quickserve.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "providers")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String profession;

    @Column(nullable = false)
    private String city;

    @Column(name = "years_experience")
    private Integer yearsExperience;

    @Column(name = "avg_rating")
    //@Builder.Default
    private Double avgRating = 0.0;

    @Column(name = "avg_response_mins")
    //@Builder.Default
    private Integer avgResponseMins = 30;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    //@Builder.Default
    private Status status = Status.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
   // No-args constructor
    public Provider() {}

    //  Constructor (exclude id + createdAt)
    public Provider(String name, String email, String phone,
                    String profession, String city, Integer yearsExperience,
                    String password, Status status) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.profession = profession;
        this.city = city;
        this.yearsExperience = yearsExperience;
        this.password = password;
        this.status = status;
    }
    
    //GETTERS/SETTERS...
    
    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Integer getYearsExperience() { return yearsExperience; }
    public void setYearsExperience(Integer yearsExperience) { this.yearsExperience = yearsExperience; }

    public Double getAvgRating() { return avgRating; }
    public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }

    public Integer getAvgResponseMins() { return avgResponseMins; }
    public void setAvgResponseMins(Integer avgResponseMins) { this.avgResponseMins = avgResponseMins; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    	//auti timestamp...
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}