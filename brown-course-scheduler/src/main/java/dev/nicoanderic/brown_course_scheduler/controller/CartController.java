package dev.nicoanderic.brown_course_scheduler.controller;


import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import dev.nicoanderic.brown_course_scheduler.repository.CartItemRepository;
import dev.nicoanderic.brown_course_scheduler.service.CartService;
import org.springframework.stereotype.Controller;
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

  @GetMapping("/user/{userId}")
  public Object getCartItem(@PathVariable String userId) {
    return cartService.getCartItems(userId);
  }

  @PostMapping("/addToCart")
  public void addToCart(@RequestBody CartItem cartItem) {
    cartService.addToCart(cartItem);
  }

  @DeleteMapping("/deleteItem")
  public void deleteItem(@RequestParam String crn, @RequestParam String username) {
    cartService.deleteFromCart(crn, username);
  }


}
