let emailNotification = false;
let emailAddress = "Change_to_your_Email";
const EXCLUDE_PROPERTY = 'e_gs_exclude';
const ORDER_PROPERTY = 'e_gs_order';
const SHEET_NAME_PROPERTY = 'e_gs_SheetName';
let postedData = {};

// Handle GET requests
function doGet() {
  return HtmlService.createHtmlOutput("Webhook endpoint active");
}

// Handle POST requests from Elementor
function doPost(e) {
  postedData = flattenObject(e.parameter);
  const sheetName = postedData[SHEET_NAME_PROPERTY] || postedData["form_name"] || "Form Submissions";
  const sheet = getOrCreateSheet(sheetName);

  const headers = normalizeHeaders(sheet, Object.keys(postedData));
  const values = headers.map(header => postedData[header] || "");

  updateSheetHeaders(sheet, headers);
  appendRow(sheet, values);

  if (emailNotification) {
    sendNotification(sheetName, getSheetUrl(sheet));
  }

  return HtmlService.createHtmlOutput("Form data received");
}

// Flatten nested object
function flattenObject(obj) {
  const result = {};
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const flat = flattenObject(obj[key]);
      for (let subkey in flat) {
        if (flat.hasOwnProperty(subkey)) {
          result[`${key}.${subkey}`] = flat[subkey];
        }
      }
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

// Get or create a sheet
function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([]); // initialize header row
  }
  return sheet;
}

// Ensure all new form fields are included as headers
function normalizeHeaders(sheet, newKeys) {
  const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] || [];
  let headers = [...new Set([...existingHeaders, ...newKeys])];

  // Apply custom order if specified
  if (postedData[ORDER_PROPERTY]) {
    const order = stringToArray(postedData[ORDER_PROPERTY]).filter(h => headers.includes(h));
    headers = [...order, ...headers.filter(h => !order.includes(h))];
  }

  // Exclude columns if specified
  if (postedData[EXCLUDE_PROPERTY]) {
    const exclude = stringToArray(postedData[EXCLUDE_PROPERTY]);
    headers = headers.filter(h => !exclude.includes(h));
  }

  return headers;
}

// Insert or update header row
function updateSheetHeaders(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}

// Append new row of data
function appendRow(sheet, values) {
  const lastRow = sheet.getLastRow();
  sheet.appendRow(values);
  const range = sheet.getRange(lastRow + 1, 1, 1, values.length);
  range.setFontWeight("normal").setHorizontalAlignment("center");
}

// Helper: Convert CSV string to array
function stringToArray(str) {
  return str.split(",").map(s => s.trim());
}

// Send email notification
function sendNotification(formName, sheetUrl) {
  MailApp.sendEmail({
    to: emailAddress,
    subject: `New Form Submission: ${formName}`,
    body: `A new submission was added to the Google Sheet.\n\nLink: ${sheetUrl}`,
    name: "Form Notification Bot"
  });
}

// Get current sheet URL
function getSheetUrl(sheet) {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl() + "#gid=" + sheet.getSheetId();
}
