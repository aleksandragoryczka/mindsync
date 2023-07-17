package com.project.mindsync.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.User;
import com.project.mindsync.security.UserPrincipal;

@Repository
public interface PresentationRepository extends JpaRepository<Presentation, Long> {
	Page<Presentation> findByUserId(Long userId, Pageable pageable);
}
