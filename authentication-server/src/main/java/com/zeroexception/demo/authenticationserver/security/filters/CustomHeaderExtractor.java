package com.zeroexception.demo.authenticationserver.security.filters;


import com.zeroexception.demo.authenticationserver.model.CustomAuthentication;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.provider.authentication.TokenExtractor;
import org.springframework.stereotype.Component;

@Component
public class CustomHeaderExtractor {

  private TokenExtractor tokenExtractor;

  @Autowired
  public CustomHeaderExtractor(
      TokenExtractor tokenExtractor) {
    this.tokenExtractor = tokenExtractor;
  }

  public CustomAuthentication extract(HttpServletRequest request) {

    Authentication authentication = this.tokenExtractor.extract(request);
    if (authentication != null) {
      CustomAuthentication lbAuth = new CustomAuthentication();
      lbAuth.setToken(authentication.getPrincipal().toString());
      lbAuth.setTokenProvider(request.getHeader("TokenProvider"));
      return lbAuth;
    } else {
      return null;
    }

  }

}
