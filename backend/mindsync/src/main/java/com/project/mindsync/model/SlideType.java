package com.project.mindsync.model;

import com.project.mindsync.model.enums.SlideTypeName;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "slide_types")
@Getter
@NoArgsConstructor
public class SlideType {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	private SlideTypeName name;

	public SlideType(SlideTypeName name) {
		this.name = name;
	}
}
