const SHEET_NAME = 'Employees';
const HEADERS = [
  'employee_id',
  'full_name',
  'position',
  'department',
  'division',
  'phone',
  'email',
  'status'
];

function setAllowedEmails() {
  PropertiesService.getScriptProperties().setProperty(
    'ALLOWED_EMAILS',
    'yourmail@example.com,another@example.com'
  );
  SpreadsheetApp.getUi().alert('Allowed emails updated.');
}

function getAllowedEmails() {
  const value = PropertiesService.getScriptProperties().getProperty('ALLOWED_EMAILS') || '';
  return value
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);
}

function getCurrentUserEmail() {
  return (Session.getActiveUser().getEmail() || '').toLowerCase();
}

function isAuthorizedUser() {
  const allowed = getAllowedEmails();
  const current = getCurrentUserEmail();

  if (!current) {
    return false;
  }

  if (allowed.length === 0) {
    return true;
  }

  return allowed.includes(current);
}

function doGet() {
  if (!isAuthorizedUser()) {
    return HtmlService.createHtmlOutput(
      '<html><body><h3>Access denied</h3><p>Bạn không có quyền truy cập vào hệ thống.</p></body></html>'
    ).setTitle('Access denied');
  }

  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Employee Database')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  } else {
    const firstRow = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getValues()[0];
    const missingHeaders = HEADERS.filter((header, index) => firstRow[index] !== header);

    if (missingHeaders.length > 0) {
      const targetRange = sheet.getRange(1, 1, 1, HEADERS.length);
      targetRange.setValues([HEADERS]);
    }
  }

  return sheet;
}

function normalizeRow(row) {
  const obj = {};
  HEADERS.forEach((header, index) => {
    obj[header] = row[index] || '';
  });
  return obj;
}

function findEmployeeById(employeeId) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim().toLowerCase() === String(employeeId).trim().toLowerCase()) {
      return i + 1;
    }
  }

  return null;
}

function validateEmployeeData(data) {
  const employeeId = String(data.employee_id || '').trim();
  const fullName = String(data.full_name || '').trim();
  const position = String(data.position || '').trim();
  const department = String(data.department || '').trim();
  const division = String(data.division || '').trim();
  const phone = String(data.phone || '').trim();
  const email = String(data.email || '').trim();
  const status = String(data.status || '').trim();

  if (!employeeId) {
    return { valid: false, message: 'Mã nhân viên không được để trống.' };
  }

  if (!/^[A-Za-z0-9]+$/.test(employeeId)) {
    return { valid: false, message: 'Mã nhân viên chỉ được chứa chữ cái và số.' };
  }

  if (!fullName) {
    return { valid: false, message: 'Họ tên không được để trống.' };
  }

  if (!position) {
    return { valid: false, message: 'Chức vụ không được để trống.' };
  }

  if (!department) {
    return { valid: false, message: 'Bộ phận không được để trống.' };
  }

  if (!division) {
    return { valid: false, message: 'Phòng ban không được để trống.' };
  }

  if (!phone || !/^[0-9]+$/.test(phone)) {
    return { valid: false, message: 'Số điện thoại chỉ được chứa số.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Email không hợp lệ.' };
  }

  const validStatuses = ['Hoạt động', 'Nghỉ việc', 'Tạm dừng'];
  if (!validStatuses.includes(status)) {
    return { valid: false, message: 'Trạng thái không hợp lệ.' };
  }

  return { valid: true };
}

function getEmployees(filters) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return [];
  }

  const filterObj = filters || {};
  const keyword = String(filterObj.keyword || '').trim().toLowerCase();
  const department = String(filterObj.department || '').trim();
  const status = String(filterObj.status || '').trim();

  const rows = data.slice(1).map((row, index) => ({
    rowIndex: index + 2,
    values: normalizeRow(row)
  }));

  const filtered = rows.filter(item => {
    const employee = item.values;

    const matchesKeyword = !keyword || [
      employee.employee_id,
      employee.full_name,
      employee.position,
      employee.department,
      employee.division,
      employee.email,
      employee.phone
    ].some(value => String(value).toLowerCase().includes(keyword));

    const matchesDepartment = !department || employee.department === department;
    const matchesStatus = !status || employee.status === status;

    return matchesKeyword && matchesDepartment && matchesStatus;
  });

  return filtered.map(item => item.values);
}

function addEmployee(data) {
  const validation = validateEmployeeData(data);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const sheet = getSheet();
  const employeeId = String(data.employee_id).trim();

  if (findEmployeeById(employeeId)) {
    throw new Error('Mã nhân viên đã tồn tại trong hệ thống.');
  }

  const row = [
    employeeId,
    String(data.full_name || '').trim(),
    String(data.position || '').trim(),
    String(data.department || '').trim(),
    String(data.division || '').trim(),
    String(data.phone || '').trim(),
    String(data.email || '').trim(),
    String(data.status || '').trim()
  ];

  sheet.appendRow(row);

  return {
    success: true,
    message: 'Thêm nhân viên mới thành công.'
  };
}

function updateEmployee(data) {
  const validation = validateEmployeeData(data);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const employeeId = String(data.employee_id || '').trim();
  const rowNumber = findEmployeeById(employeeId);

  if (!rowNumber) {
    throw new Error('Không tìm thấy nhân viên để cập nhật.');
  }

  const sheet = getSheet();
  sheet.getRange(rowNumber, 1, 1, HEADERS.length).setValues([[
    employeeId,
    String(data.full_name || '').trim(),
    String(data.position || '').trim(),
    String(data.department || '').trim(),
    String(data.division || '').trim(),
    String(data.phone || '').trim(),
    String(data.email || '').trim(),
    String(data.status || '').trim()
  ]]);

  return {
    success: true,
    message: 'Cập nhật thông tin nhân viên thành công.'
  };
}

function deleteEmployee(employeeId) {
  const id = String(employeeId || '').trim();
  if (!id) {
    throw new Error('Vui lòng chọn nhân viên cần xóa.');
  }

  const sheet = getSheet();
  const rowNumber = findEmployeeById(id);

  if (!rowNumber) {
    throw new Error('Không tìm thấy nhân viên cần xóa.');
  }

  sheet.deleteRow(rowNumber);

  return {
    success: true,
    message: 'Xóa nhân viên thành công.'
  };
}

function exportToExcel() {
  const employees = getEmployees({});
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const exportSheet = spreadsheet.insertSheet('Export_' + Date.now());

  // Thêm header
  exportSheet.appendRow(HEADERS);

  // Thêm dữ liệu
  if (employees.length > 0) {
    employees.forEach(emp => {
      exportSheet.appendRow([
        emp.employee_id,
        emp.full_name,
        emp.position,
        emp.department,
        emp.division,
        emp.phone,
        emp.email,
        emp.status
      ]);
    });
  }

  // Format header
  const headerRange = exportSheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setBackground('#4F81BD');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');

  // Auto-resize columns
  for (let i = 1; i <= HEADERS.length; i++) {
    exportSheet.autoResizeColumn(i);
  }

  SpreadsheetApp.flush();

  // Tạo URL export dạng Excel
  const fileUrl = 'https://docs.google.com/spreadsheets/d/' + spreadsheet.getId() + '/export?format=xlsx';

  // Xóa sheet tạm
  spreadsheet.deleteSheet(exportSheet);

  return { success: true, url: fileUrl };
}
