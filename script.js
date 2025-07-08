// بيانات التطبيق
let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [
    { id: 1, name: "كبدة حارة", price: 30, category: "كبدة", icon: "fire" },
    { id: 2, name: "كبدة بارد", price: 25, category: "كبدة", icon: "snowflake" },
    { id: 3, name: "حواشي مخصوص", price: 40, category: "حواشي", icon: "drumstick-bite" },
    { id: 4, name: "فراخ مشوية", price: 50, category: "فراخ", icon: "kiwi-bird" }
];

let currentBill = [];
let totalAmount = 0;

// تهيئة التطبيق
function initApp() {
    updateMenuItems();
    setupEventListeners();
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000); // تحديث الوقت كل دقيقة
}

// عرض عناصر القائمة
function updateMenuItems(filterCategory = 'all') {
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = '';

    const filteredItems = filterCategory === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === filterCategory);

    filteredItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.innerHTML = `
            <div class="menu-item-icon">
                <i class="fas fa-${item.icon}"></i>
            </div>
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                <p>${item.price} جنيهاً</p>
            </div>
        `;
        itemElement.addEventListener('click', () => addToBill(item));
        menuContainer.appendChild(itemElement);
    });
}

// إضافة عنصر للفاتورة
function addToBill(item) {
    currentBill.push(item);
    totalAmount += item.price;
    updateBillDisplay();
    
    // تأثير عند الإضافة
    const billContainer = document.getElementById('bill-items');
    billContainer.scrollTop = billContainer.scrollHeight;
}

// تحديث عرض الفاتورة
function updateBillDisplay() {
    const billContainer = document.getElementById('bill-items');
    const totalElement = document.getElementById('total-amount');
    
    billContainer.innerHTML = '';
    currentBill.forEach(item => {
        const billItem = document.createElement('div');
        billItem.className = 'bill-item';
        billItem.innerHTML = `
            <span>${item.name}</span>
            <span>${item.price} جنيهاً</span>
        `;
        billContainer.appendChild(billItem);
    });
    
    totalElement.textContent = totalAmount.toFixed(2);
}

// تصفير الفاتورة
function resetBill() {
    if (currentBill.length === 0) return;
    
    if (confirm('هل تريد تصفير الفاتورة الحالية؟')) {
        currentBill = [];
        totalAmount = 0;
        updateBillDisplay();
    }
}

// طباعة الفاتورة
function printBill() {
    if (currentBill.length === 0) {
        alert('الفاتورة فارغة!');
        return;
    }
    
    // يمكن تطوير هذه الدالة لإرسال الفاتورة للطابعة
    const billContent = currentBill.map(item => 
        `${item.name} - ${item.price} جنيهاً`
    ).join('\n');
    
    alert(`فاتورة المطعم:\n\n${billContent}\n\nالإجمالي: ${totalAmount.toFixed(2)} جنيهاً`);
    
    // هنا يمكنك إضافة كود لحفظ الفاتورة في localStorage إذا لزم الأمر
    currentBill = [];
    totalAmount = 0;
    updateBillDisplay();
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // تبويب التصنيفات
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateMenuItems(btn.dataset.category);
        });
    });
}

// تحديث الوقت الحالي
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('current-time').textContent = `${timeString} - ${dateString}`;
}

// تبديل القائمة الجانبية (للأجهزة الصغيرة)
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);
// ============== نظام التخزين ==============
const STORAGE_KEYS = {
  MENU_ITEMS: 'kabati_menu_items',
  DAILY_SALES: 'kabati_daily_sales',
  TRANSACTIONS: 'kabati_transactions'
};

// تهيئة البيانات إذا لم تكن موجودة
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS)) {
    const defaultItems = [
      { id: 1, name: "كبدة حارة", price: 30, category: "كبدة", icon: "fire" },
      { id: 2, name: "كبدة بارد", price: 25, category: "كبدة", icon: "snowflake" },
      { id: 3, name: "حواشي مخصوص", price: 40, category: "حواشي", icon: "drumstick-bite" },
      { id: 4, name: "فراخ مشوية", price: 50, category: "فراخ", icon: "kiwi-bird" }
    ];
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(defaultItems));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.DAILY_SALES)) {
    localStorage.setItem(STORAGE_KEYS.DAILY_SALES, JSON.stringify({}));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
  }
}

// ============== نظام المبيعات ==============
function saveTransaction(items, total) {
  const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS));
  const newTransaction = {
    id: Date.now(),
    date: new Date().toISOString(),
    items: items.map(item => ({ id: item.id, name: item.name, price: item.price })),
    total
  };
  
  transactions.push(newTransaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  
  updateDailySales(newTransaction);
}

function updateDailySales(transaction) {
  const dailySales = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_SALES));
  const dateKey = new Date(transaction.date).toLocaleDateString();
  
  if (!dailySales[dateKey]) {
    dailySales[dateKey] = {
      total: 0,
      items: {},
      transactions: []
    };
  }
  
  // تحديث الإجمالي اليومي
  dailySales[dateKey].total += transaction.total;
  
  // تحديث الأصناف المباعة
  transaction.items.forEach(item => {
    if (!dailySales[dateKey].items[item.id]) {
      dailySales[dateKey].items[item.id] = {
        name: item.name,
        price: item.price,
        quantity: 0,
        total: 0
      };
    }
    dailySales[dateKey].items[item.id].quantity += 1;
    dailySales[dateKey].items[item.id].total += item.price;
  });
  
  // حفظ الفاتورة في قائمة المعاملات اليومية
  dailySales[dateKey].transactions.push(transaction.id);
  
  localStorage.setItem(STORAGE_KEYS.DAILY_SALES, JSON.stringify(dailySales));
}

