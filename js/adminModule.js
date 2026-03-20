import AdminUser from './core/AdminUser.js';
import { SaveData } from './SaveData.js';

const blogStorage = new SaveData('Blog_');

export const masterAdmin = new AdminUser(99, "Денис", blogStorage);
masterAdmin.grantPermission('manage_users');

let users = [
    { id: 1, name: "Иван Иванов", role: "user", permissions: [] },
    { id: 2, name: "Мария Смирнова", role: "user", permissions: ["editor"] },
    { id: 3, name: "Петр Техник", role: "user", permissions: [] }
];

document.addEventListener('DOMContentLoaded', () => {
    const adminBtn = document.getElementById('admin-login-btn');
    const adminModal = document.getElementById('admin-modal');
    const adminOverlay = document.getElementById('admin-overlay');
    const closeBtn = document.getElementById('admin-close-btn');

    adminBtn.addEventListener('click', () => {
        const password = prompt("Введите пароль администратора:");
        if (password === "admin123") { 
            adminModal.style.display = 'block';
            adminOverlay.style.display = 'block';
            renderUserList();
            addLog("Вход в систему выполнен");
        } else {
            alert("Доступ запрещен!");
        }
    });

    closeBtn.addEventListener('click', () => {
        adminModal.style.display = 'none';
        adminOverlay.style.display = 'none';
    });

    function renderUserList() {
        const tbody = document.getElementById('user-list-body');
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.insertAdjacentHTML('afterbegin',  `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td><span class="tag">${user.role}</span></td>
                <td>${user.permissions.join(', ') || 'нет'}</td>
                <td>
                    <button class="btn-grant" onclick="handleGrant(${user.id})">Дать права</button>
                    <button class="btn-ban" onclick="handleBan(${user.id})">Бан</button>
                </td>`);
            tbody.appendChild(tr);
        });
    }

    window.handleGrant = (userId) => {
        const perm = prompt("Введите название права (например, editor, moderator):");
        if (perm && masterAdmin.grantPermission(perm)) {
            const user = users.find(u => u.id === userId);
            if (user && !user.permissions.includes(perm)) {
                user.permissions.push(perm);
                addLog(`Выдано право "${perm}" пользователю ID:${userId}`);
                renderUserList();
            }
        }
    };

    window.handleBan = (userId) => {
        const reason = prompt("Причина блокировки:");
        if (reason) {
            masterAdmin.banUser(userId, reason);
            users = users.filter(u => u.id !== userId); 
            addLog(`Заблокирован пользователь ID:${userId}. Причина: ${reason}`);
            renderUserList();
        }
    };

    function addLog(message) {
        const log = document.getElementById('admin-log');
        const entry = document.createElement('div');
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        log.prepend(entry);

        if (masterAdmin && typeof masterAdmin.externalLog === 'function') {
            masterAdmin.externalLog(message);
        }
    }
});