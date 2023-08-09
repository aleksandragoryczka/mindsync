package com.project.mindsync.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.mindsync.exception.ResourceNotFoundException;
import com.project.mindsync.model.User;
import com.project.mindsync.security.UserPrincipal;

public interface UserRepository extends JpaRepository<User, Long> {
	boolean existsByEmail(String email);

	//Optional<User> findByUsername(String username);

	Optional<User> findByEmail(String email);

	//TODO: zmienić 3 na currentUser.getId()
	default User getUser(UserPrincipal currentUser) {
		return findById((long) 1)
				.orElseThrow(() -> new ResourceNotFoundException("User", "Id", currentUser.getId()));
	}
}
