# Flow Name: Simple E-commerce Checkout

NODE start_checkout START "Initiate Checkout"
  META category: System

NODE review_cart ENTRYPOINT "Review Shopping Cart"
  META category: Checkout
  DESC Action: User reviews items, quantities, and total price.
  DESC Options: Update Quantity\nRemove Item\nProceed to Shipping

NODE shipping_address STEP "Enter Shipping Address"
  META category: Checkout Form
  DESC Title: Shipping Details
  DESC Inputs: Full Name\nStreet Address\nCity\nPostcode\nCountry
  DESC Validation: All fields required, postcode format validation.
  DESC Option: Save address for future use? (Checkbox)

NODE payment_options DECISION "Select Payment Method"
  META category: Payment
  DESC Prompt: How would you like to pay?

NODE cc_details STEP "Credit Card Payment"
  META category: Payment Form
  DESC Action: User enters credit card information.
  DESC Inputs: Card Number\nExpiry Date (MM/YY)\nCVV\nName on Card
  DESC Security Note: Your payment is securely processed.

NODE paypal_redirect STEP "PayPal Checkout"
  META category: Payment External
  DESC Action: User is redirected to PayPal to complete payment.
  DESC Info: Log in to your PayPal account and confirm the purchase.

NODE order_confirmation STEP "Order Confirmation"
  META category: Success Feedback
  DESC Title: Thank You For Your Order!
  DESC Order ID: #IZI-123456
  DESC Summary: Your order details and shipping information will be emailed shortly.

NODE end_checkout END "Checkout Process Complete"
  META category: System

# Connections
CONN start_checkout -> review_cart "User Clicks Checkout"
CONN review_cart -> shipping_address "Proceed to Shipping"
CONN shipping_address -> payment_options "Address Confirmed"
# Decision branches
CONN payment_options -> cc_details "Selects Credit Card"
CONN payment_options -> paypal_redirect "Selects PayPal"
# Convergence after payment
CONN cc_details -> order_confirmation "Card Payment Successful"
CONN paypal_redirect -> order_confirmation "PayPal Payment Successful"
# Final step
CONN order_confirmation -> end_checkout "View Order Confirmation"