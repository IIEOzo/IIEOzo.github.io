// portfolio.js - 作品集功能（优化版）
// 支持新的分类结构，删除模态框功能

class Portfolio {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioCategories = document.querySelectorAll('.portfolio-category');
        this.currentFilter = 'brand';
        
        // 动画配置
        this.animationConfig = {
            itemDelay: 60, // 项目动画延迟
            fadeDuration: 300, // 淡入淡出持续时间
            staggerDelay: 50 // 交错动画延迟
        };
        
        // 绑定方法
        this.onFilterClick = this.onFilterClick.bind(this);
        this.onPortfolioItemClick = this.onPortfolioItemClick.bind(this);
    }
    
    // 初始化作品集
    init() {
        // 初始化：只显示品牌设计
        this.showCategory('brand');
        
        // 为每个按钮绑定点击事件
        this.filterButtons.forEach(button => {
            button.addEventListener('click', this.onFilterClick);
        });
        
        // 为作品项添加点击事件（用于外部链接）
        document.querySelectorAll('.portfolio-item:not(.no-link)').forEach(item => {
            item.addEventListener('click', this.onPortfolioItemClick);
        });
        
        console.log('作品集系统已初始化');
    }
    
    // 过滤按钮点击事件
    onFilterClick(event) {
        const button = event.currentTarget;
        const targetFilter = button.getAttribute('data-filter');
        
        if (targetFilter === this.currentFilter) return;
        
        // 更新按钮状态
        this.updateButtonStates(button);
        
        // 切换作品分类
        this.switchCategory(targetFilter);
        
        this.currentFilter = targetFilter;
    }
    
    // 作品项点击事件
    onPortfolioItemClick(event) {
        // 防止事件冒泡到父元素
        event.stopPropagation();
        
        const link = event.currentTarget.querySelector('a.portfolio-link');
        if (link) {
            // 可以在这里添加点击动画
            event.currentTarget.style.transform = 'scale(0.98)';
            setTimeout(() => {
                event.currentTarget.style.transform = '';
            }, 150);
        }
    }
    
    // 更新按钮状态
    updateButtonStates(activeButton) {
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-pressed', 'true');
    }
    
    // 显示指定分类
    showCategory(category) {
        this.portfolioCategories.forEach(categoryEl => {
            if (categoryEl.dataset.category === category) {
                categoryEl.style.display = 'block';
                categoryEl.style.opacity = '1';
                categoryEl.style.transform = 'translateY(0)';
                
                // 延迟显示该分类下的所有项目
                setTimeout(() => {
                    this.animateCategoryItems(categoryEl);
                }, this.animationConfig.fadeDuration);
            } else {
                categoryEl.style.display = 'none';
                categoryEl.style.opacity = '0';
                categoryEl.style.transform = 'translateY(20px)';
                
                // 隐藏其他分类的"查看更多"链接
                const moreLink = categoryEl.querySelector('.category-more-link');
                if (moreLink) {
                    moreLink.style.opacity = '0';
                    moreLink.style.transform = 'translateY(20px)';
                }
            }
        });
    }
    
    // 切换作品分类
    switchCategory(targetFilter) {
        const outgoingCategory = document.querySelector(`.portfolio-category[data-category="${this.currentFilter}"]`);
        const incomingCategory = document.querySelector(`.portfolio-category[data-category="${targetFilter}"]`);
        
        if (!outgoingCategory || !incomingCategory) return;
        
        // 淡出当前分类
        outgoingCategory.style.opacity = '0';
        outgoingCategory.style.transform = 'translateY(20px)';
        
        // 隐藏当前分类的"查看更多"链接
        const outgoingMoreLink = outgoingCategory.querySelector('.category-more-link');
        if (outgoingMoreLink) {
            outgoingMoreLink.style.opacity = '0';
            outgoingMoreLink.style.transform = 'translateY(20px)';
        }
        
        // 短暂延迟后切换显示
        setTimeout(() => {
            outgoingCategory.style.display = 'none';
            incomingCategory.style.display = 'block';
            
            // 强制重绘
            void incomingCategory.offsetHeight;
            
            // 淡入新分类
            incomingCategory.style.opacity = '1';
            incomingCategory.style.transform = 'translateY(0)';
            
            // 为新分类中的网格项和"查看更多"链接添加交互动画
            this.animateCategoryItems(incomingCategory);
        }, this.animationConfig.fadeDuration);
    }
    
    // 动画显示分类内的所有项目
    animateCategoryItems(categoryElement) {
        const portfolioItems = categoryElement.querySelectorAll('.portfolio-item');
        const moreLink = categoryElement.querySelector('.category-more-link');
        
        // 将所有需要动画的元素收集起来
        const allAnimatedElements = [...portfolioItems];
        if (moreLink) allAnimatedElements.push(moreLink);
        
        // 为每个元素设置初始状态
        allAnimatedElements.forEach(el => {
            el.style.opacity = '0';
            if (el.classList.contains('portfolio-item')) {
                el.style.transform = 'translateY(15px) scale(0.98)';
            } else {
                el.style.transform = 'translateY(20px)';
            }
        });
        
        // 强制重绘以启动动画
        if (allAnimatedElements[0]) {
            void allAnimatedElements[0].offsetHeight;
        }
        
        // 交错淡入动画
        allAnimatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                if (el.classList.contains('portfolio-item')) {
                    el.style.transform = 'translateY(0) scale(1)';
                } else {
                    el.style.transform = 'translateY(0)';
                }
            }, index * this.animationConfig.staggerDelay);
        });
    }
    
    // 销毁方法（如果需要）
    destroy() {
        this.filterButtons.forEach(button => {
            button.removeEventListener('click', this.onFilterClick);
        });
        
        document.querySelectorAll('.portfolio-item:not(.no-link)').forEach(item => {
            item.removeEventListener('click', this.onPortfolioItemClick);
        });
    }
}

// 初始化作品集
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
    window.portfolio.init();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Portfolio;
}