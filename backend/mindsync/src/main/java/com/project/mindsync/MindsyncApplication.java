package com.project.mindsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class MindsyncApplication {
	public static void main(String[] args) {
		SpringApplication.run(MindsyncApplication.class, args);
	}
}
