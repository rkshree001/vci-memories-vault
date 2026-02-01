/**
 * GOOGLE APPS SCRIPT FOR VCEH FAMILY REGISTRY (v2 - Photo Support)
 * 
 * Instructions:
 * 1. Open Google Sheets
 * 2. Extensions > Apps Script
 * 3. Replace ALL existing code with this script
 * 4. Create a folder in Google Drive named "VCEH Photos"
 * 5. Copy that folder's ID from the URL (e.g., 1abc123...)
 * 6. Replace "PASTE_YOUR_FOLDER_ID_HERE" below with that ID
 * 7. Deploy > New Deployment > Web App > Access: Anyone
 */

const FOLDER_ID = "PASTE_YOUR_FOLDER_ID_HERE";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    
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
        const fileName = "VCEH_" + data.vcehName.replace(/\s+/g, '_') + "_" + new Date().getTime() + ".png";
        const file = folder.createFile(Utilities.newBlob(bytes, contentType, fileName));
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        photoUrl = file.getUrl();
      } catch (fError) {
        Logger.log("Photo upload failed: " + fError);
      }
    }
    
    // 1. Add Member Row
    sheet.appendRow([
      data.timestamp,
      data.vcehName,
      data.vcehName,
      data.vcehMobile,
      data.vcehEmail || "NA",
      data.vcehDob,
      data.vcehGender,
      data.maritalStatus,
      data.maritalStatus === "married" ? data.anniversaryDate : "NA",
      photoUrl,
      data.businessName || "NA",
      data.employeeCount || "NA"
    ]);
    
    // 2. Add Spouse Row
    if (data.maritalStatus === "married") {
      sheet.appendRow([
        data.timestamp,
        data.vcehName,
        data.spouseName,
        data.spouseMobile || "NA",
        "NA",
        data.spouseDob,
        data.spouseGender,
        data.maritalStatus,
        data.anniversaryDate,
        "NA",
        data.businessName || "NA",
        "NA"
      ]);
    }
    
    // 3. Add Children Rows
    if (data.familyMembers && data.familyMembers.length > 0) {
      data.familyMembers.forEach(function(child) {
        sheet.appendRow([
          data.timestamp,
          data.vcehName,
          child.name,
          "NA",
          "NA",
          child.dateOfBirth,
          child.gender,
          "NA",
          "NA",
          "NA",
          data.businessName || "NA",
          "NA"
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
