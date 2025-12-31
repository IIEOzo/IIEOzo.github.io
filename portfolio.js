// portfolio.js - 优化版作品集功能
// 使用现代JavaScript API和性能优化

export class EnhancedPortfolio {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioCategories = document.querySelectorAll('.portfolio-category');
        this.currentFilter = 'brand';
        this.init();
    }

    init() {
        this.bindEvents();
        this.initIntersectionObserver();
        this.initImageOptimization();
        this.activateCategory('brand');
        console.log('🖼️ 增强作品集已初始化');
    }

    bindEvents() {
        // 筛选按钮事件
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilterClick(e));
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleFilterClick(e);
                }
            });
        });

        // 作品项点击事件
        document.addEventListener('click', (e) => {
            const portfolioItem = e.target.closest('.portfolio-item:not(.no-link)');
            if (portfolioItem) {
                this.handlePortfolioClick(portfolioItem);
            }
        });

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                this.handleKeyboardNavigation(e);
            }
        });
    }

    initIntersectionObserver() {
        // 图片懒加载
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '200px 0px',
                threshold: 0.01
            });

            document.querySelectorAll('.portfolio-item img').forEach(img => {
                if (img.loading !== 'lazy') {
                    img.loading = 'lazy';
                }
                imageObserver.observe(img);
            });
        }
    }

    initImageOptimization() {
        // 优化图片加载
        if ('loading' in HTMLImageElement.prototype) {
            // 浏览器支持原生懒加载
            document.querySelectorAll('img').forEach(img => {
                img.loading = 'lazy';
            });
        }
    }

    loadImage(img) {
        // 渐进式图片加载
        if (img.dataset.src) {
            const src = img.dataset.src;
            
            // 创建加载动画
            img.classList.add('loading');
            
            // 预加载图片
            const tempImg = new Image();
            tempImg.src = src;
            
            tempImg.onload = () => {
                img.src = src;
                img.classList.remove('loading');
                img.classList.add('loaded');
                delete img.dataset.src;
                
                // 触发加载完成事件
                img.dispatchEvent(new CustomEvent('image:loaded'));
            };
            
            tempImg.onerror = () => {
                console.error('图片加载失败:', src);
                img.classList.remove('loading');
                img.classList.add('error');
            };
        }
    }

    handleFilterClick(e) {
        const filter = e.target.dataset.filter;
        
        if (filter === this.currentFilter) return;
        
        // 更新按钮状态
        this.updateFilterButtons(filter);
        
        // 切换分类
        this.switchCategory(filter);
        
        // 更新URL
        this.updateURL(filter);
        
        // 发送分析事件
        this.trackFilterChange(filter);
    }

    updateFilterButtons(newFilter) {
        this.filterButtons.forEach(btn => {
            const isActive = btn.dataset.filter === newFilter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
            btn.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    }

    switchCategory(newFilter) {
        // 淡出当前分类
        this.deactivateCategory(this.currentFilter);
        
        // 淡入新分类
        setTimeout(() => {
            this.activateCategory(newFilter);
            this.currentFilter = newFilter;
        }, 300);
    }

    activateCategory(category) {
        const targetCategory = document.querySelector(`.portfolio-category[data-category="${category}"]`);
        if (!targetCategory) return;

        targetCategory.style.display = 'block';
        
        // 触发动画
        requestAnimationFrame(() => {
            targetCategory.style.opacity = '1';
            targetCategory.style.transform = 'translateY(0)';
            
            // 动画子元素
            this.animateCategoryItems(targetCategory);
            
            // 聚焦第一个作品项（无障碍）
            const firstItem = targetCategory.querySelector('.portfolio-item');
            if (firstItem) {
                firstItem.setAttribute('tabindex', '0');
            }
        });
    }

    deactivateCategory(category) {
        const targetCategory = document.querySelector(`.portfolio-category[data-category="${category}"]`);
        if (!targetCategory) return;

        targetCategory.style.opacity = '0';
        targetCategory.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            targetCategory.style.display = 'none';
        }, 300);
    }

    animateCategoryItems(category) {
        const items = category.querySelectorAll('.portfolio-item, .category-more-link');
        
        items.forEach((item, index) => {
            // 设置初始状态
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            // 交错动画
            setTimeout(() => {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                
                // 清除内联样式
                setTimeout(() => {
                    item.style.transition = '';
                    item.style.opacity = '';
                    item.style.transform = '';
                }, 400);
            }, index * 100);
        });
    }

    handlePortfolioClick(item) {
        const link = item.querySelector('a');
        if (!link) return;

        // 添加点击反馈
        item.classList.add('clicked');
        setTimeout(() => item.classList.remove('clicked'), 300);
        
        // 跟踪点击事件
        const title = item.querySelector('.portfolio-title')?.textContent || '未知作品';
        this.trackPortfolioClick(title, this.currentFilter);
    }

    handleKeyboardNavigation(e) {
        // 键盘左右切换分类
        const currentIndex = Array.from(this.filterButtons).findIndex(
            btn => btn.dataset.filter === this.currentFilter
        );
        
        let newIndex;
        if (e.key === 'ArrowRight') {
            newIndex = (currentIndex + 1) % this.filterButtons.length;
        } else if (e.key === 'ArrowLeft') {
            newIndex = (currentIndex - 1 + this.filterButtons.length) % this.filterButtons.length;
        }
        
        const newFilter = this.filterButtons[newIndex].dataset.filter;
        this.switchCategory(newFilter);
        this.updateFilterButtons(newFilter);
        
        // 聚焦新按钮
        this.filterButtons[newIndex].focus();
    }

    updateURL(filter) {
        // 更新URL而不重新加载页面
        const url = new URL(window.location);
        url.searchParams.set('filter', filter);
        window.history.replaceState({}, '', url);
    }

    trackFilterChange(filter) {
        // 发送分析数据
        const data = {
            event: 'portfolio_filter_change',
            filter: filter,
            timestamp: new Date().toISOString()
        };
        
        console.log('📊 筛选变更:', data);
        // 这里可以集成分析工具如Google Analytics
    }

    trackPortfolioClick(title, category) {
        const data = {
            event: 'portfolio_item_click',
            title: title,
            category: category,
            timestamp: new Date().toISOString()
        };
        
        console.log('📊 作品点击:', data);
    }
}

// URL参数处理
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        filter: params.get('filter') || 'brand'
    };
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.portfolio-container')) {
        window.enhancedPortfolio = new EnhancedPortfolio();
        
        // 检查URL参数
        const params = getURLParams();
        if (params.filter && params.filter !== 'brand') {
            window.enhancedPortfolio.switchCategory(params.filter);
            window.enhancedPortfolio.updateFilterButtons(params.filter);
        }
    }
});