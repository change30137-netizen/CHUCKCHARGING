// === Google Apps Script — 貼到 Apps Script 編輯器 ===
// Sheet 第一列標題：姓名 | 主菜 | 甜點 | 飲品 | 備註 | 投票時間

var SHEET_NAME = 'Sheet1'; // 改成你的工作表名稱

function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var result = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    result.push(row);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, data: result }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var body = JSON.parse(e.postData.contents);
  var name = body.name;
  var data = sheet.getDataRange().getValues();

  // 找是否已有同名資料（允許改票 = 覆蓋）
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === name) {
      rowIndex = i + 1; // Sheet 是 1-based
      break;
    }
  }

  var row = [name, body.mainCourse, body.dessert, body.drink, body.note || '', new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })];

  if (rowIndex > 0) {
    // 覆蓋既有資料
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  } else {
    // 新增一列
    sheet.appendRow(row);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
