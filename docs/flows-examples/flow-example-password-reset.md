# Flow Name: Password Reset Process

NODE start_reset START "Begin Password Reset"
  META category: System

NODE forgot_entry ENTRYPOINT "Forgot Password Screen"
  META category: Authentication
  DESC Title: Reset Your Password
  DESC Prompt: Enter your registered email address.
  DESC Input: Email Address
  DESC Button: Send Reset Link

NODE email_lookup STEP "System Looks Up Email"
  META category: Backend Process
  DESC Action: Verify if email exists in the database.
  DESC Logic: If exists, generate unique reset token.

NODE confirm_sent STEP "Confirmation Message"
  META category: Feedback
  DESC Message: If an account exists for that email, a password reset link has been sent. Please check your inbox (and spam folder).
  DESC Instruction: Click the link in the email to proceed.

NODE reset_form STEP "New Password Form"
  META category: Authentication
  DESC Context: User clicks link in email and lands here.
  DESC Title: Set Your New Password
  DESC Inputs: New Password\nConfirm New Password
  DESC Validation: Password must be 8+ characters and match confirmation.
  DESC Button: Update Password

NODE success_feedback STEP "Password Updated"
  META category: Feedback
  DESC Message: Your password has been successfully updated!
  DESC Next Action: You can now log in with your new password.

NODE end_reset END "Password Reset Complete"
  META category: System

# Connections
CONN start_reset -> forgot_entry "User initiates"
CONN forgot_entry -> email_lookup "User Submits Email"
CONN email_lookup -> confirm_sent "Email Processed"
# Note: Link click happens outside this specific diagram view
CONN confirm_sent -> reset_form "User Clicks Reset Link (Implied)"
CONN reset_form -> success_feedback "Valid New Password Submitted"
CONN success_feedback -> end_reset "Process Finished"