package com.project.mindsync.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.mindsync.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	boolean existsByUsername(String username);

	boolean existsByEmail(String email);
}
