package dev.nicoanderic.brown_course_scheduler.repository;

import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for CartItem entities.
 * Extends JpaRepository to provide basic CRUD operations and
 * defines additional query methods for custom lookups.
 */
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

  /**
   * Finds all CartItem records associated with the given user name.
   *
   * @param userName the user name to filter cart items by
   * @return a list of CartItems belonging to the specified user
   */
  List<CartItem> findByuserName(String userName);

  /**
   * Finds a CartItem by its item ID.
   *
   * @param itemId the ID of the item
   * @return the CartItem with the specified item ID, or null if not found
   */
  CartItem findByitemId(int itemId);

  /**
   * Finds a CartItem by its CRN (Course Reference Number).
   *
   * @param crn the CRN string to search for
   * @return the CartItem with the specified CRN, or null if not found
   */
  CartItem findByCrn(String crn);

  CartItem findByUserNameAndCrn(String userName, String crn);  // <- Add this


  void deleteByCrn(String crn);

  void deleteByCrnAndUserName(String crn, String username);
}
