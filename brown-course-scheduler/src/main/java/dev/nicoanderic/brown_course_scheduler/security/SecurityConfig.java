package dev.nicoanderic.brown_course_scheduler.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

  private final FirebaseAuthenticationFilter firebaseAuthenticationFilter;

  public SecurityConfig(FirebaseAuthenticationFilter firebaseAuthenticationFilter) {
    this.firebaseAuthenticationFilter = firebaseAuthenticationFilter;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Apply CORS configuration here
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/cart/**").authenticated() // Require authentication for cart endpoints
            .requestMatchers("/api/**").authenticated() // Require authentication for API endpoints
            .anyRequest().permitAll() // Allow other requests without authentication
        )
        .addFilterBefore(firebaseAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(
        "http://localhost:5173",  // Local frontend
        "https://brown-class-scheduler-198ff.web.app",  // Another frontend
        "https://browncoursescheduler.app",
        "https://www.browncoursescheduler.app"// Production frontend
    ));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    config.setAllowCredentials(true);  // Allow credentials like cookies or tokens

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);  // Apply to all endpoints
    return source;
  }
}
