package dev.nicoanderic.brown_course_scheduler.controller;

import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import dev.nicoanderic.brown_course_scheduler.repository.CartItemRepository;
import dev.nicoanderic.brown_course_scheduler.service.CartService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/cart")
public class CartController {
  private final CartService cartService;
  private final CartItemRepository cartItemRepository;

  public CartController(CartService cartService, CartItemRepository cartItemRepository) {
    this.cartService = cartService;
    this.cartItemRepository = cartItemRepository;
  }

  /**
   * Fetches cart items for the given user ID.
   *
   * @param userId the ID of the user
   * @return the cart items or a message if the cart is empty
   */
  @GetMapping("/user/{userId}")
  public Object getCartItem(@PathVariable String userId) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    return cartService.getCartItems(userId);
  }

  /**
   * Adds a new item to the cart.
   *
   * @param cartItem the item to add
   */
  @PostMapping("/addToCart")
  public void addToCart(@RequestBody CartItem cartItem) {
    cartService.addToCart(cartItem);
  }


  @DeleteMapping("/deleteItem")
  public ResponseEntity<?> deleteItem(@RequestParam String crn, @RequestParam String username) {
    System.out.println("=== DELETE REQUEST RECEIVED ===");
    System.out.println("CRN: " + crn);
    System.out.println("Username: " + username);

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    System.out.println("Authentication: " + (auth != null ? auth.getName() : "null"));

    try {
      cartService.deleteFromCart(crn, username);
      System.out.println("Delete successful");
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      System.err.println("Error in deleteItem: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting item");
    }
  }
}
