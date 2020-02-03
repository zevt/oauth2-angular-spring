package com.zeroexception.demo.authenticationserver.security.filters.authmanagers;

import com.zeroexception.demo.authenticationserver.model.CustomAuthentication;
import com.zeroexception.demo.authenticationserver.model.SocialUser;
import com.zeroexception.demo.authenticationserver.security.filters.CustomHeaderExtractor;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class GeneralAuthManager {

  private GoogleAuthProvider googleAuthProvider;
  private FacebookAuthProvider facebookAuthProvider;
  private CustomHeaderExtractor headerExtractor;

  public GeneralAuthManager(
      GoogleAuthProvider googleAuthProvider,
      FacebookAuthProvider facebookAuthProvider,
      CustomHeaderExtractor headerExtractor) {
    this.googleAuthProvider = googleAuthProvider;
    this.facebookAuthProvider = facebookAuthProvider;
    this.headerExtractor = headerExtractor;
  }

  public SocialUser authenticate(HttpServletRequest request) {

    CustomAuthentication authentication = headerExtractor.extract(request);

    if (authentication != null) {
      log.debug("authentication: {}", authentication);
      String provider = authentication.getTokenProvider().toLowerCase();
      switch (provider) {
        case "google":
          log.debug("Provider {}", "Google");
          return this.googleAuthProvider.authenticate(authentication);
        case "facebook":
          log.debug("Provider {}", "facebook");
          return this.facebookAuthProvider.authenticate(authentication);
        case "custom":
          log.debug("Provider {}", "Custom");
          break;
      }
    }

    return null;
  }

}
