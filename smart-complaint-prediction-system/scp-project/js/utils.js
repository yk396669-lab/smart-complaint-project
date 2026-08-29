let currentUser = null;

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showStudentTab(name) {
    document.querySelectorAll('#studentDashboard .tab').forEach(t => t.style.display = 'none');
    document.getElementById('student-' + name).style.display = 'block';
}

function showAdminTab(name) {
    document.querySelectorAll('#adminDashboard .tab').forEach(t => t.style.display = 'none');
    document.getElementById('admin-' + name).style.display = 'block';
}

function showAlert(id, msg, type) {
    const alert = document.getElementById(id);
    alert.textContent = msg;
    alert.className = `alert alert-${type} show`;
    setTimeout(() => alert.classList.remove('show'), 4000);
}

function logout() {
    currentUser = null;
    document.getElementById('loginForm').reset();
    showPage('loginPage');
}
