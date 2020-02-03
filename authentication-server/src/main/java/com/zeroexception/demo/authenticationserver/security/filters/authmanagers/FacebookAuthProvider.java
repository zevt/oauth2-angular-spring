package com.zeroexception.demo.authenticationserver.security.filters.authmanagers;


import static com.zeroexception.demo.authenticationserver.model.Constants.GSON;

import com.google.common.base.Charsets;
import com.google.common.hash.HashFunction;
import com.google.common.hash.Hashing;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.zeroexception.demo.authenticationserver.model.SocialUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * This class use Facebook Graph API to verify User information specified in fields.
 * https://developers.facebook.com/docs/graph-api/reference/user/ Possible permission for Facebook
 * login is below: https://developers.facebook.com/docs/facebook-login/permissions This
 * implementation uses secured Graph API Requests:
 * https://developers.facebook.com/docs/graph-api/securing-requests
 */
@Component
@Slf4j
public class FacebookAuthProvider implements AuthenticationProvider {

  private static final String graphUrl = "https://graph.facebook.com";
  private final HashFunction hashFunction;
  private final String clientSecret;
  private final String fields;
  private final RestTemplate rest = new RestTemplate();

  public FacebookAuthProvider(
      @Value("${facebook.clientSecret}") String clientSecret,
      @Value("${facebook.identity.fields}") String fields) {
    this.clientSecret = clientSecret;
    this.fields = fields;

    this.hashFunction = Hashing.hmacSha256(this.clientSecret.getBytes());
  }

  @Override
  public SocialUser authenticate(Authentication authentication) throws AuthenticationException {

    String accessToken = authentication.getPrincipal().toString();
    log.debug(accessToken);
    //    appsecret_proof
    String appSecretProof = hashFunction.hashString(accessToken, Charsets.UTF_8).toString();
    log.debug("appSecretProof: {}", appSecretProof);

    UriComponentsBuilder uriBuilder =
        UriComponentsBuilder.fromHttpUrl(graphUrl).path("me").queryParam("fields", fields)


        .queryParam(OAuth2AccessToken.ACCESS_TOKEN, accessToken)
        .queryParam("appsecret_proof", appSecretProof);

    UriComponents uriComponents = uriBuilder.build().encode(Charsets.UTF_8);

    String url = uriComponents.toUriString();

    HttpHeaders headers = new HttpHeaders();
    HttpEntity<String> httpEntity = new HttpEntity<>(headers);
    // TODO: Handling exception for the following call
    ResponseEntity<String> response = rest.exchange(url, HttpMethod.GET, httpEntity, String.class);

    String body = response.getBody();
    JsonObject json = GSON.fromJson(body, JsonObject.class);

    log.debug(json.toString());


    String id = valueOfJsonElement(json.get("id"));
    String name = valueOfJsonElement(json.get("name"));
    String firstName = valueOfJsonElement(json.get("first_name"));
    String lastName = valueOfJsonElement(json.get("last_name"));
    String email = valueOfJsonElement(json.get("email"));


    SocialUser user = SocialUser
        .builder()
        .provider("facebook")
        .id(id)
        .name(name)
        .email(email)
        .firstName(firstName)
        .lastName(lastName)
        .build();

    user.setAuthenticated(true);

    return user;
  }

  private String valueOfJsonElement(JsonElement element) {
    return element != null ? element.getAsString() : "";
  }
  @Override
  public boolean supports(Class<?> aClass) {
    return true;
  }
}
