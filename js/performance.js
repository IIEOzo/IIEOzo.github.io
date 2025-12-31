// performance.js - 性能优化模块
// 监控和优化网站性能

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.setupPerformanceObserver();
        this.setupResourceTiming();
        this.setupLongTaskObserver();
        this.setupMemoryObserver();
        console.log('📈 性能监控已初始化');
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            // 监控关键性能指标
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.handlePerformanceEntry(entry);
                }
            });

            // 监控不同类型的性能条目
            try {
                observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
            } catch (e) {
                // 如果浏览器不支持某些类型，回退到基本类型
                observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
            }
        }
    }

    handlePerformanceEntry(entry) {
        const metricName = entry.name;
        const value = entry.startTime || entry.value || entry.duration;
        
        this.metrics[metricName] = value;
        
        // 根据指标采取行动
        switch(metricName) {
            case 'first-paint':
            case 'first-contentful-paint':
                if (value > 2000) {
                    this.warnSlowPaint(value);
                }
                break;
                
            case 'largest-contentful-paint':
                if (value > 2500) {
                    this.warnLCP(value);
                }
                break;
                
            case 'layout-shift':
                if (value > 0.1) {
                    this.warnLayoutShift(value);
                }
                break;
        }
        
        console.log(`性能指标: ${metricName} = ${Math.round(value)}ms`);
    }

    setupResourceTiming() {
        // 监控资源加载时间
        if ('performance' in window && performance.getEntriesByType) {
            const resources = performance.getEntriesByType('resource');
            
            resources.forEach(resource => {
                if (resource.initiatorType === 'img') {
                    this.monitorImageLoad(resource);
                }
            });
        }
    }

    monitorImageLoad(resource) {
        const loadTime = resource.duration;
        
        if (loadTime > 1000) {
            console.warn(`图片加载缓慢: ${resource.name} (${Math.round(loadTime)}ms)`);
            
            // 如果图片加载太慢，可以触发优化措施
            if (loadTime > 3000) {
                this.optimizeSlowImage(resource.name);
            }
        }
    }

    optimizeSlowImage(imageUrl) {
        // 实现图片优化策略
        console.log('优化慢速图片:', imageUrl);
        
        // 可以在这里实现：
        // 1. 替换为低质量占位图
        // 2. 实现渐进式加载
        // 3. 记录到分析系统
    }

    setupLongTaskObserver() {
        // 监控长任务（阻塞主线程的任务）
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        this.handleLongTask(entry);
                    }
                }
            });
            
            observer.observe({ entryTypes: ['longtask'] });
        }
    }

    handleLongTask(task) {
        console.warn(`长任务检测: ${task.duration}ms`);
        
        // 可以在这里：
        // 1. 记录长任务信息
        // 2. 发送到分析服务器
        // 3. 触发性能优化
    }

    setupMemoryObserver() {
        // 监控内存使用情况
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory) {
                    const usedMB = memory.usedJSHeapSize / 1024 / 1024;
                    const totalMB = memory.totalJSHeapSize / 1024 / 1024;
                    
                    if (usedMB / totalMB > 0.8) {
                        this.warnHighMemoryUsage(usedMB, totalMB);
                    }
                }
            }, 30000); // 每30秒检查一次
        }
    }

    warnHighMemoryUsage(usedMB, totalMB) {
        console.warn(`高内存使用: ${usedMB.toFixed(1)}MB / ${totalMB.toFixed(1)}MB`);
        
        // 可以触发垃圾回收建议
        this.suggestCleanup();
    }

    suggestCleanup() {
        // 建议清理不再需要的资源
        console.log('建议清理未使用的资源以释放内存');
        
        // 可以在这里：
        // 1. 清理缓存
        // 2. 卸载不可见的组件
        // 3. 触发垃圾回收
    }

    warnSlowPaint(time) {
        console.warn(`首次绘制时间过长: ${Math.round(time)}ms`);
    }

    warnLCP(time) {
        console.warn(`最大内容绘制时间过长: ${Math.round(time)}ms`);
    }

    warnLayoutShift(score) {
        console.warn(`布局偏移分数过高: ${score.toFixed(3)}`);
    }

    getMetrics() {
        return this.metrics;
    }

    reportMetrics() {
        // 发送性能指标到分析服务器
        const report = {
            url: window.location.href,
            metrics: this.metrics,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        // 这里可以发送到分析API
        console.log('性能报告:', report);
        
        return report;
    }
}

// 资源预加载器
class ResourcePreloader {
    constructor() {
        this.queue = [];
        this.isPreloading = false;
    }

