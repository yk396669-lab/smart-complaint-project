function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const user = DB.users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        if (user.role === 'ADMIN') { initAdminDashboard(); showPage('adminDashboard'); }
        else { initStudentDashboard(); showPage('studentDashboard'); }
    } else {
        showAlert('loginAlert', 'Invalid email or password', 'error');
    }
}

function handleRegister() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const hostel = parseInt(document.getElementById('regHostel').value);
    const password = document.getElementById('regPassword').value;
    if (DB.users.find(u => u.email === email)) {
        showAlert('registerAlert', 'Email exists', 'error');
        return;
    }
    DB.users.push({ id: DB.users.length + 1, email, password, name, hostel, role: 'STUDENT' });
    showAlert('registerAlert', 'Account created!', 'success');
    setTimeout(() => { document.getElementById('loginEmail').value = email; document.getElementById('loginPassword').value = password; handleLogin(); }, 1500);
}

function initStudentDashboard() {
    document.getElementById('studentName').textContent = currentUser.name;
    refreshStudentData();
}

function refreshStudentData() {
    const mc = DB.complaints.filter(c => c.userId === currentUser.id).length;
    document.getElementById('myComplaintsCount').textContent = mc;
    document.getElementById('preventedCount').textContent = Math.floor(mc * 0.4);
    document.getElementById('hostelRisk').textContent = (Math.floor(Math.random() * 50) + 30) + '%';
    loadStudentComplaints();
    loadStudentHeatmap();
}

function loadStudentComplaints() {
    const mc = DB.complaints.filter(c => c.userId === currentUser.id);
    if (!mc.length) { document.getElementById('studentComplaints').innerHTML = '<p>No complaints</p>'; return; }
    let html = '<table><thead><tr><th>Date</th><th>Category</th><th>Location</th><th>Status</th><th>Severity</th></tr></thead><tbody>';
    mc.forEach(c => html += `<tr><td>${c.date}</td><td>${c.category}</td><td>${c.location}</td><td><span class="badge badge-${c.status.toLowerCase().replace(' ', '-')}">${c.status}</span></td><td>${c.severity}</td></tr>`);
    html += '</tbody></table>';
    document.getElementById('studentComplaints').innerHTML = html;
}

function loadStudentHeatmap() {
    const h = DB.hostels.find(x => x.id === currentUser.hostel)?.name || 'Your Hostel';
    let html = `<div class="heatmap-row"><div style="font-weight: 600;">${h}</div><div class="heatmap-cells">`;
    DB.categories.forEach(cat => { const r = Math.floor(Math.random() * 100); const cl = r < 35 ? 'risk-low' : r < 70 ? 'risk-medium' : 'risk-high'; html += `<div class="heatmap-cell ${cl}">${r}%</div>`; });
    html += '</div></div>';
    document.getElementById('studentHeatmap').innerHTML = html;
}

function handleSubmitComplaint() {
    const cat = document.getElementById('category').value;
    const loc = document.getElementById('location').value.trim();
    const desc = document.getElementById('description').value.trim();
    const urg = document.getElementById('urgency').value;
    if (!cat || !loc || !desc) { showAlert('submitAlert', 'Fill all fields', 'error'); return; }
    DB.complaints.push({ id: DB.complaints.length + 1, userId: currentUser.id, hostel: currentUser.hostel, category: cat, location: loc, description: desc, status: 'Open', date: new Date().toISOString().split('T')[0], severity: urg, preventive: false });
    showAlert('submitAlert', 'Complaint submitted!', 'success');
    document.getElementById('complaintForm').reset();
    setTimeout(() => { refreshStudentData(); showStudentTab('complaints'); }, 1000);
}

function initAdminDashboard() {
    document.getElementById('adminName').textContent = currentUser.name;
    refreshAdminData();
}

function refreshAdminData() {
    document.getElementById('totalComplaints').textContent = DB.complaints.length;
    document.getElementById('preventiveTickets').textContent = DB.complaints.filter(c => c.preventive).length;
    document.getElementById('modelAccuracy').textContent = '78%';
    document.getElementById('highRiskAreas').textContent = DB.predictions.filter(p => p.risk >= 70).length;
    loadAllComplaints();
    loadAdminHeatmap();
    loadMaintenance();
}

function loadAllComplaints() {
    if (!DB.complaints.length) { document.getElementById('allComplaintsTable').innerHTML = '<p>No complaints</p>'; return; }
    let html = '<table><thead><tr><th>Date</th><th>Hostel</th><th>Category</th><th>Status</th><th>Type</th></tr></thead><tbody>';
    DB.complaints.forEach(c => { const h = DB.hostels.find(x => x.id === c.hostel)?.name; html += `<tr><td>${c.date}</td><td>${h}</td><td>${c.category}</td><td><span class="badge badge-${c.status.toLowerCase().replace(' ', '-')}">${c.status}</span></td><td><span class="badge badge-${c.preventive ? 'preventive' : 'open'}">${c.preventive ? 'Preventive' : 'User'}</span></td></tr>`; });
    html += '</tbody></table>';
    document.getElementById('allComplaintsTable').innerHTML = html;
}

function loadAdminHeatmap() {
    let html = '';
    [1, 2, 3, 4].forEach(id => { const h = DB.hostels.find(x => x.id === id); html += `<div class="heatmap-row"><div style="font-weight: 600;">${h.name}</div><div class="heatmap-cells">`; DB.categories.forEach(cat => { const r = Math.floor(Math.random() * 100); const cl = r < 35 ? 'risk-low' : r < 70 ? 'risk-medium' : 'risk-high'; html += `<div class="heatmap-cell ${cl}">${r}%</div>`; }); html += '</div></div>'; });
    document.getElementById('adminHeatmap').innerHTML = html;
}

function loadMaintenance() {
    const p = DB.complaints.filter(c => c.preventive);
    if (!p.length) { document.getElementById('maintenanceTable').innerHTML = '<p>No preventive orders</p>'; return; }
    let html = '<table><thead><tr><th>Date</th><th>Hostel</th><th>Category</th><th>Status</th></tr></thead><tbody>';
    p.forEach(c => { const h = DB.hostels.find(x => x.id === c.hostel)?.name; html += `<tr><td>${c.date}</td><td>${h}</td><td>${c.category}</td><td><span class="badge badge-preventive">Preventive</span></td></tr>`; });
    html += '</tbody></table>';
    document.getElementById('maintenanceTable').innerHTML = html;
}

function runPredictionEngine() {
    DB.predictions = [];
    let count = 0;
    [1, 2, 3, 4].forEach(hid => { DB.categories.forEach(cat => { const r = Math.floor(Math.random() * 100); DB.predictions.push({ hostelId: hid, category: cat, risk: r }); if (r >= 70 && !DB.complaints.find(c => c.hostel === hid && c.category === cat && c.preventive)) { DB.complaints.push({ id: DB.complaints.length + 1, userId: 1, hostel: hid, category: cat, location: 'General', description: 'Preventive inspection', status: 'In Progress', date: new Date().toISOString().split('T')[0], severity: 'Medium', preventive: true }); count++; } }); });
    refreshAdminData();
    alert(`✓ ${count} preventive tickets generated!`);
}
