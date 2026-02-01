const SHEET_ID = '1ptDMjMQqSuuqV8pMHKUq0fLxzr2iClPLH94UzHlxN3M';
const SHEET_NAME = 'Sheet1';

/**
 * Standardizes the Google Sheets format to match a "Google Forms" style
 * where each submission is a single row.
 * 
 * Column Structure:
 * 1. Timestamp
 * 2. VCI Name
 * 3. VCI Mobile
 * 4. VCI Email
 * 5. VCI DOB
 * 6. VCI Gender
 * 7. Marital Status
 * 8. Anniversary Date
 * 9. Spouse Name
 * 10. Spouse DOB
 * 11. Spouse Mobile
 * 12. Business Name
 * 13. Employee Count
 * 14. Family Members (JSON String for easy processing or viewing)
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    // Ensure headers exist if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'VCI Name', 'VCI Mobile', 'VCI Email', 'VCI DOB', 'VCI Gender', 
        'Marital Status', 'Anniversary Date', 'Spouse Name', 'Spouse DOB', 'Spouse Mobile',
        'Business Name', 'Employee Count', 'Family Members'
      ]);
    }

    var timestamp = data.timestamp || new Date().toISOString();
    
    // Format family members as a readable string for the single row
    var familyMembersString = (data.familyMembers || []).map(function(m) {
      return m.name + " (" + m.gender + ", DOB: " + m.dateOfBirth + (m.mobile ? ", Mob: " + m.mobile : "") + ")";
    }).join(" | ");

    sheet.appendRow([
      timestamp,
      data.vciName,
      data.vciMobile,
      data.vciEmail || '',
      data.vciDob,
      data.vciGender,
      data.maritalStatus,
      data.anniversaryDate || '',
      data.spouseName || '',
      data.spouseDob || '',
      data.spouseMobile || '',
      data.businessName || '',
      data.employeeCount || '',
      familyMembersString
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: 'API is running'}))
    .setMimeType(ContentService.MimeType.JSON);
}