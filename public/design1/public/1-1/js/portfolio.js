// portfolio.js - 作品集功能
function initPortfolio() {
    console.log('作品集已初始化');
    
    // 获取所有作品项
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // 为有链接的作品项添加事件监听器
    portfolioItems.forEach(item => {
        // 检查是否有链接
        const hasLink = item.querySelector('.portfolio-link') !== null;
        
        if (hasLink) {
            // 有链接的作品项添加事件监听器
            item.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 769) {
                    document.body.classList.add('link-hover');
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 769) {
                    document.body.classList.remove('link-hover');
                }
            });
            
            // 点击效果
            item.addEventListener('mousedown', (e) => {
                if (window.customCursor && window.innerWidth >= 769) {
                    window.customCursor.showClickEffect(e);
                }
            });
        } else {
            // 无链接的作品项：移除所有交互效果
            // 确保没有链接的作品项有no-link类
            item.classList.add('no-link');
            
            // 移除所有可能的事件监听器
            item.style.cursor = 'default';
            item.style.pointerEvents = 'none';
            
            // 移除内部的遮蔽框（如果存在）
            const overlay = item.querySelector('.portfolio-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }
    });
}