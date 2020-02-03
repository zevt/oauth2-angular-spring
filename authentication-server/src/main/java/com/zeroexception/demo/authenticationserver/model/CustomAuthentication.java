package com.zeroexception.demo.authenticationserver.model;



import static com.zeroexception.demo.authenticationserver.model.Constants.GSON;

import java.util.Collection;
import java.util.Collections;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

@Getter
@Setter
@NoArgsConstructor
public class CustomAuthentication implements Authentication {
  private String tokenProvider;
  private String token;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.emptyList();
  }

  @Override
  public Object getCredentials() {
    return token;
  }

  @Override
  public Object getDetails() {
    return token;
  }

  @Override
  public Object getPrincipal() {
    return token;
  }

  @Override
  public boolean isAuthenticated() {
    return false;
  }

  @Override
  public void setAuthenticated(boolean b) throws IllegalArgumentException {

  }

  @Override
  public String getName() {
    return token;
  }

  @Override
  public String toString() {
    return GSON.toJson(this);
  }
}
