import User from './core/User.js';
import AdminUser from './core/AdminUser.js';
import { Post } from './core/Post.js'

import { TextFormatter, initPostDetails } from './text-formatter.js';
import { highlightActiveLink, FilterPosts } from './navigation.js';
import { masterAdmin } from './adminModule.js';
import { SaveData } from './SaveData.js';

const blogStorage = new SaveData('Blog_');

window.TextFormatter = TextFormatter;
window.highlightActiveLink = highlightActiveLink;
window.FilterPosts = FilterPosts;
window.CreatePosts = CreatePosts; 
window.User = User;
window.AdminUser = AdminUser;
window.masterAdmin = masterAdmin;

console.log("Сайт загружен");

var links = document.querySelectorAll('.nav-link');

for (var i = 0; i < links.length; i++) 
{
    links[i].addEventListener('click', function (event) 
    {
        event.preventDefault();

        console.log(this.textContent.trim());

        var clickedLink = this;

        setTimeout(function () 
        {
            window.location.href = clickedLink.href; 
        }, 1000);
    });
}

function CreatePosts(data)
{
    let posts = document.querySelector('#post-list');

    if (!posts)
    {
        return;
    }

    let newItem = document.createElement('li');
    newItem.setAttribute('data-date', data.date);
    newItem.setAttribute('data-views', data.views);
    newItem.setAttribute('data-tags', data.tags);
    newItem.setAttribute('data-content', data.content);

    newItem.style.cursor = 'pointer';

    let span = document.createElement('span');
    span.classList.add('post-title');
    span.textContent = data.title;

    let div = document.createElement('div');
    div.classList.add('post-stats-node');
    div.style.fontSize = '0.8em';
    div.style.color = 'gray';

    let spanDate = document.createElement('span');
    spanDate.classList.add('stats-date');
    spanDate.textContent = data.date;
    
    let spanReadTime = document.createElement('span');
    spanReadTime.classList.add('stats-read-time');

    const wordCount = data.content.split(/\s+/).length;
    spanReadTime.textContent = `Время чтения: ${Math.ceil(wordCount / 200)} мин.`;
    
    let spanDetails = document.createElement('span');
    spanDetails.classList.add('stats-details');
    // spanDetails.textContent = `Теги: ${data.tags}`;
    spanDetails.textContent = `Теги: `;
    data.tags.split(',').forEach(tag => {
    let tagBtn = document.createElement('button'); 
    tagBtn.classList.add('tag');                  
    tagBtn.textContent = tag.trim();              
    spanDetails.append(tagBtn);
});

    div.append(spanDate, " | ", spanReadTime, " | ", spanDetails);

    let contentPreviewDiv = document.createElement('div');
    contentPreviewDiv.classList.add('post-content-preview');
    contentPreviewDiv.style.marginTop = '10px';

    if (typeof TextFormatter !== 'undefined') {
        // const shortText = TextFormatter.truncate(100, '...')(data.content);
        // contentPreviewDiv.innerHTML = TextFormatter.applyFullFormatting(shortText);
        const formattedContent = TextFormatter.applyFullFormatting(data.content);
        contentPreviewDiv.innerHTML = formattedContent;
    }

    newItem.append(span, div, contentPreviewDiv);
    posts.appendChild(newItem);
}

window.onload = function () 
{
    var header = document.querySelector('header');
    header.style.backgroundColor = 'lightblue';

    var footer = document.querySelector('footer');
    var date = new Date();

    var day = String(date.getDate()).padStart(2, '0'); 
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var year = date.getFullYear();

    var formattedDate = day + '.' + month + '.' + year;
    footer.textContent = "© 2026 Мистер Денискис. Все права защищены. Текущая дата: " + formattedDate;

    if (typeof highlightActiveLink === 'function') highlightActiveLink();
    if (typeof FilterPosts === 'function') FilterPosts();

    setTimeout(() => {
        if (typeof TextFormatter !== 'undefined' && TextFormatter.HighlightTodayPosts) {
            TextFormatter.HighlightTodayPosts();
        } else {
            console.error("Критическая ошибка: HighlightTodayPosts не определен!");
        }
    }, 100);
};


const postsData = [
{ date: "2023-10-01", views: "150", tags: "js, frontend", content: "```javascript\n" + `for (var i = 0; i < links.length; i++) \nconsole.log(link[i])` + "\n```", title: "Пост 1" },
{ date: "2024-01-15", views: "500", tags: "html, css", content: "{}gsdfhjsa<>", title: "Пост 2" },
{ date: "2023-12-20", views: "50", tags: "life, blog", content: "Мои мысли сегодня", title: "Пост 3" },
{ date: "2024-02-01", views: "300", tags: "js, react", content: "Текст про реакт", title: "Пост 4" },
{ date: "2023-05-10", views: "1000", tags: "news", content: "Важное объявление", title: "Пост 5" },
{ date: "2026-2-26", views: "50", tags: "life, blog", content: "Мои мысли сегодня", title: "Пост 6" },
{ date: "2026-3-10", views: "50", tags: "life, blog", content: "Классный текст, ваще все круто", title: "Пост 7" }];

