package com.project.mindsync.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.User;

public interface PresentationRepository extends JpaRepository<Presentation, Long> {
	Page<Presentation> findByUserId(Long userId, Pageable pageable);

	Optional<Presentation> findByCode(String code);

	Long countByUser(User user);
}
