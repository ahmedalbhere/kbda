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
