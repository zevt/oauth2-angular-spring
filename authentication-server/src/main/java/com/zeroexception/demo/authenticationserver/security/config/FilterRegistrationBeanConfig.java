package com.zeroexception.demo.authenticationserver.security.config;

import com.zeroexception.demo.authenticationserver.security.filters.CustomFilter;
import javax.servlet.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * This FilterRegistrationBeanConfig to ensure that each filter is called only once for each incoming request
 */

@Configuration
public class FilterRegistrationBeanConfig {

  private CustomFilter customFilter;

  @Autowired
  public FilterRegistrationBeanConfig(
      CustomFilter customFilter) {
    this.customFilter = customFilter;
  }

  @Bean(name = "CustomFilterRegistration")
  public FilterRegistrationBean customFilterRegistration(){
    return filterRegistrationBean(customFilter);
  }

  private FilterRegistrationBean filterRegistrationBean(Filter filter) {
    final FilterRegistrationBean registrationBean = new FilterRegistrationBean();
    registrationBean.setFilter(filter);
    registrationBean.addUrlPatterns("/*");
    registrationBean.setEnabled(false);
    return registrationBean;
  }
  
}