const dynamicPosts = blogStorage.get('dynamic_posts') || [];
const allPosts = [...postsData, ...dynamicPosts];

document.addEventListener('DOMContentLoaded', () => {
const modalOverlay = document.getElementById('post-modal-overlay');
    const openBtn = document.getElementById('toggle-form-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    const postForm = document.getElementById('new-post-form');
    const publishButton = document.getElementById('btn-publish');

    // publishButton.addEventListener('click', () => {

    // });

    allPosts.forEach(post => CreatePosts(post));

    const closeModal = () => {
        modalOverlay.style.display = 'none';
        if (postForm) postForm.reset();
    };

    if (openBtn) {
        openBtn.onclick = () => {
            modalOverlay.style.display = 'flex';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }

    window.addEventListener('click', (event) => {
        if (event.target === modalOverlay) closeModal();
    });

    if (postForm) {
        postForm.onsubmit = (e) => {
            e.preventDefault();

            const title = document.getElementById('form-title').value;
            const tags = document.getElementById('form-tags').value;
            const content = document.getElementById('form-content').value;

            const newPostInstance = new Post(title, content, 99, tags);
            const postObject = newPostInstance.createNewPost();

            CreatePosts(postObject);

            const currentDynamic = blogStorage.get('dynamic_posts') || [];
            currentDynamic.push(postObject);
            blogStorage.set('dynamic_posts', currentDynamic);

            if (typeof masterAdmin !== 'undefined') {
                masterAdmin.externalLog(`Опубликован пост через класс Post: ${title}`);
            }

            closeModal();
            alert('Пост успешно опубликован!');
        };
    }

    setTimeout(() => {
        if (typeof initPostDetails === 'function') {
            initPostDetails(allPosts);
        }
    }, 200);

    initDemo();

    try {
        demoInheritance();
    } 
    catch (e) {
        console.error("Ошибка в процессе выполнения демо:", e);
    }
});


function demoInheritance() {
    if (typeof User === 'undefined' || typeof AdminUser === 'undefined') {
        console.error("КРИТИЧЕСКАЯ ОШИБКА: Классы User или AdminUser не найдены!");
        return;
    }

    console.log("Кнопка нажата, запускаю демо...");
    let user = new User(1, 'Michael');
    const admin = window.masterAdmin;

    if (!admin) {
        console.error("Админ не инициализирован!");
        return;
    }

    console.log(user.getInfo());
    console.log(admin.getInfo());

    admin.grantPermission('manage_users');
    console.log(admin.getPermissions());

    console.log("Список прав:", admin.getPermissions());

    if (admin.canManageUsers()) {
        admin.banUser(user.id, "Нарушение правил сообщества");
    }
    for(let i = 0; i < 6; i++) admin.grantPermission(`rule_${i}`);

    console.table(admin.getLogs());
}

function demoButton() {
    const oldBtn = document.getElementById('demoBtn');
    if (oldBtn) oldBtn.remove();

    const btn = document.createElement('button');
    btn.id = 'demoBtn';
    btn.innerHTML = 'Запустить Демо ООП';

    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '10000', 
        padding: '15px 25px',
        backgroundColor: '#ff4757',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        display: 'block'
    });

    btn.onclick = demoInheritance;

    document.body.appendChild(btn);
    console.log("Кнопка создана программно и добавлена в body");
}

    demoButton();
    demoInheritance();


    function initDemo() {
    console.log("Попытка создания кнопки...");
    const btnId = 'demoBtn';
    if (document.getElementById(btnId)) return;

    const btn = document.createElement('button');
    btn.id = btnId;
    btn.textContent = 'ЗАПУСТИТЬ ДЕМО ООП';

    btn.setAttribute('style', `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 99999 !important;
        padding: 20px !important;
        background: red !important;
        color: white !important;
        display: block !important;
        cursor: pointer !important;
    `);

    btn.onclick = () => {
        console.log("Кнопка нажата!");
        demoInheritance();
    };

    document.body.appendChild(btn);
}

const admin = new AdminUser(1, 'Denis', blogStorage);

admin.grantPermission('manage_users');
admin.grantPermission('publish_posts');

console.log('Текущие права:', admin.getPermissions());