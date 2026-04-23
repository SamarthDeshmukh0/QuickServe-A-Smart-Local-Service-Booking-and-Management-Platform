// ============================================================
// FILE: src/main/java/com/quickserve/dto/request/ProviderRegisterRequest.java
// ============================================================

package com.quickserve.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

//@Data
public class ProviderRegisterRequest {

    @NotBlank
    @Size(min = 3)
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number")
    private String phone;

    @NotBlank
    private String profession;

    @NotNull
    @Min(0) @Max(50)
    private Integer yearsExperience;

    @NotBlank
    private String city;

    @NotBlank
    @Size(min = 8)
    private String password;

    //constructor
	public ProviderRegisterRequest(@NotBlank @Size(min = 3) String name, @NotBlank @Email String email,
			@NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number") String phone,
			@NotBlank String profession, @NotNull @Min(0) @Max(50) Integer yearsExperience, @NotBlank String city,
			@NotBlank @Size(min = 8) String password) {
		super();
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.profession = profession;
		this.yearsExperience = yearsExperience;
		this.city = city;
		this.password = password;
		
		
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

	public String getProfession() {
		return profession;
	}

	public void setProfession(String profession) {
		this.profession = profession;
	}

	public Integer getYearsExperience() {
		return yearsExperience;
	}

	public void setYearsExperience(Integer yearsExperience) {
		this.yearsExperience = yearsExperience;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}