# elementor-to-google-sheets
A Google Apps Script that captures form submissions from Elementor Forms (WordPress) via webhook and automatically populates the data into a Google Sheets spreadsheet. Supports dynamic field handling, custom sheet names, column ordering, and optional email notifications. Perfect for no-code automation of form data collection.

# Elementor to Google Sheets Webhook Integration

A Google Apps Script that captures form submissions from Elementor Forms (WordPress) via webhook and automatically populates the data into a Google Sheets spreadsheet.  

Supports:
- ✅ Dynamic form field handling (auto-appends new columns)
- ✅ Custom sheet naming via hidden field
- ✅ Optional column ordering and exclusions
- ✅ Email notifications for new entries (optional)

---

## 🚀 Features

- Works seamlessly with Elementor Pro’s Webhook action
- Automatically creates sheet and headers if not present
- Updates Google Sheet in real-time
- Easily customizable for advanced use cases

---

## 🛠️ Setup Instructions

1. **Create a Google Sheet**
   - Name it something like `Elementor Submissions`

2. **Open Google Apps Script**
   - Go to `Extensions > Apps Script` in your Google Sheet
   - Paste the provided script
   - Save and deploy as a Web App:
     - Execute as: **Me**
     - Who has access: **Anyone**

3. **Copy the Web App URL**

4. **Configure Elementor Form**
   - Use the **Webhook** action
   - Paste the Web App URL into the Webhook URL field
   - (Optional) Add a hidden field named `e_gs_SheetName` to control the target sheet

---

## 🔔 Optional Email Notifications

- To enable notifications:
  - Set `emailNotification = true` in the script
  - Replace `emailAddress` with your email

---

## 📄 Example Payload

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello from Elementor!",
  "form_name": "Contact Form"
}

