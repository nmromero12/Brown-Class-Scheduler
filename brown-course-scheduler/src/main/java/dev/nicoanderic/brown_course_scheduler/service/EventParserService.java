package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.model.EventRequest;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.HashMap;

/**
 * Service responsible for parsing user-supplied time/location strings into
 * well-structured event information with recurrence and timezone-aware timestamps.
 */
public class EventParserService {

  /**
   * Parses a raw EventRequest into a detailed EventRequest with ISO-formatted start/end times
   * and an RRULE-based recurrence string.
   *
   * @param eventRequest The original event request containing a raw time/location string
   * @return A new EventRequest object with populated recurrence and time fields
   */
  public EventRequest parse(EventRequest eventRequest) {
    // Mapping for converting shorthand days to RRULE format
    HashMap<String, String> recurrenceMap = new HashMap<>();
    recurrenceMap.put("M", "MO");
    recurrenceMap.put("W", "WE");
    recurrenceMap.put("T", "TU");
    recurrenceMap.put("Th", "TH");
    recurrenceMap.put("F", "FR");
    recurrenceMap.put("S", "SA");

    // Mapping for converting shorthand days to java.time.DayOfWeek
    HashMap<String, DayOfWeek> days = new HashMap<>();
    days.put("M", DayOfWeek.MONDAY);
    days.put("T", DayOfWeek.TUESDAY);
    days.put("W", DayOfWeek.WEDNESDAY);
    days.put("TH", DayOfWeek.THURSDAY);
    days.put("F", DayOfWeek.FRIDAY);
    days.put("S", DayOfWeek.SATURDAY);

    String recurrenceRelation = "RRULE:FREQ=WEEKLY;BYDAY=";

    // Extract timing details from the input string
    String timeLocation = eventRequest.getParseTime();
    String startDay = timeLocation.charAt(0) + "";
    String[] timeLocationSplit = timeLocation.split(" ");
    String dayString = timeLocationSplit[0];
    String timeString = timeLocationSplit[1];
    String[] timeSplit = timeString.split("-");
    String startTime = timeSplit[0];
    String endTime = timeSplit[1];

    // Find the next date matching the specified day of week
    LocalDate localDate = LocalDate.now();
    DayOfWeek dayOfWeek = localDate.getDayOfWeek();
    while (!days.get(startDay).equals(dayOfWeek)) {
      localDate = localDate.plusDays(1);
      dayOfWeek = localDate.getDayOfWeek();
    }

    // Set up formatter to parse times like "2pm" or "2:50pm"
    DateTimeFormatter timeFormatter = new DateTimeFormatterBuilder()
        .parseCaseInsensitive()
        .appendPattern("h[:mm]a")
        .toFormatter();

    // Convert times to LocalTime objects
    LocalTime startLocalTime = LocalTime.parse(startTime.toLowerCase(), timeFormatter);
    LocalTime endLocalTime = LocalTime.parse(endTime.toLowerCase(), timeFormatter);

    // Convert to ZonedDateTime with Eastern Timezone
    ZoneId zoneId = ZoneId.of("America/New_York");
    ZonedDateTime startZonedDateTime = ZonedDateTime.of(localDate, startLocalTime, zoneId);
    ZonedDateTime endZonedDateTime = ZonedDateTime.of(localDate, endLocalTime, zoneId);

    // Format times to ISO 8601 with offset
    DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
    String formattedStartTime = startZonedDateTime.format(isoFormatter);
    String formattedEndTime = endZonedDateTime.format(isoFormatter);

    // Build RRULE BYDAY clause based on which days are present
    if (dayString.contains("M")) {
      recurrenceRelation += recurrenceMap.get("M") + ",";
    }
    if (dayString.contains("W")) {
      recurrenceRelation += recurrenceMap.get("W") + ",";
    }
    if (dayString.contains("T")) {
      recurrenceRelation += recurrenceMap.get("T") + ",";
    }
    if (dayString.contains("Th")) {
      recurrenceRelation += recurrenceMap.get("Th") + ",";
    }
    if (dayString.contains("F")) {
      recurrenceRelation += recurrenceMap.get("F") + ",";
    }

    // Remove the trailing comma
    recurrenceRelation = recurrenceRelation.substring(0, recurrenceRelation.length() - 1);

    // Return new EventRequest with updated fields
    return new EventRequest(
        eventRequest.getSummary(),
        eventRequest.getDescription(),
        eventRequest.getParseTime(),
        recurrenceRelation,
        formattedStartTime,
        formattedEndTime,
        eventRequest.getUserId()
    );
  }
}
