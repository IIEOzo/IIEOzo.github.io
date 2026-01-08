// portfolio.js - 作品集功能 - 更新以支持新的分类结构，删除模态框功能
function initPortfolio() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCategories = document.querySelectorAll('.portfolio-category');
    let currentFilter = 'brand';
    
    // 初始化：只显示品牌设计
    portfolioCategories.forEach(category => {
        if (category.dataset.category === 'brand') {
            category.style.display = 'block';
            // 立即将分类容器设置为可见
            category.style.opacity = '1';
            category.style.transform = 'translateY(0)';
            
            // 获取该分类下的所有项目
            const portfolioItems = category.querySelectorAll('.portfolio-item');
            // 获取该分类下的"查看更多"链接
            const moreLink = category.querySelector('.category-more-link');
            
            // 页面加载时，让项目和"查看更多"链接一起显示
            setTimeout(() => {
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
                
                // 强制重绘
                if (allAnimatedElements[0]) {
                    void allAnimatedElements[0].offsetHeight;
                }
                
                // 交错淡入动画 - 所有元素一起动画
                allAnimatedElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        if (el.classList.contains('portfolio-item')) {
                            el.style.transform = 'translateY(0) scale(1)';
                        } else {
                            el.style.transform = 'translateY(0)';
                        }
                    }, index * 50); // 50ms间隔，快速连续显示
                });
                
            }, 100); // 页面加载后延迟100ms开始动画
            
        } else {
            category.style.display = 'none';
            category.style.opacity = '0';
            category.style.transform = 'translateY(20px)';
            
            // 隐藏其他分类的"查看更多"链接
            const moreLink = category.querySelector('.category-more-link');
            if (moreLink) {
                moreLink.style.opacity = '0';
                moreLink.style.transform = 'translateY(20px)';
            }
        }
    });

    // 为每个按钮绑定点击事件
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetFilter = this.getAttribute('data-filter');
            
            if (targetFilter === currentFilter) return;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            switchPortfolioCategories(targetFilter, portfolioCategories, currentFilter);
            currentFilter = targetFilter;
        });
    });
    
    // 删除模态框初始化
    // initPortfolioModal(); // 注释掉这行
}

// 切换作品分类
function switchPortfolioCategories(targetFilter, allCategories, currentFilter) {
    const outgoingCategory = document.querySelector(`.portfolio-category[data-category="${currentFilter}"]`);
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
        const portfolioItems = incomingCategory.querySelectorAll('.portfolio-item');
        const moreLink = incomingCategory.querySelector('.category-more-link');
        
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
        
        // 交错淡入动画 - 所有元素一起动画
        allAnimatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                if (el.classList.contains('portfolio-item')) {
                    el.style.transform = 'translateY(0) scale(1)';
                } else {
                    el.style.transform = 'translateY(0)';
                }
            }, index * 60); // 60ms间隔，让所有元素快速连续显示
        });
        
    }, 300);
}