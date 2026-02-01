/**
 * GOOGLE APPS SCRIPT FOR VCEH FAMILY REGISTRY (v3 - Optimized)
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Replace EVERYTHING with this code.
 * 4. Replace the FOLDER_ID below with your Google Drive Folder ID.
 * 5. Replace the SHEET_ID below with your Google Sheet ID.
 * 6. Deploy > New Deployment > Web App > Access: Anyone.
 */

const FOLDER_ID = "1mBJ3wwpx46ol0VGJi5gPsFhmkek8TYw_";
const SHEET_ID = "1ptDMjMQqSuuqV8pMHKUq0fLxzr2iClPLH94UzHlxN3M";
const SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    // Set headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", 
        "Member of VCEH", 
        "Full Name", 
        "Mobile Number", 
        "Email ID", 
        "Date of Birth", 
        "Gender", 
        "Marital Status", 
        "Anniversary Date", 
        "Photo URL",
        "Business Name", 
        "Employee Count"
      ]);
    }
    
    let photoUrl = "NA";
    
    // Handle Member Photo Upload
    if (data.photo && data.photo.includes("base64")) {
      try {
        const folder = DriveApp.getFolderById(FOLDER_ID);
        const contentType = data.photo.substring(5, data.photo.indexOf(';'));
        const bytes = Utilities.base64Decode(data.photo.split(',')[1]);
        const fileName = "VCEH_" + (data.vcehName || "Member").replace(/\s+/g, '_') + "_" + new Date().getTime() + ".png";
        const file = folder.createFile(Utilities.newBlob(bytes, contentType, fileName));
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        photoUrl = file.getUrl();
      } catch (fError) {
        Logger.log("Photo upload failed: " + fError);
      }
    }
    
    const timestamp = data.timestamp || new Date().toISOString();
    const vcehName = data.vcehName || "NA";
    const maritalStatus = data.maritalStatus || "NA";
    const anniversary = data.anniversaryDate || "NA";
    const businessName = data.businessName || "NA";
    const employeeCount = data.employeeCount || "NA";
    
    // 1. Add VCEH Member Row
    sheet.appendRow([
      timestamp, vcehName, vcehName, data.vcehMobile || "NA", 
      data.vcehEmail || "NA", data.vcehDob || "NA", data.vcehGender || "NA", 
      maritalStatus, anniversary, photoUrl, businessName, employeeCount
    ]);
    
    // 2. Add Spouse Row
    if (maritalStatus === "married") {
      sheet.appendRow([
        timestamp, vcehName, data.spouseName || "NA", data.spouseMobile || "NA", 
        "NA", data.spouseDob || "NA", data.spouseGender || "NA", 
        maritalStatus, anniversary, "NA", businessName, "NA"
      ]);
    }
    
    // 3. Add Children Rows
    if (data.familyMembers && data.familyMembers.length > 0) {
      data.familyMembers.forEach(function(child) {
        sheet.appendRow([
          timestamp, vcehName, child.name || "NA", "NA", "NA", 
          child.dateOfBirth || "NA", child.gender || "NA", "NA", "NA", "NA", 
          businessName, "NA"
        ]);
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("VCEH API is running").setMimeType(ContentService.MimeType.TEXT);
}
