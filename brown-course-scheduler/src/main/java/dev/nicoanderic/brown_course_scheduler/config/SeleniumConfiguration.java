package dev.nicoanderic.brown_course_scheduler.config;

import jakarta.annotation.PostConstruct;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeleniumConfiguration {
//  @PostConstruct
//  void postConstruct() {
//    System.setProperty("webdriver.chrome.driver", "/home/nromero/chromedriver-linux64/chromedriver");
//  }
  @Bean
  public ChromeDriver driver()
  {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--headless=new");
    return new ChromeDriver(options);
  }

}
