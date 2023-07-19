package com.project.mindsync.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.mindsync.model.Slide;

public interface SlideRepository extends JpaRepository<Slide, Long> {
	Page<Slide> findByPresentationId(Long presentationId, Pageable pageable);
}
