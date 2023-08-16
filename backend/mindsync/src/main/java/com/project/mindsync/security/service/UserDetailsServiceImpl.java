package com.project.mindsync.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.project.mindsync.model.User;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.security.UserPrincipal;

import jakarta.transaction.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	UserRepository userRepository;

	@Override
	@Transactional
	public UserPrincipal loadUserByUsername(String email) throws UsernameNotFoundException {
		//Finding by email, not username
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));
			
		return UserPrincipal.create(user);
	}

}
