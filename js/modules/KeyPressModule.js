import { showConfirmDelete } from './deleteModule.js';

export function initKeyboardShortcuts(storage) {
    window.addEventListener('keydown', (e) => {
        const modalOverlay = document.getElementById('post-modal-overlay')
        const postForm = document.getElementById('new-post-form');
        const closeModal = () => {
            modalOverlay.style.display = 'none';
            if (postForm) postForm.reset();
        };
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

        const titleInput = document.getElementById('form-title')
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
                showConfirmDelete(postId, activePost, storage);
            }
        }
    }, true);
}