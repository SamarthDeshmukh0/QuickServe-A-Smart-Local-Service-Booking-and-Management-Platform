// ============================================================
// FILE: src/main/java/com/quickserve/dto/request/CustomerRegisterRequest.java
// ============================================================

package com.quickserve.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

//@Data
public class CustomerRegisterRequest {

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
    private String city;

    @NotBlank
    @Size(min = 8)
    private String password;
    
    public CustomerRegisterRequest() {}
    public CustomerRegisterRequest(String name, 
    								String email,
    								String phone,
    								String city,
    								String password) {
    	
		    	this.name=name;
		    	this.email=email;
		    	this.phone=phone;
		    	this.city=city;
		    	this.password=password;
    }

  //getters/setters
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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
    
    
    
}