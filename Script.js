* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f3f6fb;
  color: #1f2937;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  font-size: 28px;
}

.panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.panel h2 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
}

input,
select,
button {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 10px 12px;
  font-size: 14px;
}

input:focus,
select:focus {
  outline: 2px solid #93c5fd;
  border-color: #60a5fa;
}

.actions {
  margin-top: 18px;
  display: flex;
  gap: 12px;
}

.primary-btn,
.secondary-btn,
.small-btn {
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.primary-btn {
  background: #2563eb;
  color: white;
  border: none;
}

.primary-btn:hover {
  background: #1d4ed8;
}

.secondary-btn {
  background: #f3f4f6;
  color: #111827;
}

.secondary-btn:hover {
  background: #e5e7eb;
}

.filter-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

th,
td {
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  padding: 12px 10px;
  vertical-align: top;
}

th {
  background: #f9fafb;
  font-weight: 700;
}

tr:hover {
  background: #f8fafc;
}

.action-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.small-btn {
  padding: 8px 10px;
  font-size: 12px;
}

.edit-btn {
  background: #e0f2fe;
  color: #075985;
  border: 1px solid #bae6fd;
}

.delete-btn {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-paused {
  background: #fef3c7;
  color: #92400e;
}

@media (max-width: 768px) {
  .filter-row {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
