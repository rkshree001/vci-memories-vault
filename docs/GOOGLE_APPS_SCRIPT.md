# Google Apps Script Setup Guide

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "VCI Birthday Reminders"
4. Add these headers in Row 1:
   - A1: Timestamp
   - B1: Member Type
   - C1: VCI Member Name
   - D1: VCI Mobile
   - E1: VCI Email
   - F1: VCI DOB
   - G1: VCI Gender
   - H1: Marital Status
   - I1: Person Name
   - J1: Person DOB
   - K1: Person Mobile
   - L1: Anniversary Date
   - M1: Business Name
   - N1: Employee Count
   - O1: Employee Name
   - P1: Employee Mobile

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code and paste the following:

```javascript
/**
 * VCI Birthday Reminder - Google Apps Script
 * Handles POST requests from the web form and saves to Google Sheets
 */

// Configuration - Update this with your Sheet ID
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Get this from the URL of your Google Sheet
const SHEET_NAME = 'Sheet1';

/**
 * Handle POST requests from the web form
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the spreadsheet and sheet
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    const timestamp = new Date().toISOString();
    const vci = data.vciMember;
    const spouse = data.spouse;
    const familyMembers = data.familyMembers || [];
    const business = data.business;
    
    // Add VCI Member row
    sheet.appendRow([
      timestamp,
      'VCI Member',
      vci.name,
      vci.mobile,
      vci.email || '',
      vci.dateOfBirth,
      vci.gender,
      vci.maritalStatus,
      vci.name,
      vci.dateOfBirth,
      vci.mobile,
      '',
      business.name || '',
      business.employeeCount || '',
      business.employeeName || '',
      business.employeeMobile || ''
    ]);
    
    // Add Spouse row if married
    if (spouse && spouse.name) {
      sheet.appendRow([
        timestamp,
        'Spouse',
        vci.name,
        vci.mobile,
        vci.email || '',
        vci.dateOfBirth,
        vci.gender,
        vci.maritalStatus,
        spouse.name,
        spouse.dateOfBirth || '',
        spouse.mobile || '',
        spouse.anniversaryDate || '',
        '',
        '',
        '',
        ''
      ]);
    }
    
    // Add Family Member rows
    familyMembers.forEach(function(member) {
      sheet.appendRow([
        timestamp,
        'Family Member',
        vci.name,
        vci.mobile,
        vci.email || '',
        vci.dateOfBirth,
        vci.gender,
        vci.maritalStatus,
        member.name,
        member.dateOfBirth || '',
        member.mobile || '',
        '',
        '',
        '',
        '',
        ''
      ]);
    });
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'VCI Birthday Reminder API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to verify setup
 */
function testSetup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  Logger.log('Sheet found: ' + sheet.getName());
  Logger.log('Setup is correct!');
}
```

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Configure:
   - **Description**: VCI Birthday Reminder API
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Click **Authorize access** and allow permissions
6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/...../exec`)

## Step 4: Update Your App

Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` in `src/components/BirthdayReminderForm.tsx` with your Web App URL.

```typescript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
```

## Important Notes

- The script uses `no-cors` mode because Google Apps Script doesn't support CORS
- Each family member creates a separate row linked to the VCI Member
- All rows share the same timestamp for grouping
- The script handles unlimited family members

## Troubleshooting

1. **Script not working?** Make sure you deployed as "Anyone" can access
2. **Permission errors?** Re-authorize the script
3. **Data not appearing?** Check the Sheet ID is correct
4. **CORS errors?** The app uses `no-cors` mode which should bypass this

## Testing

1. Visit your Web App URL in a browser - you should see:
   ```json
   {"status":"VCI Birthday Reminder API is running"}
   ```
2. Submit a test entry from your form
3. Check your Google Sheet for the new rows
