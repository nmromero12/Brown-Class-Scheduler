package dev.nicoanderic.brown_course_scheduler.controller;

import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import dev.nicoanderic.brown_course_scheduler.repository.CartItemRepository;
import dev.nicoanderic.brown_course_scheduler.service.CartService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

  /**
   * Removes an item from the cart by CRN.
   *
   * @param crn the course registration number to delete
   */
  @DeleteMapping("/deleteItem/{crn}")
  public void deleteItem(@PathVariable String crn) {
    cartService.deleteFromCart(crn);
  }
}
