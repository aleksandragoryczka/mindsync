package com.project.mindsync.security.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.project.mindsync.security.UserPrincipal;

public interface UserDetailsService {
	UserPrincipal loadUserByUsername(String username) throws UsernameNotFoundException;
}
