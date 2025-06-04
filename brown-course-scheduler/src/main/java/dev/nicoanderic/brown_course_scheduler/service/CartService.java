package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import dev.nicoanderic.brown_course_scheduler.repository.CartItemRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {
  private final CartItemRepository cartItemRepository;

  public CartService(CartItemRepository cartItemRepository) {
    this.cartItemRepository = cartItemRepository;
  }

  /**
   * Retrieves all cart items for a specific user.
   * If no items are found, a message indicating an empty cart is returned.
   *
   * @param clerkUserId the ID of the user (from Clerk)
   * @return a map containing either a "No cart" message or a list of cart items
   */
  public Object getCartItems(String clerkUserId) {
    Map<String, Object> result = new HashMap<>();
    List<CartItem> userItems = cartItemRepository.findByuserName(clerkUserId);
    if (userItems.isEmpty()) {
      result.put("result", "No cart");
    } else {
      result.put("result", "success");
      result.put("items", userItems);
    }
    return result;
  }

  /**
   * Adds a course to the user's cart.
   * Prevents duplicates by checking for an existing item with the same CRN.
   *
   * @param cartItem the course item to add
   */
  public void addToCart(CartItem cartItem) {
    try {

      CartItem existing = cartItemRepository.findByUserNameAndCrn(cartItem.getUserName(), cartItem.getCrn());

    if (existing == null) {
      cartItemRepository.saveAndFlush(cartItem);
    }} catch (Exception e) {

      System.out.println("Already added to cart");
    }
  }

  /**
   * Deletes a course from the cart by CRN.
   *
   * @param crn the course registration number to remove
   */
  @Transactional
  public void deleteFromCart(String crn, String username) {
    cartItemRepository.deleteByCrnAndUserName(crn, username);
    cartItemRepository.flush();
  }
}
