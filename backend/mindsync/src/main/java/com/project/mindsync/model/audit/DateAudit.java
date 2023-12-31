package com.project.mindsync.model.audit;

import java.io.Serializable;
import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@MappedSuperclass
@Data
@EntityListeners(AuditingEntityListener.class)
public abstract class DateAudit implements Serializable {
	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;
	
}
