const DB = {
    users: [
        { id: 1, email: 'admin@scp.com', password: 'Admin@123', name: 'Admin', role: 'ADMIN' },
        { id: 2, email: 'student@scp.com', password: 'Student@123', name: 'John', role: 'STUDENT', hostel: 1 }
    ],
    hostels: [{ id: 1, name: 'Hostel A' }, { id: 2, name: 'Hostel B' }, { id: 3, name: 'Hostel C' }, { id: 4, name: 'Hostel D' }],
    categories: ['Plumbing', 'Electrical', 'WiFi', 'Furniture', 'Cleanliness', 'Other'],
    complaints: [
        { id: 1, userId: 2, hostel: 1, category: 'Plumbing', location: 'A101', description: 'Water leak', status: 'Open', date: '2026-08-28', severity: 'High', preventive: false },
        { id: 2, userId: 2, hostel: 1, category: 'Electrical', location: 'A105', description: 'Socket broken', status: 'In Progress', date: '2026-08-27', severity: 'Medium', preventive: false }
    ],
    predictions: []
};
