package com.project.mindsync.model;

import com.project.mindsync.model.enums.RoleName;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
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
