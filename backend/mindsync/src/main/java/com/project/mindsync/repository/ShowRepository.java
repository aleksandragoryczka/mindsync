package com.project.mindsync.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.mindsync.model.Show;

public interface ShowRepository extends JpaRepository<Show, Long> {

	Page<Show> findByQuizId(Long quizId, Pageable pageable);

}
