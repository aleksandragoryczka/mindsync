package com.project.mindsync.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.service.SlideService;

@RestController
@RequestMapping("/api/slide")
public class SlideController {
	@Autowired
	private SlideService slideService;
}
