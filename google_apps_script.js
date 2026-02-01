const SHEET_ID = '1ptDMjMQqSuuqV8pMHKUq0fLxzr2iClPLH94UzHlxN3M';
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'TimeStamp', 'Member of VCI', 'Type', 'Name', 'Mobile', 'Email', 
        'DOB', 'Gender', 'Marital Status', 'Anniversary', 'Business Name', 'Emp Count'
      ]);
    }

    var timestamp = data.timestamp || new Date().toISOString();
    var mainVciName = data.vciName;
    var maritalStatus = data.maritalStatus;
    var anniversary = data.anniversaryDate || '';
    
    // 1. Add VCI Member Row
    sheet.appendRow([
      timestamp, 
      mainVciName, 
      'VCI Member', 
      data.vciName, 
      data.vciMobile, 
      data.vciEmail || '', 
      data.vciDob, 
      data.vciGender, 
      maritalStatus, 
      anniversary, 
      data.businessName || '', 
      data.employeeCount || ''
    ]);

    // 2. Add Spouse Row
    if (maritalStatus === 'married' && data.spouseName) {
      sheet.appendRow([
        timestamp, 
        mainVciName, 
        'Spouse', 
        data.spouseName, 
        data.spouseMobile || '', 
        '', 
        data.spouseDob || '', 
        data.spouseGender || '', 
        maritalStatus, 
        anniversary, 
        '', 
        ''
      ]);
    }

    // 3. Add Family Member Rows
    var familyMembers = data.familyMembers || [];
    familyMembers.forEach(function(member) {
      sheet.appendRow([
        timestamp, 
        mainVciName, 
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
    
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: 'API is running'})).setMimeType(ContentService.MimeType.JSON);
}