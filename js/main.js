/**
 * main.js - 主JavaScript文件（优化版）
 * 优化内容：模块化组织、性能优化、错误处理、代码复用
 */

// 设计工作室网站主应用程序
class DesignStudioApp {
  constructor() {
    this.modules = [];
    this.init();
  }
  
  // 初始化应用
  init() {
    console.log('设计工作室网站已加载');
    
    // 修复GitHub Pages路径
    this.fixGitHubPagesPaths();
    
    // 初始化所有模块
    this.initModules();
    
    // 初始化性能监控
    this.initPerformanceMonitoring();
  }
  
  // 修复GitHub Pages路径
  fixGitHubPagesPaths() {
    if (!window.location.href.includes('github.io')) return;
    
    const baseUrl = window.location.pathname.split('/').slice(0, -1).join('/');
    
    // 修正CSS文件路径
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes('/css/') && !href.startsWith('http')) {
        link.href = baseUrl + href;
      }
    });
    
    // 修正JS文件路径
    document.querySelectorAll('script[src]').forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('/js/') && !src.startsWith('http')) {
        script.src = baseUrl + src;
      }
    });
  }
  
  // 初始化所有模块
  initModules() {
    // 按依赖顺序初始化模块
    this.modules = [
      NavigationManager,
      PortfolioManager,
      ScrollAnimator,
      GroupAnimator,
      LazyLoader,
      BackToTopButton
    ];
    
    this.modules.forEach(ModuleClass => {
      try {
        new ModuleClass();
      } catch (error) {
        console.error(`初始化模块 ${ModuleClass.name} 失败:`, error);
      }
    });
  }
  
  // 初始化性能监控
  initPerformanceMonitoring() {
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`页面加载时间: ${loadTime}ms`);
      }
    });
  }
}

// 导航管理器
class NavigationManager {
  constructor() {
    this.nav = document.querySelector('nav');
    this.lastScrollY = window.scrollY;
    this.scrollThreshold = 150;
    this.initialScrollTriggered = false;
    this.autoShowTimer = null;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.checkInitialState();
  }
  
  bindEvents() {
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('resize', () => this.handleResize());
    
    // 平滑滚动
    document.addEventListener('click', (e) => this.handleLinkClick(e));
  }
  
  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // 移动端逻辑
    if (window.innerWidth <= 768) {
      this.updateMobileNavLinks();
      return;
    }
    
    // 桌面端逻辑
    const isScrollingDown = currentScrollY > this.lastScrollY;
    const isScrollingUp = currentScrollY < this.lastScrollY;
    
    window.requestAnimationFrame(() => {
      this.checkHeroVisibility();
      this.checkBottom();
      
      // 首次滚动时移除初始隐藏类
      if (!this.initialScrollTriggered && currentScrollY > 5) {
        this.nav.classList.remove('initial-hidden');
        this.initialScrollTriggered = true;
        
        if (this.autoShowTimer) {
          clearTimeout(this.autoShowTimer);
          this.autoShowTimer = null;
        }
      }
      
      // 正常的导航栏显示/隐藏逻辑
      if (!this.nav.classList.contains('at-bottom')) {
        if (isScrollingUp) {
          this.nav.classList.remove('nav-hidden');
        } else if (isScrollingDown) {
          this.nav.classList.add('nav-hidden');
        }
      }
    });
    
