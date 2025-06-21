package com.vaikrochat.backend.filter;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.web.filter.OncePerRequestFilter;

import com.vaikrochat.backend.service.JwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
    HttpServletResponse response, 
    FilterChain filterChain) throws ServletException, IOException {
        System.out.println("FILTER RUNNING!");

        if (request.getRequestURI().startsWith("/auth/")
        || request.getRequestURI().startsWith("/ws")
        || request.getRequestURI().startsWith("/uploads")) {
        filterChain.doFilter(request, response);
        return;
    }
        String authHeader = request.getHeader("Authorization");

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, authHeader);
            return;
        }

        try {
            String jwt = authHeader.substring(7);
            if(jwt.equals("null")) {  // Check for "null" string
                sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return;
            }

            String username = jwtService.extractUsername(jwt);
            if(username != null && !jwtService.isTokenExpired(jwt)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    username, null, Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                filterChain.doFilter(request, response);
            } else {
                sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Token expired or invalid");
            }
        } catch(Exception e) {
            e.printStackTrace();
            SecurityContextHolder.clearContext();
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
        }
    }
    private void sendError(HttpServletResponse response, int status, String message) throws IOException{
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format("{\"error\": \"%s\"}", message));
    }
    
}
