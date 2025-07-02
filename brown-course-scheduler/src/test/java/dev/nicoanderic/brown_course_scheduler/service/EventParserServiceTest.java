package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.dto.ParsedEventDto;
import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class EventParserServiceTest {

  private EventParserService parserService;

  @BeforeEach
  void setUp() {
    parserService = new EventParserService();
  }

  @Test
  void parseClassTime_basicSingleDay() {
    CartItem item = new CartItem();
    item.setClassTime("M 10am-11am Room101");
    item.setCourseName("Intro to Testing");
    item.setSection("001");

    ParsedEventDto event = parserService.parseClassTime(item);

    assertEquals("100000", event.getStartTime());
    assertEquals("110000", event.getEndTime());
    assertEquals(List.of("MO"), event.getDays());
    assertEquals("Room101", event.getLocation());
    assertEquals("Intro to Testing 001", event.getDescription());
    assertTrue(event.getRecurrence().contains("BYDAY=MO"));
    assertEquals("01:00", event.getDuration());
  }

  @Test
  void parseClassTime_multipleDaysIncludingTh() {
    CartItem item = new CartItem();
    item.setClassTime("MWTh 9:30am-10:45am ScienceHall");
    item.setCourseName("Science 101");
    item.setSection("002");

    ParsedEventDto event = parserService.parseClassTime(item);

    assertEquals("093000", event.getStartTime());
    assertEquals("104500", event.getEndTime());
    assertEquals(List.of("MO", "WE", "TH"), event.getDays());
    assertEquals("ScienceHall", event.getLocation());
    assertEquals("Science 101 002", event.getDescription());
    assertTrue(event.getRecurrence().contains("BYDAY=MO,WE,TH"));
    assertEquals("01:15", event.getDuration());
  }

  @Test
  void parseClassTime_pmTimeConversion() {
    CartItem item = new CartItem();
    item.setClassTime("F 12pm-1pm Gym");
    item.setCourseName("PE");
    item.setSection("003");

    ParsedEventDto event = parserService.parseClassTime(item);

    assertEquals("120000", event.getStartTime());
    assertEquals("130000", event.getEndTime());
    assertEquals(List.of("FR"), event.getDays());
    assertEquals("Gym", event.getLocation());
    assertEquals("PE 003", event.getDescription());
    assertTrue(event.getRecurrence().contains("BYDAY=FR"));
    assertEquals("01:00", event.getDuration());
  }

  @Test
  void parseClassTime_12amEdgeCase() {
    CartItem item = new CartItem();
    item.setClassTime("T 12am-1am Library");
    item.setCourseName("Midnight Studies");
    item.setSection("004");

    ParsedEventDto event = parserService.parseClassTime(item);

    assertEquals("000000", event.getStartTime());
    assertEquals("010000", event.getEndTime());
    assertEquals(List.of("TU"), event.getDays());
    assertEquals("Library", event.getLocation());
    assertEquals("Midnight Studies 004", event.getDescription());
    assertTrue(event.getRecurrence().contains("BYDAY=TU"));
    assertEquals("01:00", event.getDuration());
  }

  @Test
  void parseClassTime_noLocationProvided_defaultsToTBD() {
    CartItem item = new CartItem();
    item.setClassTime("W 3pm-4pm");
    item.setCourseName("Afternoon Class");
    item.setSection("005");

    ParsedEventDto event = parserService.parseClassTime(item);

    assertEquals("150000", event.getStartTime());
    assertEquals("160000", event.getEndTime());
    assertEquals(List.of("WE"), event.getDays());
    assertEquals("TBD", event.getLocation());
    assertEquals("Afternoon Class 005", event.getDescription());
    assertTrue(event.getRecurrence().contains("BYDAY=WE"));
    assertEquals("01:00", event.getDuration());
  }

  @Test
  void parseClassTime_invalidFormat_throwsException() {
    CartItem item = new CartItem();
    item.setClassTime("InvalidFormat123");
    item.setCourseName("Error Course");
    item.setSection("999");

    IllegalArgumentException thrown = assertThrows(
        IllegalArgumentException.class,
        () -> parserService.parseClassTime(item),
        "Expected parseClassTime() to throw, but it didn't"
    );

    assertTrue(thrown.getMessage().contains("Invalid classTime format"));
  }

  @Test
  void buildRecurrence_correctFormat() {
    List<String> days = List.of("MO", "WE", "FR");
    String recurrence = parserService.buildRecurrence(days);
    assertTrue(recurrence.startsWith("FREQ=WEEKLY"));
    assertTrue(recurrence.contains("BYDAY=MO,WE,FR"));
    assertTrue(recurrence.contains("UNTIL=20251212T235959Z"));
  }
}
