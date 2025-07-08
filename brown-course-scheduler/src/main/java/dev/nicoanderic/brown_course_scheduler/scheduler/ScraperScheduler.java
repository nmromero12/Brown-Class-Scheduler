package dev.nicoanderic.brown_course_scheduler.scheduler;

import dev.nicoanderic.brown_course_scheduler.service.CABService;
import dev.nicoanderic.brown_course_scheduler.service.ScraperService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled job that scrapes and fetches course information every 6 months.
 * Runs at 2:00 AM on January 1st and July 1st each year.
 */
@Component
public class ScraperScheduler {

  private final ScraperService scraperService;
  private final CABService cabService;

  public ScraperScheduler(ScraperService scraperService, CABService cabService) {
    this.scraperService = scraperService;
    this.cabService = cabService;
  }

  /**
   * Scrapes and fetches course data every 6 months.
   * Runs at 2:00 AM on January 1st and July 1st.
   */
  @Scheduled(cron = "0 0 2 1 1,7 *")
  public void runCourseSyncJob() {
    System.out.println("Running course sync job...");
    scraperService.scrape();
    cabService.fetchCourseInformation();
    System.out.println("Course sync job completed.");
  }
}
