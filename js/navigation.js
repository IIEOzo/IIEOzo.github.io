// navigation.js - 导航功能（优化版）
// 使用现代JavaScript，更好的性能和可维护性

class Navigation {
    constructor() {
        this.nav = document.querySelector('nav');
        this.navLinks = document.querySelector('.nav-links');
        this.logoElement = document.querySelector('.logo');
        this.heroSection = document.querySelector('.hero');
        
        this.lastScrollY = window.scrollY;
        this.scrollThreshold = 150;
        this.initialScrollTriggered = false;
        this.autoShowTimer = null;
        this.isMobile = window.innerWidth <= 768;
        
        // 绑定方法
        this.onScroll = this.onScroll.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onLogoClick = this.onLogoClick.bind(this);
        this.onLinkClick = this.onLinkClick.bind(this);
    }
    
    // 初始化导航
    init() {
        // 初始状态：页面加载时添加初始隐藏类和透明类（仅桌面端）
        if (!this.isMobile) {
            this.nav.classList.add('initial-hidden', 'transparent');
        }
        
        // 绑定事件
        this.bindEvents();
        
        // 初始检查
        this.checkHeroVisibility();
        this.checkBottom();
        
        // 如果是移动端，更新导航链接
        if (this.isMobile) {
            this.updateMobileNavLinks();
        }
        
        // 页面加载完成后
        window.addEventListener('load', () => this.onLoad());
        
        console.log('导航系统已初始化');
    }
    
    // 绑定事件
    bindEvents() {
        window.addEventListener('scroll', this.onScroll);
        window.addEventListener('resize', this.onResize);
        
        if (this.logoElement) {
            this.logoElement.addEventListener('click', this.onLogoClick);
        }
        
        // 使用事件委托处理导航链接点击
        document.addEventListener('click', this.onLinkClick);
        
        // 点击页面任意位置也可以触发导航栏显示（可选）
        document.addEventListener('click', () => {
            if (!this.initialScrollTriggered && !this.isMobile) {
                this.nav.classList.remove('initial-hidden');
                this.initialScrollTriggered = true;
                
                if (this.autoShowTimer) {
                    clearTimeout(this.autoShowTimer);
                    this.autoShowTimer = null;
                }
            }
        });
    }
    
    // 滚动事件处理
    onScroll() {
        const currentScrollY = window.scrollY;
        
        // 移动端逻辑
        if (this.isMobile) {
            this.updateMobileNavLinks();
            return;
        }
        
        // 桌面端逻辑
        const isScrollingDown = currentScrollY > this.lastScrollY;
        const isScrollingUp = currentScrollY < this.lastScrollY;
        const isAtTop = currentScrollY < 10;
        
        requestAnimationFrame(() => {
            // 检查是否在首页横幅区域
            this.checkHeroVisibility();
            
            // 检查是否到达底部
            this.checkBottom();
            
            // 首次滚动时移除初始隐藏类
            if (!this.initialScrollTriggered && currentScrollY > 5) {
                this.nav.classList.remove('initial-hidden');
                this.initialScrollTriggered = true;
                
                // 清除10秒自动显示定时器
                if (this.autoShowTimer) {
                    clearTimeout(this.autoShowTimer);
                    this.autoShowTimer = null;
                }
            }
            
            // 如果不是在底部，则执行正常的导航栏显示/隐藏逻辑
            if (!this.nav.classList.contains('at-bottom')) {
                // 如果向上滑动，一直显示导航栏
                if (isScrollingUp) {
                    this.nav.classList.remove('nav-hidden');
                }
                // 如果向下滑动，隐藏导航栏
                else if (isScrollingDown) {
                    this.nav.classList.add('nav-hidden');
                }
            }
            // 如果在底部，导航栏已经由checkBottom函数显示
        });
        
        this.lastScrollY = currentScrollY;
    }
    
