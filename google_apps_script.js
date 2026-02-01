const SHEET_ID = '1ptDMjMQqSuuqV8pMHKUq0fLxzr2iClPLH94UzHlxN3M';
const SHEET_NAME = 'Sheet1';

/**
 * UPDATED Column Structure to match separate row submission for family members:
 * 1. TimeStamp
 * 2. Type (VCI Member / Spouse / Family Member)
 * 3. Name
 * 4. Mobile
 * 5. Email
 * 6. DOB
 * 7. Gender
 * 8. Marital Status
 * 9. Anniversary
 * 10. Business Name
 * 11. Emp Count
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
        'Type',
        'Name', 
        'Mobile', 
        'Email', 
        'DOB', 
        'Gender', 
        'Marital Status', 
        'Anniversary', 
        'Business Name', 
        'Emp Count'
      ]);
    }

    var timestamp = data.timestamp || new Date().toISOString();
    
    // 1. Add VCI Member Row
    sheet.appendRow([
      timestamp,
      'VCI Member',
      data.vciName,
      data.vciMobile,
      data.vciEmail || '',
      data.vciDob,
      data.vciGender,
      data.maritalStatus,
      '',
      data.businessName || '',
      data.employeeCount || ''
    ]);

    // 2. Add Spouse Row if married
    if (data.maritalStatus === 'married' && data.spouseName) {
      sheet.appendRow([
        timestamp,
        'Spouse',
        data.spouseName,
        data.spouseMobile || '',
        '',
        data.spouseDob || '',
        '',
        '',
        data.anniversaryDate || '',
        '',
        ''
      ]);
    }

    // 3. Add separate rows for each Family Member
    var familyMembers = data.familyMembers || [];
    familyMembers.forEach(function(member) {
      sheet.appendRow([
        timestamp,
        'Family Member',
        member.name,
        member.mobile || '',
        '',
        member.dateOfBirth || '',
        member.gender || '',
        '',
        '',
        '',
        ''
      ]);
    });
    
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