    this.lastScrollY = currentScrollY;
  }
  
  checkHeroVisibility() {
    if (window.innerWidth <= 768) return;
    
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const heroRect = heroSection.getBoundingClientRect();
    const heroBottom = heroRect.bottom;
    
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
  
  checkBottom() {
    if (window.innerWidth <= 768) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    
    const isAtBottom = (scrollTop + windowHeight) >= (documentHeight - 100);
    
    if (isAtBottom) {
      this.nav.classList.remove('nav-hidden');
      this.nav.classList.add('at-bottom');
    } else {
      this.nav.classList.remove('at-bottom');
    }
  }
  
  updateMobileNavLinks() {
    // 移动端导航链接更新逻辑
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    // 简化的移动端导航逻辑
    const sections = ['about', 'work', 'contact'];
    const currentSection = this.getCurrentSection();
    
    let linksHTML = '';
    sections.forEach(section => {
      if (section !== currentSection) {
        const label = this.getSectionLabel(section);
        linksHTML += `<a href="#${section}">${label}</a>`;
      }
    });
    
    navLinks.innerHTML = linksHTML;
  }
  
  getCurrentSection() {
    // 简化的当前板块检测逻辑
    const scrollPosition = window.scrollY + 100;
    const sections = [
      { id: 'about', offset: document.querySelector('#about')?.offsetTop || 0 },
      { id: 'work', offset: document.querySelector('#work')?.offsetTop || 0 },
      { id: 'contact', offset: document.querySelector('#contact')?.offsetTop || 0 }
    ];
    
    for (const section of sections) {
      if (scrollPosition >= section.offset) {
        return section.id;
      }
    }
    
    return 'hero';
  }
  
  getSectionLabel(sectionId) {
    const labels = {
      'about': '关于',
      'work': '作品',
      'contact': '联系'
    };
    
    return labels[sectionId] || sectionId;
  }
  
  handleLinkClick(e) {
    if (e.target.matches('.nav-links a')) {
      e.preventDefault();
      const href = e.target.getAttribute('href');
      
      if (href.startsWith('#')) {
        this.scrollToSection(href.substring(1));
      }
    }
  }
  
  scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (!targetElement) return;
    
    const navbarHeight = this.nav.offsetHeight;
    const targetPosition = targetElement.offsetTop - navbarHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
  
  handleResize() {
    if (window.innerWidth <= 768) {
      this.updateMobileNavLinks();
    } else {
      // 恢复桌面端导航链接
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        navLinks.innerHTML = `
          <a href="#about">关于</a>
          <a href="#work">作品</a>
          <a href="#contact">联系</a>
        `;
      }
      
      this.checkBottom();
    }
  }
  
  checkInitialState() {
    if (window.innerWidth > 768) {
      this.nav.classList.add('initial-hidden', 'transparent');
      
      // 10秒后自动显示导航栏
      this.autoShowTimer = setTimeout(() => {
        if (!this.initialScrollTriggered) {
          this.nav.classList.remove('initial-hidden');
          this.initialScrollTriggered = true;
        }
      }, 10000);
    } else {
      this.nav.classList.remove('initial-hidden');
      this.updateMobileNavLinks();
    }
  }
}

// 作品集管理器
class PortfolioManager {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.portfolioCategories = document.querySelectorAll('.portfolio-category');
    this.currentFilter = 'brand';
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.initPortfolio();
  }
  
  bindEvents() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleFilterClick(e));
    });
  }
  
  handleFilterClick(e) {
    const targetFilter = e.currentTarget.getAttribute('data-filter');
    
    if (targetFilter === this.currentFilter) return;
    
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    this.switchPortfolioCategories(targetFilter);
    this.currentFilter = targetFilter;
  }
  
  initPortfolio() {
    // 初始化：只显示品牌设计
    this.portfolioCategories.forEach(category => {
      if (category.dataset.category === 'brand') {
        category.style.display = 'block';
        category.style.opacity = '1';
        category.style.transform = 'translateY(0)';
        
        this.animateCategoryItems(category);
      } else {
        category.style.display = 'none';
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px)';
      }
    });
  }
  
  switchPortfolioCategories(targetFilter) {
    const outgoingCategory = document.querySelector(`.portfolio-category[data-category="${this.currentFilter}"]`);
    const incomingCategory = document.querySelector(`.portfolio-category[data-category="${targetFilter}"]`);
    
    if (!outgoingCategory || !incomingCategory) return;
    
    // 淡出当前分类
    outgoingCategory.style.opacity = '0';
    outgoingCategory.style.transform = 'translateY(20px)';
    
    // 短暂延迟后切换显示
    setTimeout(() => {
      outgoingCategory.style.display = 'none';
      incomingCategory.style.display = 'block';
      
      // 强制重绘
      void incomingCategory.offsetHeight;
      
      // 淡入新分类
      incomingCategory.style.opacity = '1';
      incomingCategory.style.transform = 'translateY(0)';
      
      // 为新分类添加动画
      this.animateCategoryItems(incomingCategory);
    }, 300);
  }
  
  animateCategoryItems(category) {
    const portfolioItems = category.querySelectorAll('.portfolio-item');
    const moreLink = category.querySelector('.category-more-link');
    
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
      }, index * 50);
    });
  }
}

