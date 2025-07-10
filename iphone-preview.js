// iPhone Preview JavaScript
class IPhonePreview {
    constructor() {
        this.isFullscreen = false;
        this.isLandscape = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupIframe();
    }

    bindEvents() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshIframe();
        });

        // Fullscreen button
        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Rotate button
        document.getElementById('rotateBtn').addEventListener('click', () => {
            this.toggleRotation();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Handle iframe load
        const iframe = document.querySelector('.iphone-screen iframe');
        iframe.addEventListener('load', () => {
            this.onIframeLoad();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupIframe() {
        const iframe = document.querySelector('.iphone-screen iframe');
        const screen = document.querySelector('.iphone-screen');
        
        // Add loading state
        screen.classList.remove('loaded');
        
        // Set iframe source
        iframe.src = 'index.html';
        
        // Add error handling
        iframe.addEventListener('error', () => {
            this.handleIframeError();
        });
    }

    onIframeLoad() {
        const screen = document.querySelector('.iphone-screen');
        screen.classList.add('loaded');
        
        // Add success animation
        this.showSuccessIndicator();
    }

    handleIframeError() {
        const screen = document.querySelector('.iphone-screen');
        screen.classList.add('loaded');
        
        // Show error message
        this.showErrorIndicator();
    }

    refreshIframe() {
        const iframe = document.querySelector('.iphone-screen iframe');
        const screen = document.querySelector('.iphone-screen');
        
        // Remove loaded class to show loading animation
        screen.classList.remove('loaded');
        
        // Add refresh animation to button
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.style.transform = 'rotate(360deg)';
        
        // Refresh iframe
        iframe.src = iframe.src;
        
        // Reset button animation after 1 second
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 1000);
    }

    toggleFullscreen() {
        const frame = document.querySelector('.iphone-frame');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const icon = fullscreenBtn.querySelector('i');
        
        if (this.isFullscreen) {
            // Exit fullscreen
            frame.classList.remove('fullscreen');
            icon.className = 'fas fa-expand';
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>Fullscreen';
            this.isFullscreen = false;
            
            // Show other controls
            document.querySelector('.iphone-controls').style.display = 'flex';
        } else {
            // Enter fullscreen
            frame.classList.add('fullscreen');
            icon.className = 'fas fa-compress';
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>Exit Fullscreen';
            this.isFullscreen = true;
            
            // Hide other controls in fullscreen
            document.querySelector('.iphone-controls').style.display = 'none';
        }
    }

    toggleRotation() {
        const frame = document.querySelector('.iphone-frame');
        const rotateBtn = document.getElementById('rotateBtn');
        
        if (this.isLandscape) {
            // Rotate to portrait
            frame.classList.remove('landscape');
            this.isLandscape = false;
            
            // Add rotation animation
            frame.style.transform = 'rotate(0deg)';
        } else {
            // Rotate to landscape
            frame.classList.add('landscape');
            this.isLandscape = true;
            
            // Add rotation animation
            frame.style.transform = 'rotate(90deg)';
        }
        
        // Reset transform after animation
        setTimeout(() => {
            frame.style.transform = '';
        }, 300);
    }

    handleKeyboardShortcuts(e) {
        // Escape key to exit fullscreen
        if (e.key === 'Escape' && this.isFullscreen) {
            this.toggleFullscreen();
        }
        
        // R key to refresh
        if (e.key === 'r' || e.key === 'R') {
            this.refreshIframe();
        }
        
        // F key to toggle fullscreen
        if (e.key === 'f' || e.key === 'F') {
            this.toggleFullscreen();
        }
        
        // L key to rotate
        if (e.key === 'l' || e.key === 'L') {
            this.toggleRotation();
        }
    }

    handleResize() {
        // Adjust iPhone frame size based on window size
        const frame = document.querySelector('.iphone-frame');
        const windowWidth = window.innerWidth;
        
        if (windowWidth < 480) {
            frame.style.width = '200px';
            frame.style.height = '410px';
        } else if (windowWidth < 768) {
            frame.style.width = '240px';
            frame.style.height = '490px';
        } else {
            frame.style.width = '280px';
            frame.style.height = '570px';
        }
    }

    showSuccessIndicator() {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = '<i class="fas fa-check"></i> Chatbot loaded successfully!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
            z-index: 1001;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showErrorIndicator() {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to load chatbot';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
            z-index: 1001;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Utility methods
    getIframeDocument() {
        const iframe = document.querySelector('.iphone-screen iframe');
        try {
            return iframe.contentDocument || iframe.contentWindow.document;
        } catch (e) {
            return null;
        }
    }

    injectStyles() {
        const iframe = document.querySelector('.iphone-screen iframe');
        const iframeDoc = this.getIframeDocument();
        
        if (iframeDoc) {
            // Inject mobile-specific styles
            const style = iframeDoc.createElement('style');
            style.textContent = `
                body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
                .chatbot-container {
                    height: 100vh !important;
                    max-width: 100% !important;
                    border-radius: 0 !important;
                }
            `;
            iframeDoc.head.appendChild(style);
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .success-notification i,
    .error-notification i {
        font-size: 16px;
    }
`;
document.head.appendChild(style);

// Initialize iPhone preview when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IPhonePreview();
});

// Export for global access
window.IPhonePreview = IPhonePreview; 