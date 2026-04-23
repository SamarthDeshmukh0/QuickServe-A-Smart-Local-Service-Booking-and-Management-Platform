package com.quickserve;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Quickserve1Application {

	public static void main(String[] args) {
		SpringApplication.run(Quickserve1Application.class, args);
	}

}
