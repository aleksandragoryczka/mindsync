package com.project.mindsync.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.mindsync.model.SlideType;
import com.project.mindsync.model.enums.SlideTypeName;

public interface SlideTypeRepository extends JpaRepository<SlideType, Long> {
	SlideType findByName(SlideTypeName slideTypeName);

}