// 滚动动画管理器
class ScrollAnimator {
  constructor() {
    this.revealElements = document.querySelectorAll('.reveal');
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.checkScroll();
  }
  
  bindEvents() {
    window.addEventListener('scroll', () => this.checkScroll());
  }
  
  checkScroll() {
    const windowHeight = window.innerHeight;
    
    this.revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - 100) {
        element.classList.add('active');
      }
    });
  }
}

// 组动画管理器
class GroupAnimator {
  constructor() {
    this.groups = [];
    
    this.init();
  }
  
  init() {
    this.setupGroups();
    this.bindEvents();
    this.checkGroupAnimations();
  }
  
  setupGroups() {
    // 定义组配置
    const groupConfigs = [
      { selector: '#about .section-title', className: 'group-1' },
      { selector: '.about-container', className: 'group-2' },
      { selector: '#work .section-title', className: 'group-3' },
      { selector: '.portfolio-filters-container', className: 'group-3-5' },
      { selector: '.portfolio-container', className: 'group-4' },
      { selector: '#contact .section-title', className: 'group-5' },
      { selector: '.contact-info-container', className: 'group-6' }
    ];
    
    groupConfigs.forEach(config => {
      const element = document.querySelector(config.selector);
      if (element) {
        element.classList.add(config.className);
        this.groups.push(element);
      }
    });
  }
  
  bindEvents() {
    window.addEventListener('scroll', () => this.checkGroupAnimations());
  }
  
  checkGroupAnimations() {
    const windowHeight = window.innerHeight;
    
    this.groups.forEach(group => {
      const groupTop = group.getBoundingClientRect().top;
      
      if (groupTop < windowHeight - 100) {
        group.classList.add('active');
      }
    });
  }
}

// 懒加载管理器
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.initIntersectionObserver();
    } else {
      this.loadAllImages();
    }
  }
  
  initIntersectionObserver() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    this.images.forEach(img => imageObserver.observe(img));
  }
  
  loadAllImages() {
    this.images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// 回到顶部按钮管理器
class BackToTopButton {
  constructor() {
    this.button = document.getElementById('backToTop');
    
    if (this.button) {
      this.init();
    }
  }
  
  init() {
    this.bindEvents();
    this.toggleVisibility();
  }
  
  bindEvents() {
    window.addEventListener('scroll', () => this.toggleVisibility());
    this.button.addEventListener('click', () => this.scrollToTop());
  }
  
  toggleVisibility() {
    if (window.scrollY > 300) {
      this.button.classList.add('show');
    } else {
      this.button.classList.remove('show');
    }
  }
  
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// 标题动画管理器
class TitleAnimator {
  constructor() {
    this.sectionTitles = document.querySelectorAll('.section-title');
    
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.initIntersectionObserver();
    }
  }
  
  initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-50px 0px -50px 0px'
    });
    
    this.sectionTitles.forEach(title => observer.observe(title));
  }
}

// 启动应用程序
document.addEventListener('DOMContentLoaded', () => {
  new DesignStudioApp();
});