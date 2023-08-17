package com.project.mindsync.model;

import com.project.mindsync.model.enums.RoleName;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@NoArgsConstructor
@Data
public class Role {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(length = 60)
	private RoleName name;

	public Role(RoleName name) {
		this.name = name;
	}
}
