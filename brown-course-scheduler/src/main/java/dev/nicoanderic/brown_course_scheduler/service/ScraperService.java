package dev.nicoanderic.brown_course_scheduler.service;


import dev.nicoanderic.brown_course_scheduler.model.ScrapeCourse;
import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

@Service
public class ScraperService {

  private static final String URL = "https://cab.brown.edu";
  private final ChromeDriver driver;
  private final ArrayList<ScrapeCourse> courses;

  public ScraperService(ChromeDriver driver) {
    this.driver = driver;
    this.courses = new ArrayList<>();
  }

  @PostConstruct
  void postConstruct() {
    scrape();
    System.out.println("done!");
    System.out.println(courses.size());
  }

  public void scrape() {
    driver.get(URL);
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    WebElement button = wait.until(ExpectedConditions.elementToBeClickable(By.id("search-button")));
    button.click();
    List<WebElement> courseElements = wait.until(
        ExpectedConditions.visibilityOfAllElementsLocatedBy(
            By.className("result__link")
        ));
    for (WebElement course : courseElements) {
      String courseCode = course.getAttribute("data-group");
      String cleanedCode = courseCode.replace("code", "");// Extract course code
      String crn = course.getAttribute("data-matched");
      String semester = course.getAttribute("data-srcdb");
      List<String> crnList = Arrays.stream(crn.split(":")[1].split(","))
          .collect(Collectors.toList());

      for (String crnElement : crnList) {
        courses.add(new ScrapeCourse(cleanedCode, crnElement, semester));


      }
    }




  }
  public ArrayList<ScrapeCourse> getCourses () {

    return courses;
  }


}





