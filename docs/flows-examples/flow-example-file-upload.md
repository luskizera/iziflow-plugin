# Flow Name: File Upload Process

NODE start_upload START "Begin Upload"
  META category: System

NODE upload_trigger ENTRYPOINT "Initiate File Upload"
  META category: User Action
  DESC Context: User is on a page where they can upload documents.
  DESC Action: User clicks the 'Upload Document' button or drags a file onto a dropzone.

NODE file_selection STEP "File Selection Dialog"
  META category: System Interaction
  DESC Action: Operating system's file picker dialog opens.
  DESC User Task: User selects one or more files to upload.

NODE validation_preview STEP "Validation & Preview"
  META category: Pre-Upload
  DESC Action: System checks file type, size limits. Shows a preview if possible.
  DESC Feedback (Success): File ready for upload. Shows filename, size.
  DESC Feedback (Error): File type not supported / File size exceeds limit.
  DESC Options: Confirm Upload\nCancel\nChoose Different File

NODE metadata_input STEP "Add File Metadata (Optional)"
  META category: User Input
  DESC Context: Optional step to add description or tags to the file.
  DESC Inputs: Description (Textarea)\nTags (Comma-separated)

NODE upload_progress STEP "Uploading File"
  META category: Feedback
  DESC State: Shows a progress bar or indicator.
  DESC Info: Uploading [filename]... X%
  DESC Option: Cancel Upload

NODE upload_complete STEP "Upload Successful"
  META category: Success Feedback
  DESC Message: '[filename]' has been uploaded successfully!
  DESC Next Action: View File\nUpload Another

NODE end_upload END "End Upload Process"
  META category: System

# Connections
CONN start_upload -> upload_trigger "User Initiates"
CONN upload_trigger -> file_selection "Trigger Action Completed"
CONN file_selection -> validation_preview "File(s) Selected"
CONN validation_preview -> metadata_input "Valid File - Confirm Upload"
CONN validation_preview -> upload_trigger "Choose Different File" [SECONDARY] # Loop back on error/change
CONN metadata_input -> upload_progress "Metadata Saved / Skipped"
CONN validation_preview -> upload_progress "Valid File - Confirm Upload (No Metadata)" [SECONDARY] # Path skipping metadata
CONN upload_progress -> upload_complete "Upload Finishes"
CONN upload_complete -> end_upload "User Finishes"
CONN upload_complete -> upload_trigger "Upload Another" [SECONDARY] # Loop back to upload more