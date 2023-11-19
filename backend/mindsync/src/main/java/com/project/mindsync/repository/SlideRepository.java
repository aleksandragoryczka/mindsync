package com.project.mindsync.repository;

import org.springframework.data.domain.Pageable;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.mindsync.model.Slide;

public interface SlideRepository extends JpaRepository<Slide, Long> {
	Page<Slide> findByQuizId(Long quizId, Pageable pageable);

	List<Slide> findByQuizId(Long quizId);
}
