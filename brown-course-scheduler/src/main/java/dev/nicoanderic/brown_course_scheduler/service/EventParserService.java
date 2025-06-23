package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Service responsible for parsing class time strings into structured event info.
 */
@Service
public class EventParserService {

  /**
   * Parses a CartItem's classTime field into structured fields:
   * days, startTime, endTime, location, and description.
   */
  public Map<String, String> parseClassTime(CartItem classDetails) {
    Map<String, String> responseMap = new HashMap<>();
    String classTime = classDetails.getClassTime();

    // --- Parse days ---
    String classDays = classTime.substring(0, classTime.indexOf(" "));
    List<String> days = new ArrayList<>();

    int i = 0;
    while (i < classDays.length()) {
      if (i + 1 < classDays.length() && classDays.substring(i, i + 2).equals("Th")) {
        days.add("TH");
        i += 2;
      } else {
        switch (classDays.charAt(i)) {
          case 'M' -> days.add("MO");
          case 'T' -> days.add("TU");
          case 'W' -> days.add("WE");
          case 'F' -> days.add("FR");
          case 'S' -> days.add("SA");
        }
        i++;
      }
    }

    try {

      responseMap.put("days", String.join(",", days));

      // --- Parse times ---
      Pattern timePattern = Pattern.compile(
          "(\\d{1,2})(:?\\d{0,2})?(am|pm)-(\\d{1,2})(:?\\d{0,2})?(am|pm)");
      Matcher matcher = timePattern.matcher(classTime);

      if (matcher.find()) {
        int startHour = Integer.parseInt(matcher.group(1));
        int startMin = matcher.group(2) != null && !matcher.group(2).isEmpty()
            ? Integer.parseInt(matcher.group(2).substring(1)) : 0;
        if (matcher.group(3).equalsIgnoreCase("pm") && startHour != 12)
          startHour += 12;
        if (matcher.group(3).equalsIgnoreCase("am") && startHour == 12)
          startHour = 0;

        int endHour = Integer.parseInt(matcher.group(4));
        int endMin = matcher.group(5) != null && !matcher.group(5).isEmpty()
            ? Integer.parseInt(matcher.group(5).substring(1)) : 0;
        if (matcher.group(6).equalsIgnoreCase("pm") && endHour != 12)
          endHour += 12;
        if (matcher.group(6).equalsIgnoreCase("am") && endHour == 12)
          endHour = 0;

        responseMap.put("startTime", String.format("%02d:%02d", startHour, startMin));
        responseMap.put("endTime", String.format("%02d:%02d", endHour, endMin));
      }

      // --- Parse location ---
      int timeEndIndex = classTime.indexOf("am", classTime.indexOf("-")) + 2;
      String location = classTime.substring(timeEndIndex).trim();
      responseMap.put("location", location.isEmpty() ? "TBD" : location);
      responseMap.put("result", "success");
    } catch (Exception e) {
      responseMap.put("result", "fail");
      responseMap.put("error", "sorry not able to parse the class time");
    }



    return responseMap;
  }
}
