const SHEET_ID = '1ptDMjMQqSuuqV8pMHKUq0fLxzr2iClPLH94UzHlxN3M';
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'TimeStamp', 'Member of VCI', 'Type', 'Name', 'Mobile', 'Email', 
        'DOB', 'Gender', 'Marital Status', 'Anniversary', 'Business Name', 'Emp Count'
      ]);
    }

    var timestamp = data.timestamp || new Date().toISOString();
    var mainVciName = data.vciName || 'NA';
    var maritalStatus = data.maritalStatus || 'NA';
    var anniversary = data.anniversaryDate || 'NA';
    
    // 1. Add VCI Member Row
    sheet.appendRow([
      timestamp, 
      mainVciName, 
      'VCI Member', 
      data.vciName || 'NA', 
      data.vciMobile || 'NA', 
      data.vciEmail || 'NA', 
      data.vciDob || 'NA', 
      data.vciGender || 'NA', 
      maritalStatus, 
      anniversary, 
      data.businessName || 'NA', 
      data.employeeCount || 'NA'
    ]);

    // 2. Add Spouse Row
    if (maritalStatus === 'married' && data.spouseName) {
      sheet.appendRow([
        timestamp, 
        mainVciName, 
        'Spouse', 
        data.spouseName || 'NA', 
        data.spouseMobile || 'NA', 
        'NA', 
        data.spouseDob || 'NA', 
        data.spouseGender || 'NA', 
        maritalStatus, 
        anniversary, 
        'NA', 
        'NA'
      ]);
    }

    // 3. Add Family Member Rows
    var familyMembers = data.familyMembers || [];
    familyMembers.forEach(function(member) {
      sheet.appendRow([
        timestamp, 
        mainVciName, 
        'Family Member', 
        member.name || 'NA', 
        member.mobile || 'NA', 
        'NA', 
        member.dateOfBirth || 'NA', 
        member.gender || 'NA', 
        'NA', 
        'NA', 
        'NA', 
        'NA'
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