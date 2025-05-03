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

public class EventParserService {


  public EventRequest parse(EventRequest eventRequest) {
    HashMap<String, String> recurrenceMap = new HashMap<>();
    recurrenceMap.put("M", "MO");
    recurrenceMap.put("W", "WE");
    recurrenceMap.put("T", "TU");
    recurrenceMap.put("Th", "TH");
    recurrenceMap.put("F", "FR");
    recurrenceMap.put("S", "SA");
    HashMap<String, DayOfWeek> days = new HashMap<>();
    days.put("M", DayOfWeek.MONDAY);
    days.put("T", DayOfWeek.TUESDAY);
    days.put("W", DayOfWeek.WEDNESDAY);
    days.put("TH", DayOfWeek.THURSDAY);
    days.put("F", DayOfWeek.FRIDAY);
    days.put("S", DayOfWeek.SATURDAY);
    String recurrenceRelation = "RRULE:FREQ=WEEKLY;BYDAY=";
    String timeLocation = eventRequest.getParseTime();
    String startDay = timeLocation.charAt(0) + "";
    String[] timeLocationSplit = timeLocation.split(" ");
    String dayString = timeLocationSplit[0];
    String timeString = timeLocationSplit[1];
    String[] timeSplit = timeString.split("-");
    String startTime = timeSplit[0];
    String endTime = timeSplit[1];

    LocalDate localDate = LocalDate.now();
    DayOfWeek dayOfWeek = localDate.getDayOfWeek();

    while (!days.get(startDay).equals(dayOfWeek)) {
      localDate = localDate.plusDays(1);
      dayOfWeek = localDate.getDayOfWeek();
    }


    DateTimeFormatter timeFormatter = new DateTimeFormatterBuilder()
        .parseCaseInsensitive() // Handle "PM" or "pm"
        .appendPattern("h[:mm]a") // Primary pattern for "2pm" or "2:50pm"
        .toFormatter();

    LocalTime startLocalTime = LocalTime.parse(startTime.toLowerCase(), timeFormatter);
    LocalTime endLocalTime = LocalTime.parse(endTime.toLowerCase(), timeFormatter);

    ZoneId zoneId = ZoneId.of("America/New_York");
    ZonedDateTime startZonedDateTime = ZonedDateTime.of(localDate, startLocalTime, zoneId);
    ZonedDateTime endZonedDateTime = ZonedDateTime.of(localDate, endLocalTime, zoneId);

    DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
    String formattedStartTime = startZonedDateTime.format(isoFormatter); // e.g., "2025-05-02T14:00:00-05:00"
    String formattedEndTime = endZonedDateTime.format(isoFormatter);



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

    // Remove trailing comma
    recurrenceRelation = recurrenceRelation.substring(0, recurrenceRelation.length() - 1);

    return new EventRequest(eventRequest.getSummary(), eventRequest.getDescription(), eventRequest.getParseTime(), recurrenceRelation, formattedStartTime, formattedEndTime, eventRequest.getUserId());


  }





}
