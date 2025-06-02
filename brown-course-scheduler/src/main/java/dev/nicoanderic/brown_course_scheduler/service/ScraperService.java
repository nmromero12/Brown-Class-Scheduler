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

  /**
   * Initializes the ScraperService with a ChromeDriver instance.
   * The courses list is also initialized to store scraped course data.
   *
   * @param driver ChromeDriver instance used for web scraping
   */
  public ScraperService(ChromeDriver driver) {
    this.driver = driver;
    this.courses = new ArrayList<>();
  }

  /**
   * Lifecycle hook that runs after the service is constructed.
   * Currently used to indicate readiness via console output.
   */
  @PostConstruct
  void postConstruct() {
    // scrape(); // Disabled for now
    System.out.println("done!");
    // System.out.println(courses.size());
  }

  /**
   * Performs the actual scraping of the Brown University course catalog website.
   * Navigates to the URL, clicks the search button to load results, and
   * parses course data from the page.
   * Extracts course code, CRN numbers, and semester info for each course found
   * and stores them in the courses list.
   */
  public void scrape() {
    driver.get(URL);
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

    // Wait for and click the search button to load courses
    WebElement button = wait.until(ExpectedConditions.elementToBeClickable(By.id("search-button")));
    button.click();

    // Wait for course result elements to appear
    List<WebElement> courseElements = wait.until(
        ExpectedConditions.visibilityOfAllElementsLocatedBy(
            By.className("result__link")
        ));

    // Extract data for each course and add to courses list
    for (WebElement course : courseElements) {
      String courseCode = course.getAttribute("data-group");
      String cleanedCode = courseCode.replace("code", ""); // Clean course code string
      String crn = course.getAttribute("data-matched");
      String semester = course.getAttribute("data-srcdb");

      // Split multiple CRNs if present
      List<String> crnList = Arrays.stream(crn.split(":")[1].split(","))
          .collect(Collectors.toList());

      for (String crnElement : crnList) {
        courses.add(new ScrapeCourse(cleanedCode, crnElement, semester));
      }
    }
  }

  /**
   * Returns the list of scraped courses.
   *
   * @return an ArrayList of ScrapeCourse objects containing course info
   */
  public ArrayList<ScrapeCourse> getCourses() {
    return courses;
  }
}
