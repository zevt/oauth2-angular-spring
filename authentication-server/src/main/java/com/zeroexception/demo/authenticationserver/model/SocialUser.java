package com.zeroexception.demo.authenticationserver.model;

import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.Collections;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

@Getter
@Setter
@NoArgsConstructor
public class SocialUser implements Authentication {

  private String email;
  private String id;
  private String provider;
  private String lastName;
  private String firstName;
  private String name;
//  millisecond
  private long exp = 0;

  @Builder
  private SocialUser(String email, String id, String provider, String lastName,
      String firstName, String name, long exp) {
    this.email = email;
    this.id = id;
    this.provider = provider;
    this.lastName = lastName;
    this.firstName = firstName;
    this.name = name;
    this.exp = exp;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.emptyList();
  }

  @Override
  public Object getCredentials() {
    return null;
  }

  @Override
  public Object getDetails() {
    return null;
  }

  @Override
  public Object getPrincipal() {
    return null;
  }

  @Override
  public boolean isAuthenticated() {
    return this.exp > Instant.now().toEpochMilli();
  }

  @Override
  public void setAuthenticated(boolean b) throws IllegalArgumentException {
    if (b) {
      this.exp = Instant.now().plus(Duration.ofHours(2L)).toEpochMilli();
    } else {
      this.exp = 0;
    }
  }

}