// ============== نظام التقارير ==============
function generateDailyReport(date) {
  const dailySales = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_SALES));
  const dateKey = typeof date === 'string' ? date : date.toLocaleDateString();
  
  if (!dailySales[dateKey]) {
    return {
      date: dateKey,
      total: 0,
      items: [],
      transactions: 0
    };
  }
  
  return {
    date: dateKey,
    total: dailySales[dateKey].total,
    items: Object.values(dailySales[dateKey].items),
    transactions: dailySales[dateKey].transactions.length
  };
}

function generateWeeklyReport(startDate) {
  const dailySales = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_SALES));
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  const report = {
    startDate: startDate.toLocaleDateString(),
    endDate: endDate.toLocaleDateString(),
    total: 0,
    items: {},
    transactions: 0
  };
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toLocaleDateString();
    if (dailySales[dateKey]) {
      report.total += dailySales[dateKey].total;
      report.transactions += dailySales[dateKey].transactions.length;
      
      // تجميع الأصناف
      Object.entries(dailySales[dateKey].items).forEach(([id, item]) => {
        if (!report.items[id]) {
          report.items[id] = { ...item };
        } else {
          report.items[id].quantity += item.quantity;
          report.items[id].total += item.total;
        }
      });
    }
  }
  
  return {
    ...report,
    items: Object.values(report.items)
  };
}

function generateMonthlyReport(year, month) {
  const dailySales = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_SALES));
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  const report = {
    month: `${year}-${month.toString().padStart(2, '0')}`,
    total: 0,
    items: {},
    transactions: 0
  };
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toLocaleDateString();
    if (dailySales[dateKey]) {
      report.total += dailySales[dateKey].total;
      report.transactions += dailySales[dateKey].transactions.length;
      
      // تجميع الأصناف
      Object.entries(dailySales[dateKey].items).forEach(([id, item]) => {
        if (!report.items[id]) {
          report.items[id] = { ...item };
        } else {
          report.items[id].quantity += item.quantity;
          report.items[id].total += item.total;
        }
      });
    }
  }
  
  return {
    ...report,
    items: Object.values(report.items)
  };
}

// ============== واجهة التقارير ==============
function displayReport(report) {
  const reportContainer = document.getElementById('report-container');
  
  if (!reportContainer) return;
  
  let reportHTML = `
    <div class="report-header">
      <h2>${getReportTitle(report)}</h2>
      <div class="report-period">${getReportPeriod(report)}</div>
    </div>
    
    <div class="report-summary">
      <div class="summary-card total-sales">
        <i class="fas fa-receipt"></i>
        <div>
          <h3>إجمالي المبيعات</h3>
          <p>${report.total.toFixed(2)} جنيهاً</p>
        </div>
      </div>
      <div class="summary-card transactions-count">
        <i class="fas fa-file-invoice"></i>
        <div>
          <h3>عدد الفواتير</h3>
          <p>${report.transactions || 0}</p>
        </div>
      </div>
      <div class="summary-card items-count">
        <i class="fas fa-list-ol"></i>
        <div>
          <h3>عدد الأصناف المباعة</h3>
          <p>${report.items.length}</p>
        </div>
      </div>
    </div>
    
    <div class="report-details">
      <h3><i class="fas fa-table"></i> تفاصيل المبيعات حسب الأصناف</h3>
      <div class="table-responsive">
        <table class="report-table">
          <thead>
            <tr>
              <th>الصنف</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
  `;
  
  report.items.forEach(item => {
    reportHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.price.toFixed(2)} جنيهاً</td>
        <td>${item.quantity}</td>
        <td>${item.total.toFixed(2)} جنيهاً</td>
      </tr>
    `;
  });
  
  reportHTML += `
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  reportContainer.innerHTML = reportHTML;
}

function getReportTitle(report) {
  if (report.month) {
    return `تقرير شهري - ${report.month}`;
  } else if (report.startDate) {
    return `تقرير أسبوعي`;
  } else {
    return `تقرير يومي - ${report.date}`;
  }
}

function getReportPeriod(report) {
  if (report.month) {
    const [year, month] = report.month.split('-');
    const monthName = new Date(year, month - 1).toLocaleDateString('ar-EG', { month: 'long' });
    return `شهر ${monthName} ${year}`;
  } else if (report.startDate) {
    return `من ${report.startDate} إلى ${report.endDate}`;
  } else {
    return report.date;
  }
}

// ============== تهيئة التطبيق ==============
document.addEventListener('DOMContentLoaded', function() {
  initializeStorage();
  
  // إذا كانت صفحة التقارير
  if (document.getElementById('report-type')) {
    setupReportPage();
  }
});

function setupReportPage() {
  // تعيين التاريخ الحالي كقيمة افتراضية
  const today = new Date();
  document.getElementById('report-date').valueAsDate = today;
  
  // عرض تقرير اليوم عند التحميل
  const dailyReport = generateDailyReport(today);
  displayReport(dailyReport);
  
  // إعداد مستمعي الأحداث
  document.getElementById('report-type').addEventListener('change', updateReport);
  document.getElementById('report-date').addEventListener('change', updateReport);
}

function updateReport() {
  const reportType = document.getElementById('report-type').value;
  const dateInput = document.getElementById('report-date').value;
  
  if (!dateInput) return;
  
  const selectedDate = new Date(dateInput);
  
  let report;
  switch (reportType) {
    case 'daily':
      report = generateDailyReport(selectedDate);
      break;
    case 'weekly':
      // حساب بداية الأسبوع (الأحد)
      const startDate = new Date(selectedDate);
      startDate.setDate(selectedDate.getDate() - selectedDate.getDay());
      report = generateWeeklyReport(startDate);
      break;
    case 'monthly':
      report = generateMonthlyReport(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
      break;
  }
  
  displayReport(report);
}
