package dev.nicoanderic.brown_course_scheduler.controller;

import dev.nicoanderic.brown_course_scheduler.model.ScrapeCourse;
import dev.nicoanderic.brown_course_scheduler.service.ScraperService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller that provides endpoints related to course scraping.
 * Maps requests under "/api/scraper".
 */
@RestController
@RequestMapping("/api/scraper")
public class ScraperController {

  private final ScraperService scraperService;

  /**
   * Constructs the controller with a ScraperService dependency.
   *
   * @param scraperService the service responsible for scraping course data
   */
  public ScraperController(ScraperService scraperService) {
    this.scraperService = scraperService;
  }

  /**
   * Endpoint to retrieve the list of scraped courses.
   *
   * @return a list of ScrapeCourse objects fetched from the scraper service
   */
  @GetMapping("/courses")
  public List<ScrapeCourse> getCourses() {
    return scraperService.getCourses();
  }
}