    // 检查是否在首页横幅区域
    checkHeroVisibility() {
        // 移动端直接返回，不执行透明效果
        if (this.isMobile) {
            this.nav.classList.remove('transparent');
            this.nav.style.backgroundColor = 'rgba(24, 24, 24, 1)';
            this.nav.style.backdropFilter = 'blur(10px)';
            this.nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            this.nav.style.transform = 'none';
            return;
        }
        
        if (!this.heroSection) return;
        
        const heroRect = this.heroSection.getBoundingClientRect();
        const heroBottom = heroRect.bottom;
        
        // 桌面端：判断是否在首页横幅区域内
        if (heroBottom > 0 && window.scrollY < heroRect.height) {
            this.nav.classList.add('transparent');
            this.nav.style.backgroundColor = 'rgba(24, 24, 24, 0)';
            this.nav.style.backdropFilter = 'none';
            this.nav.style.borderBottom = '1px solid transparent';
        } else {
            this.nav.classList.remove('transparent');
            this.nav.style.backgroundColor = 'rgba(24, 24, 24, 0.98)';
            this.nav.style.backdropFilter = 'blur(10px)';
            this.nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
    }
    
    // 检查是否到达页面底部
    checkBottom() {
        // 只在桌面端执行
        if (this.isMobile) return;
        
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // 判断是否接近底部（距离底部100px以内）
        const isAtBottom = (scrollTop + windowHeight) >= (documentHeight - 100);
        
        if (isAtBottom) {
            // 到达底部时显示导航栏和箭头
            this.nav.classList.remove('nav-hidden');
            this.nav.classList.add('at-bottom');
        } else {
            // 离开底部时隐藏箭头
            this.nav.classList.remove('at-bottom');
        }
    }
    
    // 移动端：根据当前滚动位置更新导航链接
    updateMobileNavLinks() {
        // 只在移动端执行
        if (!this.isMobile) return;
        
        const aboutSection = document.querySelector('#about');
        const workSection = document.querySelector('#work');
        const contactSection = document.querySelector('#contact');
        
        const sections = [
            { element: this.heroSection, id: 'hero', top: 0, bottom: this.heroSection ? this.heroSection.offsetHeight : 0 },
            { element: aboutSection, id: 'about', top: aboutSection ? aboutSection.offsetTop : 0, bottom: aboutSection ? aboutSection.offsetTop + aboutSection.offsetHeight : 0 },
            { element: workSection, id: 'work', top: workSection ? workSection.offsetTop : 0, bottom: workSection ? workSection.offsetTop + workSection.offsetHeight : 0 },
            { element: contactSection, id: 'contact', top: contactSection ? contactSection.offsetTop : 0, bottom: contactSection ? contactSection.offsetTop + contactSection.offsetHeight : 0 }
        ];
        
        // 获取当前滚动位置
        const currentScroll = window.scrollY + 100;
        
        // 找到当前所在的板块
        let currentSection = 'hero';
        
        for (const section of sections) {
            if (section.element && currentScroll >= section.top && currentScroll < section.bottom) {
                currentSection = section.id;
                break;
            }
        }
        
        // 清空现有链接
        this.navLinks.innerHTML = '';
        
        // 根据当前板块添加相应的链接
        let linksHTML = '';
        
        switch(currentSection) {
            case 'hero':
                // 首页横幅区域：只显示logo，不显示任何链接
                break;
            case 'about':
                // 关于我区域：显示"作品"和"联系"
                linksHTML = `
                    <li role="none"><a href="#work" role="menuitem">作品</a></li>
                    <li role="none"><a href="#contact" role="menuitem">联系</a></li>
                `;
                break;
            case 'work':
                // 部分作品区域：显示"关于"和"联系"
                linksHTML = `
                    <li role="none"><a href="#about" role="menuitem">关于</a></li>
                    <li role="none"><a href="#contact" role="menuitem">联系</a></li>
                `;
                break;
            case 'contact':
                // 期待您的联系区域：显示"关于"和"作品"
                linksHTML = `
                    <li role="none"><a href="#about" role="menuitem">关于</a></li>
                    <li role="none"><a href="#work" role="menuitem">作品</a></li>
                `;
                break;
        }
        
        this.navLinks.innerHTML = linksHTML;
    }
    
    // 点击事件处理
    onLinkClick(e) {
        if (e.target.matches('.nav-links a')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            
            if (href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navbarHeight = this.nav.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }
    
    // Logo点击事件
    onLogoClick(e) {
        e.preventDefault();
        
        // 滚动到首页顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // 移动端：保持深色背景
        if (this.isMobile) {
            this.nav.classList.remove('transparent');
            this.nav.style.backgroundColor = 'rgba(24, 24, 24, 1)';
            this.nav.style.backdropFilter = 'blur(10px)';
            this.nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            this.nav.style.transform = 'none';
        } else {
            // 桌面端逻辑保持不变
            this.nav.classList.add('transparent');
            this.nav.style.backgroundColor = 'rgba(24, 24, 24, 0)';
            this.nav.style.backdropFilter = 'none';
            this.nav.style.borderBottom = '1px solid transparent';
        }
        
        // 如果是移动端，更新导航链接
        if (this.isMobile) {
            this.updateMobileNavLinks();
        }
    }
    
    // 窗口大小改变事件
    onResize() {
        this.isMobile = window.innerWidth <= 768;
        
        // 如果是移动端，更新导航链接
        if (this.isMobile) {
            this.updateMobileNavLinks();
            // 移动端隐藏箭头
            this.nav.classList.remove('at-bottom');
            // 移动端：确保导航栏没有动画
            this.nav.style.transition = 'none';
            this.nav.style.transform = 'none';
        } else {
            // 桌面端：恢复原始链接
            const originalLinks = `
                <li role="none"><a href="#about" role="menuitem">关于</a></li>
                <li role="none"><a href="#work" role="menuitem">作品</a></li>
                <li role="none"><a href="#contact" role="menuitem">联系</a></li>
            `;
            this.navLinks.innerHTML = originalLinks;
            
            // 检查是否在底部
            this.checkBottom();
        }
    }
    
    // 页面加载完成事件
    onLoad() {
        // 移动端：不执行10秒自动显示，直接显示导航栏
        if (this.isMobile) {
            this.nav.classList.remove('initial-hidden');
            this.initialScrollTriggered = true;
            this.updateMobileNavLinks();
            // 移动端：确保导航栏完全可见，没有动画
            this.nav.style.opacity = '1';
            this.nav.style.visibility = 'visible';
            this.nav.style.transform = 'none';
        } else {
            // 桌面端逻辑保持不变
            this.autoShowTimer = setTimeout(() => {
                if (!this.initialScrollTriggered) {
                    this.nav.classList.remove('initial-hidden');
                    this.initialScrollTriggered = true;
                }
            }, 10000);
        }
    }
    
    // 销毁方法（如果需要）
    destroy() {
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
        
        if (this.logoElement) {
            this.logoElement.removeEventListener('click', this.onLogoClick);
        }
        
        document.removeEventListener('click', this.onLinkClick);
        
        if (this.autoShowTimer) {
            clearTimeout(this.autoShowTimer);
        }
    }
}

// 初始化导航
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
    window.navigation.init();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}