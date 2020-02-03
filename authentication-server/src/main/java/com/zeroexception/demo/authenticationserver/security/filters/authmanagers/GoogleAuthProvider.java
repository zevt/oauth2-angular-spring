package com.zeroexception.demo.authenticationserver.security.filters.authmanagers;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.zeroexception.demo.authenticationserver.model.SocialUser;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
@Primary
@Slf4j
public class GoogleAuthProvider implements AuthenticationProvider {


//  private String clientSecret;
  private List<String> clientIdList;
  private GoogleIdTokenVerifier tokenVerifier;

  public GoogleAuthProvider(@Value("${google.clientIds}") List<String> clientIdList) {
    this.clientIdList = clientIdList;
    this.tokenVerifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), JacksonFactory
        .getDefaultInstance())
        .setAudience(this.clientIdList)
        .build();

  }

  @Override
  public SocialUser authenticate(Authentication authentication) throws AuthenticationException {
    String token = authentication.getPrincipal().toString();

    try {

      GoogleIdToken idToken = this.tokenVerifier.verify(token);

      if (idToken != null) {
        GoogleIdToken.Payload payload = idToken.getPayload();

        return SocialUser.builder()
            .provider("google")
            .id(payload.getSubject())
            .email(payload.getEmail())
            .exp(payload.getExpirationTimeSeconds() * 1000)
            .firstName((String) payload.getOrDefault("given_name", ""))
            .lastName((String) payload.getOrDefault("family_name", ""))
            .name((String) payload.getOrDefault("name",""))
            .build();

      } else {
        log.debug(" Token is not valid ");
        return null;
      }
    } catch ( IOException | GeneralSecurityException e) {
      e.printStackTrace();
      return null;
    }

  }

  @Override
  public boolean supports(Class<?> aClass) {
    return true;
  }
}