    preloadCritical() {
        const criticalResources = [
            // 关键CSS
            ...document.querySelectorAll('link[rel="stylesheet"]'),
            
            // 关键字体
            ...document.querySelectorAll('link[rel="preload"][as="font"]'),
            
            // 关键图片
            ...document.querySelectorAll('img[data-critical]')
        ];
        
        return Promise.allSettled(
            criticalResources.map(resource => this.preloadResource(resource))
        );
    }

    preloadResource(resource) {
        return new Promise((resolve, reject) => {
            if (resource.tagName === 'LINK') {
                if (resource.rel === 'stylesheet') {
                    resource.onload = resolve;
                    resource.onerror = reject;
                } else if (resource.rel === 'preload') {
                    // 预加载资源
                    const newResource = document.createElement('link');
                    newResource.rel = 'preload';
                    newResource.as = resource.as;
                    newResource.href = resource.href;
                    newResource.onload = resolve;
                    newResource.onerror = reject;
                    document.head.appendChild(newResource);
                }
            } else if (resource.tagName === 'IMG') {
                const img = new Image();
                img.src = resource.src;
                img.onload = resolve;
                img.onerror = reject;
            }
        });
    }

    lazyLoadImages() {
        // 实现渐进式图片加载
        const images = document.querySelectorAll('img[data-src]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px'
        });
        
        images.forEach(img => observer.observe(img));
    }

    loadImage(img) {
        return new Promise((resolve) => {
            const src = img.dataset.src;
            
            // 添加加载类
            img.classList.add('loading');
            
            // 创建临时图片
            const tempImg = new Image();
            tempImg.src = src;
            
            tempImg.onload = () => {
                // 交叉淡入效果
                img.style.opacity = '0';
                img.src = src;
                
                setTimeout(() => {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                    
                    setTimeout(() => {
                        img.style.transition = '';
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                        delete img.dataset.src;
                        resolve();
                    }, 300);
                }, 50);
            };
            
            tempImg.onerror = () => {
                img.classList.remove('loading');
                img.classList.add('error');
                resolve();
            };
        });
    }
}

// 连接管理器
class ConnectionManager {
    constructor() {
        this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        this.init();
    }

    init() {
        if (this.connection) {
            this.handleConnectionChange();
            this.connection.addEventListener('change', () => this.handleConnectionChange());
        }
    }

    handleConnectionChange() {
        const effectiveType = this.connection.effectiveType;
        const saveData = this.connection.saveData;
        
        console.log(`连接状态: ${effectiveType}, 省流量模式: ${saveData}`);
        
        // 根据连接状态调整资源加载策略
        switch(effectiveType) {
            case 'slow-2g':
            case '2g':
                this.enableLowBandwidthMode();
                break;
            case '3g':
                this.enableMediumBandwidthMode();
                break;
            case '4g':
                this.enableHighBandwidthMode();
                break;
        }
        
        if (saveData) {
            this.enableDataSaverMode();
        }
    }

    enableLowBandwidthMode() {
        // 启用低带宽模式
        console.log('启用低带宽模式');
        
        // 可以在这里：
        // 1. 禁用非关键资源
        // 2. 使用低质量图片
        // 3. 禁用动画
        // 4. 启用更激进的缓存
    }

    enableMediumBandwidthMode() {
        // 启用中等带宽模式
        console.log('启用中等带宽模式');
    }

    enableHighBandwidthMode() {
        // 启用高带宽模式
        console.log('启用高带宽模式');
        
        // 可以预加载更多资源
    }

    enableDataSaverMode() {
        // 启用省流量模式
        console.log('启用省流量模式');
        
        // 可以在这里：
        // 1. 使用WebP格式图片
        // 2. 减少图片质量
        // 3. 禁用视频自动播放
    }

    getConnectionInfo() {
        if (!this.connection) return null;
        
        return {
            effectiveType: this.connection.effectiveType,
            saveData: this.connection.saveData,
            rtt: this.connection.rtt,
            downlink: this.connection.downlink
        };
    }
}

// 初始化性能优化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化性能监控
    window.performanceMonitor = new PerformanceMonitor();
    
    // 初始化资源预加载
    window.resourcePreloader = new ResourcePreloader();
    window.resourcePreloader.preloadCritical().then(() => {
        console.log('关键资源预加载完成');
    });
    
    // 初始化连接管理
    window.connectionManager = new ConnectionManager();
    
    // 延迟加载非关键资源
    setTimeout(() => {
        window.resourcePreloader.lazyLoadImages();
    }, 1000);
    
    // 页面隐藏时暂停非关键操作
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 页面隐藏时暂停非关键任务
            console.log('页面隐藏，暂停非关键操作');
        } else {
            // 页面显示时恢复
            console.log('页面显示，恢复操作');
        }
    });
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PerformanceMonitor,
        ResourcePreloader,
        ConnectionManager
    };
}