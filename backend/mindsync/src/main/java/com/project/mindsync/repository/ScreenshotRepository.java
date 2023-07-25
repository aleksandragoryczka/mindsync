package com.project.mindsync.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.mindsync.model.Screenshot;

public interface ScreenshotRepository extends JpaRepository<Screenshot, Long> {

	Page<Screenshot> findByShowId(Long showId, Pageable pageable);

}
