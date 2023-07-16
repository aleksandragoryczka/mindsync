package com.project.mindsync.security;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

@AuthenticationPrincipal
public @interface CurrentUser {
}
