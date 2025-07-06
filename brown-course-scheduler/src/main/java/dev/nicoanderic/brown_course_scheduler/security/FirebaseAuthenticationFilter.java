package dev.nicoanderic.brown_course_scheduler.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;
import java.util.Collections;


@Component
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    String header = request.getHeader("Authorization");

    if (header == null || !header.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    String token = header.substring(7);

    try {
      FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
      // You can get user info from decodedToken if you want
      String uid = decodedToken.getUid();

      UsernamePasswordAuthenticationToken authentication =
          new UsernamePasswordAuthenticationToken(uid, null, Collections.emptyList());
      SecurityContextHolder.getContext().setAuthentication(authentication);

    } catch (Exception e) {
      // Invalid token
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.getWriter().write("Unauthorized: Invalid or expired token");
      return;
    }

    filterChain.doFilter(request, response);
  }
}

