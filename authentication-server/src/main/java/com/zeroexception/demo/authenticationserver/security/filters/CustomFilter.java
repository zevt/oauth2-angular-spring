package com.zeroexception.demo.authenticationserver.security.filters;


import com.zeroexception.demo.authenticationserver.model.SocialUser;
import com.zeroexception.demo.authenticationserver.security.filters.authmanagers.GeneralAuthManager;
import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CustomFilter implements Filter {

  private GeneralAuthManager authManager;


  public CustomFilter(GeneralAuthManager authManager) {
    this.authManager = authManager;
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response,
      FilterChain filterChain) throws IOException, ServletException {


    HttpServletRequest httpServletRequest = (HttpServletRequest)request;
//    authentication.getPrincipal().toString() is a Bearer token
    SocialUser user = this.authManager.authenticate(httpServletRequest);
    if (user != null) {
      log.debug("SocialUser: {}", user);
      SecurityContextHolder.getContext().setAuthentication(user);
    } else {
      log.debug("SocialUser is null");
      SecurityContextHolder.clearContext();
    }

    filterChain.doFilter(request, response);
  }

}
