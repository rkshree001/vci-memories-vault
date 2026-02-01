const SHEET_ID = '1ptDMjMQqSuuqV8pMHKUq0fLxzr2iClPLH94UzHlxN3M';
const SHEET_NAME = 'Sheet1';

/**
 * UPDATED Column Structure to match single-row submission:
 * 1. TimeStamp
 * 2. VCI Name
 * 3. VCI Mobile
 * 4. VCI Email
 * 5. DOB
 * 6. Gender
 * 7. Marital Status
 * 8. Anniversary
 * 9. Spouse Name
 * 10. Spouse DOB
 * 11. Spouse Mobile
 * 12. Business Name
 * 13. Emp Count
 * 14. Family Members
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    // If the sheet is completely empty, add the headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'TimeStamp', 
        'VCI Name', 
        'VCI Mobile', 
        'VCI Email', 
        'DOB', 
        'Gender', 
        'Marital Status', 
        'Anniversary', 
        'Spouse Name', 
        'Spouse DOB', 
        'Spouse Mobile', 
        'Business Name', 
        'Emp Count', 
        'Family Members'
      ]);
    }

    var timestamp = data.timestamp || new Date().toISOString();
    
    // Format family members as a readable string
    var familyMembersString = (data.familyMembers || []).map(function(m) {
      return m.name + " (" + m.gender + ", DOB: " + m.dateOfBirth + (m.mobile ? ", Mob: " + m.mobile : "") + ")";
    }).join(" | ");

    // Append the consolidated row
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