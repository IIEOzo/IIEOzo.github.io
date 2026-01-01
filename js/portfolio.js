/**
 * portfolio.js - 作品集功能优化版
 * 优化内容：代码模块化、性能优化、更好的动画控制
 */

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
  
  handleFilterClick(event) {
    const targetFilter = event.currentTarget.getAttribute('data-filter');
    
    if (targetFilter === this.currentFilter) return;
    
    this.updateActiveButton(event.currentTarget);
    this.switchPortfolioCategories(targetFilter);
    this.currentFilter = targetFilter;
  }
  
  updateActiveButton(activeButton) {
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }
  
  initPortfolio() {
    this.portfolioCategories.forEach(category => {
      if (category.dataset.category === 'brand') {
        this.showCategory(category, true);
      } else {
        this.hideCategory(category);
      }
    });
  }
  
  showCategory(category, isInitial = false) {
    category.style.display = 'block';
    category.style.opacity = '1';
    category.style.transform = 'translateY(0)';
    
    if (isInitial) {
      setTimeout(() => {
        this.animateCategoryItems(category);
      }, 100);
    } else {
      requestAnimationFrame(() => {
        this.animateCategoryItems(category);
      });
    }
  }
  
  hideCategory(category) {
    category.style.display = 'none';
    category.style.opacity = '0';
    category.style.transform = 'translateY(20px)';
  }
  
  switchPortfolioCategories(targetFilter) {
    const outgoingCategory = document.querySelector(`.portfolio-category[data-category="${this.currentFilter}"]`);
    const incomingCategory = document.querySelector(`.portfolio-category[data-category="${targetFilter}"]`);
    
    if (!outgoingCategory || !incomingCategory) return;
    
    this.hideCategoryWithAnimation(outgoingCategory);
    
    setTimeout(() => {
      this.showCategory(incomingCategory);
    }, 300);
  }
  
  hideCategoryWithAnimation(category) {
    category.style.opacity = '0';
    category.style.transform = 'translateY(20px)';
  }
  
  animateCategoryItems(category) {
    const portfolioItems = category.querySelectorAll('.portfolio-item');
    const moreLink = category.querySelector('.category-more-link');
    
    const animatedElements = [...portfolioItems];
    if (moreLink) animatedElements.push(moreLink);
    
    // 设置初始状态
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = el.classList.contains('portfolio-item') 
        ? 'translateY(15px) scale(0.98)'
        : 'translateY(20px)';
    });
    
    // 强制重绘
    if (animatedElements[0]) {
      void animatedElements[0].offsetHeight;
    }
    
    // 交错动画
    animatedElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = el.classList.contains('portfolio-item')
          ? 'translateY(0) scale(1)'
          : 'translateY(0)';
      }, index * 60);
    });
  }
}

// 初始化作品集管理器
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioManager = new PortfolioManager();
});