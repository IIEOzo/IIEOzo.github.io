// navigation.js - 优化版导航功能
// 使用现代JavaScript API

export class EnhancedNavigation {
    constructor() {
        this.nav = document.querySelector('nav');
        this.navLinks = document.querySelector('.nav-links');
        this.menuToggle = document.querySelector('.mobile-menu-toggle');
        this.lastScrollY = window.scrollY;
        this.scrollThreshold = 100;
        this.isMobile = window.innerWidth <= 768;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initIntersectionObserver();
        this.initResizeObserver();
        this.updateNavLinks();
        console.log('🚀 增强导航已初始化');
    }

    bindEvents() {
        // 平滑滚动
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-links a')) {
                e.preventDefault();
                this.handleNavClick(e);
            }
        });

        // 移动端菜单切换
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
            this.menuToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMobileMenu();
                }
            });
        }

        // 滚动处理
        window.addEventListener('scroll', () => this.handleScroll());
        
        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen() && !this.nav.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen()) {
                this.closeMobileMenu();
            }
        });
    }

    initIntersectionObserver() {
        // 观察各区块以更新导航状态
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                
                if (entry.isIntersecting) {
                    navLink?.classList.add('active');
                    this.updateNavIndicator(id);
                } else {
                    navLink?.classList.remove('active');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -20% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    initResizeObserver() {
        // 响应式处理
        const resizeObserver = new ResizeObserver(() => {
            this.isMobile = window.innerWidth <= 768;
            this.updateNavLinks();
            
            if (!this.isMobile && this.isMobileMenuOpen()) {
                this.closeMobileMenu();
            }
        });

        resizeObserver.observe(document.body);
    }

    handleNavClick(e) {
        const href = e.target.getAttribute('href');
        
        if (href.startsWith('#')) {
            this.scrollToSection(href.substring(1));
        }
        
        // 移动端关闭菜单
        if (this.isMobile) {
            this.closeMobileMenu();
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const navHeight = this.nav.offsetHeight;
        const sectionTop = section.offsetTop - navHeight - 20;

        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });

        // 更新URL而不滚动
        history.pushState(null, null, `#${sectionId}`);
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > this.lastScrollY;
        const isAtTop = currentScrollY < 10;
        const heroSection = document.querySelector('.hero');

        // 透明效果
        if (heroSection) {
            const heroRect = heroSection.getBoundingClientRect();
            if (heroRect.bottom > 0 && currentScrollY < heroRect.height) {
                this.nav.classList.add('transparent');
            } else {
                this.nav.classList.remove('transparent');
            }
        }

        // 自动隐藏/显示导航栏
        if (isScrollingDown && !isAtTop && !this.isMobile) {
            this.nav.classList.add('nav-hidden');
        } else {
            this.nav.classList.remove('nav-hidden');
        }

        // 底部检测
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const isAtBottom = (currentScrollY + windowHeight) >= (documentHeight - 100);

        if (isAtBottom) {
            this.nav.classList.add('at-bottom');
        } else {
            this.nav.classList.remove('at-bottom');
        }

        this.lastScrollY = currentScrollY;
    }

    toggleMobileMenu() {
        const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
        this.menuToggle.setAttribute('aria-expanded', !isExpanded);
        this.navLinks.classList.toggle('active');
        
        // 锁定滚动
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
        
        // 聚焦第一个导航链接
        if (!isExpanded) {
            const firstLink = this.navLinks.querySelector('a');
            setTimeout(() => firstLink?.focus(), 100);
        }
    }

    closeMobileMenu() {
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }

    isMobileMenuOpen() {
        return this.navLinks.classList.contains('active');
    }

    updateNavLinks() {
        if (this.isMobile) {
            this.optimizeMobileNav();
        } else {
            this.restoreDesktopNav();
        }
    }

    optimizeMobileNav() {
        // 移动端优化导航链接
        const currentSection = this.getCurrentSection();
        
        switch(currentSection) {
            case 'about':
                this.updateMobileNav(['作品', '联系']);
                break;
            case 'work':
                this.updateMobileNav(['关于', '联系']);
                break;
            case 'contact':
                this.updateMobileNav(['关于', '作品']);
                break;
            default:
                this.updateMobileNav(['关于', '作品', '联系']);
        }
    }

    restoreDesktopNav() {
        // 恢复桌面端导航
        this.navLinks.innerHTML = `
            <a href="#about" class="nav-link" data-text="关于">关于</a>
            <a href="#work" class="nav-link" data-text="作品">作品</a>
            <a href="#contact" class="nav-link" data-text="联系">联系</a>
        `;
    }

    updateMobileNav(links) {
        this.navLinks.innerHTML = links.map(text => `
            <a href="#${this.getSectionId(text)}" class="nav-link" data-text="${text}">
                ${text}
            </a>
        `).join('');
    }

    getCurrentSection() {
        const sections = ['hero', 'about', 'work', 'contact'];
        const currentScroll = window.scrollY + 100;
        
        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const { offsetTop, offsetHeight } = element;
                if (currentScroll >= offsetTop && currentScroll < offsetTop + offsetHeight) {
                    return section;
                }
            }
        }
        return 'hero';
    }

    getSectionId(text) {
        const map = {
            '关于': 'about',
            '作品': 'work',
            '联系': 'contact'
        };
        return map[text] || text.toLowerCase();
    }

    updateNavIndicator(sectionId) {
        // 更新导航指示器
        const indicator = document.querySelector('.nav-indicator');
        if (indicator) {
            const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (activeLink) {
                const linkRect = activeLink.getBoundingClientRect();
                const navRect = this.nav.getBoundingClientRect();
                
                indicator.style.width = `${linkRect.width}px`;
                indicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
            }
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('nav')) {
        window.enhancedNavigation = new EnhancedNavigation();
    }
});