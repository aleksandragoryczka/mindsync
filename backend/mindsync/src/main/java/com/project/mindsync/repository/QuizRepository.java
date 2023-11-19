package com.project.mindsync.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.mindsync.model.Quiz;
import com.project.mindsync.model.User;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
	Page<Quiz> findByUserId(Long userId, Pageable pageable);

	Optional<Quiz> findByCode(String code);

	Long countByUser(User user);
}
