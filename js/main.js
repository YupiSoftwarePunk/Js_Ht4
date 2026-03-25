import User from './core/User.js';
import AdminUser from './core/AdminUser.js';
import { Post } from './core/Post.js'
import { createLike } from './modules/PostLikeModule.js';
import { demoInheritance, demoButton, initDemo } from './modules/inheritanceModule.js';
import { TextFormatter } from './text-formatter.js';
import { highlightActiveLink, FilterPosts } from './navigation.js';
import { masterAdmin } from './modules/adminModule.js';
import { SaveData } from './SaveData.js';
import { initPostDetails, CreatePosts } from './modules/postModule.js';
import { initTags } from './modules/tagModule.js';
import { showConfirmDelete } from './modules/deleteModule.js';

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
{ id: 1, date: "2023-10-01", views: "150", tags: "js, frontend", content: "```javascript\n" + `for (var i = 0; i < links.length; i++) \nconsole.log(link[i])` + "\n```", title: "Пост 1" },
{ id: 2, date: "2024-01-15", views: "500", tags: "html, css", content: "{}gsdfhjsa<>", title: "Пост 2" },
{ id: 3, date: "2023-12-20", views: "50", tags: "life, blog", content: "Мои мысли сегодня", title: "Пост 3" },
{ id: 4, date: "2024-02-01", views: "300", tags: "js, react", content: "Текст про реакт", title: "Пост 4" },
{ id: 5, date: "2023-05-10", views: "1000", tags: "news", content: "Важное объявление", title: "Пост 5" },
{ id: 6, date: "2026-2-26", views: "50", tags: "life, blog", content: "Мои мысли сегодня", title: "Пост 6" },
{ id: 7, date: "2026-3-10", views: "50", tags: "life, blog", content: "Классный текст, ваще все круто", title: "Пост 7" }];

const dynamicPosts = blogStorage.get('dynamic_posts') || [];
const allPosts = [...postsData, ...dynamicPosts];

document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('post-modal-overlay');
    const openBtn = document.getElementById('toggle-form-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    const postForm = document.getElementById('new-post-form');

    const titleInput = document.getElementById('form-title');
    const tagsInput = document.getElementById('form-tags');
    const contentInput = document.getElementById('form-content');

    allPosts.forEach(post => CreatePosts(post, blogStorage));

    initTags();

    const closeModal = () => {
        modalOverlay.style.display = 'none';
        if (postForm) postForm.reset();
    };

    if (openBtn) {
        openBtn.onclick = () => {
            modalOverlay.style.display = 'flex';
            titleInput.focus();
        };
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modalOverlay && modalOverlay.style.display === 'flex') {
                closeModal();
            }
            const adminModal = document.getElementById('admin-modal');
            if (adminModal && (adminModal.style.display === 'block' || adminModal.style.display === 'flex')) {
                const adminCloseBtn = document.getElementById('admin-close-btn');
                if (adminCloseBtn) adminCloseBtn.click();
            }

            const postModal = document.querySelector('#post-detail-modal');
            const closePostModal = document.querySelector('#detail-close-btn');
            if (postModal && (postModal.style.display === 'block' || postModal.style.display === 'flex')) {
                if (closePostModal) closePostModal.click();
            }

            const deleteOverlay = document.querySelector('.delete-overlay');
            if (deleteOverlay) deleteOverlay.remove();
            return;
        }

        if (e.key === 'Enter') {
            const deleteOverlay = document.querySelector('.delete-overlay');
            if (deleteOverlay) {
                e.preventDefault();
                const okBtn = deleteOverlay.querySelector('#confirm-yes');
                if (okBtn) okBtn.click();
                return;
            }
        }

        if (e.ctrlKey && (e.key === '/' || e.code === 'Slash')) {
            e.preventDefault(); 
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
            }
            return;
        }

        if (e.altKey && (e.code === 'KeyN' || e.key.toLowerCase() === 'т')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('Попытка открыть форму через Ctrl+N');

            if (modalOverlay) {
                modalOverlay.style.display = 'flex';
                if (titleInput) titleInput.focus();
            }
        return false;
        }

        const activePost = document.activeElement.closest('.focusable-post');
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault(); 
            const allFocusable = Array.from(document.querySelectorAll('.focusable-post'));
            const currentIndex = allFocusable.indexOf(activePost);
            
            if (e.key === 'ArrowDown' && currentIndex < allFocusable.length - 1) {
                allFocusable[currentIndex + 1].focus();
            } 
            else if (e.key === 'ArrowUp' && currentIndex > 0) {
                allFocusable[currentIndex - 1].focus();
            }
        }

        if (activePost) {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                e.stopImmediatePropagation();
                const likeBtn = activePost.querySelector('.post-like-container'); 
                if (likeBtn) {
                    likeBtn.click();
                }
            }

            if (e.code === 'KeyE' || e.key.toLowerCase() === 'у') {
                activePost.click();
            }

            if (e.key === 'Delete') {
                const postId = activePost.id;
                showConfirmDelete(postId, activePost, blogStorage);
            }
        }
    }, true);

    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }

    window.addEventListener('click', (event) => {
        if (event.target === modalOverlay) closeModal();
    });

    if (contentInput) {
        contentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault(); 
                postForm.requestSubmit();
            }
        });
    }

    if (postForm) {
        postForm.onsubmit = (e) => {
            e.preventDefault();

            const title = document.getElementById('form-title').value;
            const tags = document.getElementById('form-tags').value;
            const content = document.getElementById('form-content').value;

            const newPostInstance = new Post(title, content, 99, tags);
            const postObject = newPostInstance.createNewPost();

            CreatePosts(postObject, blogStorage);

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

    demoButton();
    demoInheritance();

const admin = new AdminUser(1, 'Denis', blogStorage);

admin.grantPermission('manage_users');
admin.grantPermission('publish_posts');

console.log('Текущие права:', admin.getPermissions());