package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.dto.ParsedEventDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.DayOfWeek;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class IcsServiceTest {

  private IcsService icsService;

  @BeforeEach
  void setUp() {
    icsService = new IcsService();
  }

  @Test
  void convertToDayOfWeek_validInputs() {
    assertEquals(DayOfWeek.MONDAY, icsService.convertToDayOfWeek("MO"));
    assertEquals(DayOfWeek.TUESDAY, icsService.convertToDayOfWeek("TU"));
    assertEquals(DayOfWeek.WEDNESDAY, icsService.convertToDayOfWeek("WE"));
    assertEquals(DayOfWeek.THURSDAY, icsService.convertToDayOfWeek("TH"));
    assertEquals(DayOfWeek.FRIDAY, icsService.convertToDayOfWeek("FR"));
    assertEquals(DayOfWeek.SATURDAY, icsService.convertToDayOfWeek("SA"));
    assertEquals(DayOfWeek.SUNDAY, icsService.convertToDayOfWeek("SU"));
  }

  @Test
  void convertToDayOfWeek_invalidInput_throwsException() {
    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
      icsService.convertToDayOfWeek("XX");
    });
    assertTrue(exception.getMessage().contains("Invalid day string"));
  }

  @Test
  void convertToIcs_generatesValidCalendarEntry() {
    ParsedEventDto event = new ParsedEventDto(
        "150000", // 3:00 PM
        "161500", // 4:15 PM
        List.of("MO", "WE"),
        "MacMillan 115",
        "CSCI 1010 A",
        "FREQ=WEEKLY;BYDAY=MO,WE;UNTIL=20251212T235959Z",
        "01:15"
    );

    String ics = icsService.convertToIcs(List.of(event));
    assertTrue(ics.contains("BEGIN:VCALENDAR"));
    assertTrue(ics.contains("BEGIN:VEVENT"));
    assertTrue(ics.contains("SUMMARY:CSCI 1010 A"));
    assertTrue(ics.contains("LOCATION:MacMillan 115"));
    assertTrue(ics.contains("RRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL="));
    assertTrue(ics.contains("RRULE:FREQ=WEEKLY;BYDAY=WE;UNTIL="));
    assertTrue(ics.contains("END:VEVENT"));
    assertTrue(ics.contains("END:VCALENDAR"));
  }

  @Test
  void escapeText_handlesSpecialCharacters() {
    String raw = "Room 100, 2nd Floor; Notes:\nBring laptop \\ charger";
    String escaped = icsService.convertToIcs(List.of(new ParsedEventDto(
        "090000", "100000", List.of("TU"), raw, "Test Summary", "RRULE", "01:00"
    )));

    assertTrue(escaped.contains("Room 100\\, 2nd Floor\\; Notes:\\nBring laptop \\\\ charger"));
  }

  @Test
  void getFirstEventDateTime_returnsCorrectDate() {
    String time = "090000"; // 9:00 AM

    String monday = icsService.getFirstEventDateTime(time, DayOfWeek.MONDAY);
    assertEquals("20250908T090000", monday); // 2025-09-08 is the first Monday on/after Sept 3

    String wednesday = icsService.getFirstEventDateTime(time, DayOfWeek.WEDNESDAY);
    assertEquals("20250903T090000", wednesday); // Sept 3, 2025 is a Wednesday
  }

  @Test
  void convertToIcs_multipleEvents() {
    ParsedEventDto event1 = new ParsedEventDto("090000", "100000", List.of("MO"), "Room A", "Math 101", "", "01:00");
    ParsedEventDto event2 = new ParsedEventDto("110000", "121500", List.of("FR"), "Room B", "History 202", "", "01:15");

    String ics = icsService.convertToIcs(List.of(event1, event2));

    assertTrue(ics.contains("SUMMARY:Math 101"));
    assertTrue(ics.contains("SUMMARY:History 202"));
    assertTrue(ics.contains("BYDAY=MO"));
    assertTrue(ics.contains("BYDAY=FR"));
  }
}
