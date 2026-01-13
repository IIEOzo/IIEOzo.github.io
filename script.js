// Webd-GitHub - 纯前端文件共享工具
class WebdGitHub {
    constructor() {
        this.files = new Map();
        this.currentFolder = '';
        this.viewMode = 'grid';
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        
        this.init();
    }
    
    init() {
        // 加载保存的文件
        this.loadFiles();
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 检查在线状态
        this.checkOnlineStatus();
        
        // 更新UI
        this.updateUI();
        
        // 初始化PWA
        this.initPWA();
        
        // 监听网络状态
        window.addEventListener('online', () => this.checkOnlineStatus());
        window.addEventListener('offline', () => this.checkOnlineStatus());
        
        // 定期保存
        setInterval(() => this.saveFiles(), 30000);
    }
    
    bindEvents() {
        // 上传按钮
        document.getElementById('upload-btn').addEventListener('click', () => {
            document.getElementById('file-input').click();
        });
        
        // 文件选择
        document.getElementById('file-input').addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
            e.target.value = ''; // 重置input
        });
        
        // 拖放上传
        const dropArea = document.getElementById('drop-area');
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.classList.add('dragover');
        });
        
        dropArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropArea.classList.remove('dragover');
        });
        
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
        
        // 点击上传区域
        dropArea.addEventListener('click', () => {
            document.getElementById('file-input').click();
        });
        
        // 新建文件夹
        document.getElementById('new-folder-btn').addEventListener('click', () => {
            this.showFolderModal();
        });
        
        // 视图切换
        document.getElementById('grid-view-btn').addEventListener('click', () => {
            this.switchView('grid');
        });
        
        document.getElementById('list-view-btn').addEventListener('click', () => {
            this.switchView('list');
        });
        
        // 清空存储
        document.getElementById('clear-storage-btn').addEventListener('click', () => {
            if (confirm('确定要清空所有文件吗？此操作不可撤销。')) {
                this.clearStorage();
            }
        });
        
        // 导出数据
        document.querySelector('#export-data').addEventListener('click', (e) => {
            e.preventDefault();
            this.exportData();
        });
        
        // 导入数据
        document.querySelector('#import-data').addEventListener('click', (e) => {
            e.preventDefault();
            this.importData();
        });
        
        // 清空数据
        document.querySelector('#clear-data').addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('确定要清除所有数据吗？')) {
                this.clearStorage();
            }
        });
        
        // 模态框关闭按钮
        document.getElementById('preview-close').addEventListener('click', () => {
            this.hidePreview();
        });
        
        document.getElementById('folder-close').addEventListener('click', () => {
            this.hideFolderModal();
        });
        
        document.getElementById('folder-cancel').addEventListener('click', () => {
            this.hideFolderModal();
        });
        
        // 文件夹创建
        document.getElementById('folder-create').addEventListener('click', () => {
            this.createFolder();
        });
        
        // 点击模态框外部关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }
    
    async handleFiles(fileList) {
        const files = Array.from(fileList);
        let uploadedCount = 0;
        let skippedCount = 0;
        
        // 显示上传进度
        const progress = document.getElementById('upload-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        progress.style.display = 'block';
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // 更新进度
            const percent = Math.round(((i + 1) / files.length) * 100);
            progressFill.style.width = `${percent}%`;
            progressText.textContent = `${percent}% (${i + 1}/${files.length})`;
            
            try {
                await this.addFile(file);
                uploadedCount++;
            } catch (error) {
                console.error('上传失败:', error);
                this.showNotification(`文件 "${file.name}" 上传失败: ${error.message}`, 'error');
                skippedCount++;
            }
        }
        
        // 隐藏进度条
        setTimeout(() => {
            progress.style.display = 'none';
            progressFill.style.width = '0%';
            progressText.textContent = '0%';
        }, 1000);
        
        // 显示结果
        if (uploadedCount > 0) {
            this.showNotification(`成功上传 ${uploadedCount} 个文件`, 'success');
        }
        
        if (skippedCount > 0) {
            this.showNotification(`${skippedCount} 个文件上传失败`, 'warning');
        }
        
        this.updateUI();
    }
    
    async addFile(file) {
        return new Promise((resolve, reject) => {
            // 检查文件大小
            if (file.size > this.maxFileSize) {
                reject(new Error(`文件大小超过 ${this.formatSize(this.maxFileSize)} 限制`));
                return;
            }
            
            // 检查文件名是否已存在
            const fileName = this.generateUniqueName(file.name);
            
            // 读取文件
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const fileData = {
                    id: this.generateId(),
                    name: fileName,
                    originalName: file.name,
                    size: file.size,
                    type: file.type,
                    data: e.target.result,
                    date: new Date().toISOString(),
                    folder: this.currentFolder
                };
                
                this.files.set(fileData.id, fileData);
                this.saveFiles();
                resolve(fileData);
            };
            
            reader.onerror = () => {
                reject(new Error('读取文件失败'));
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    generateUniqueName(originalName) {
        const baseName = originalName.replace(/\.[^/.]+$/, "");
        const extension = originalName.includes('.') ? originalName.substring(originalName.lastIndexOf('.')) : '';
        let newName = originalName;
        let counter = 1;
        
        // 检查是否有重名文件
        const existingNames = Array.from(this.files.values())
            .map(f => f.name)
            .filter(name => name.startsWith(baseName));
        
        if (existingNames.includes(newName)) {
            while (existingNames.includes(`${baseName}_${counter}${extension}`)) {
                counter++;
            }
            newName = `${baseName}_${counter}${extension}`;
        }
        
        return newName;
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    saveFiles() {
        try {
            // 转换为可序列化的格式
            const filesData = {};
            this.files.forEach((file, id) => {
                // 限制数据大小，避免超过localStorage限制
                if (file.data.length > 5000000) { // 5MB限制
                    console.warn(`文件 ${file.name} 过大，不保存到存储`);
                    return;
                }
                filesData[id] = file;
            });
            
            localStorage.setItem('webd_files', JSON.stringify(filesData));
            localStorage.setItem('webd_folders', JSON.stringify(this.currentFolder));
            
            // 更新存储状态
            this.updateStorageStatus();
        } catch (error) {
            console.error('保存文件失败:', error);
            this.showNotification('保存失败，存储空间可能不足', 'error');
        }
    }
    
    loadFiles() {
        try {
            const filesData = JSON.parse(localStorage.getItem('webd_files') || '{}');
            const foldersData = JSON.parse(localStorage.getItem('webd_folders') || '""');
            
            this.currentFolder = foldersData;
            this.files = new Map(Object.entries(filesData));
            
            this.updateStorageStatus();
        } catch (error) {
            console.error('加载文件失败:', error);
        }
    }
    
    updateUI() {
        this.updateFileList();
        this.updateStats();
    }
    
    updateFileList() {
        const fileList = document.getElementById('file-list');
        const emptyState = document.getElementById('empty-state');
        const files = Array.from(this.files.values());
        
        // 过滤当前文件夹的文件
        const filteredFiles = files.filter(file => file.folder === this.currentFolder);
        
        if (filteredFiles.length === 0) {
            emptyState.style.display = 'block';
            fileList.innerHTML = '';
            fileList.appendChild(emptyState);
            return;
        }
        
        emptyState.style.display = 'none';
        
        // 清空列表
        fileList.innerHTML = '';
        
        // 添加文件项
        filteredFiles.forEach(file => {
            const fileItem = this.createFileItem(file);
            fileList.appendChild(fileItem);
        });
    }
    
    createFileItem(file) {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.dataset.fileId = file.id;
        
        const icon = this.getFileIcon(file);
        const size = this.formatSize(file.size);
        const date = new Date(file.date).toLocaleDateString();
        
        div.innerHTML = `
            <div class="file-icon">${icon}</div>
            <div class="file-name" title="${file.originalName}">${this.truncateText(file.originalName, 20)}</div>
            <div class="file-size">${size}</div>
            <div class="file-date">${date}</div>
            <div class="file-actions">
                <button class="file-action-btn preview-btn" title="预览">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                </button>
                <button class="file-action-btn download-btn" title="下载">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                </button>
                <button class="file-action-btn delete-btn" title="删除">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>
            </div>
        `;
        
        // 绑定按钮事件
        div.querySelector('.preview-btn').addEventListener('click', () => {
            this.previewFile(file);
        });
        
        div.querySelector('.download-btn').addEventListener('click', () => {
            this.downloadFile(file);
        });
        
        div.querySelector('.delete-btn').addEventListener('click', () => {
            this.deleteFile(file.id);
        });
        
        return div;
    }
    
    getFileIcon(file) {
        const type = file.type || '';
        const name = file.name.toLowerCase();
        
        if (type.startsWith('image/')) return '🖼️';
        if (type.startsWith('video/')) return '🎬';
        if (type.startsWith('audio/')) return '🎵';
        if (type.includes('pdf')) return '📄';
        if (type.includes('zip') || type.includes('rar') || type.includes('tar') || 
            type.includes('gzip') || name.endsWith('.zip') || name.endsWith('.rar')) return '📦';
        if (type.includes('text') || name.endsWith('.txt') || name.endsWith('.md')) return '📝';
        if (name.endsWith('.html') || name.endsWith('.htm')) return '🌐';
        if (name.endsWith('.js')) return '📜';
        if (name.endsWith('.css')) return '🎨';
        if (name.endsWith('.json')) return '📊';
        
        return '📎';
    }
    
    previewFile(file) {
        const modal = document.getElementById('preview-modal');
        const title = document.getElementById('preview-title');
        const content = document.getElementById('preview-content');
        const downloadBtn = document.getElementById('preview-download');
        const copyBtn = document.getElementById('preview-copy');
        const deleteBtn = document.getElementById('preview-delete');
        
        title.textContent = file.originalName;
        
        // 设置下载链接
        downloadBtn.href = file.data;
        downloadBtn.download = file.originalName;
        
        // 设置复制按钮
        copyBtn.onclick = () => {
            this.copyToClipboard(file.data);
            this.showNotification('文件链接已复制到剪贴板', 'success');
        };
        
        // 设置删除按钮
        deleteBtn.onclick = () => {
            if (confirm(`确定要删除 "${file.originalName}" 吗？`)) {
                this.deleteFile(file.id);
                this.hidePreview();
            }
        };
        
        // 根据文件类型显示预览
        if (file.type.startsWith('image/')) {
            content.innerHTML = `<img src="${file.data}" alt="${file.originalName}" class="preview-image">`;
        } else if (file.type.startsWith('text/') || file.type.includes('json') || 
                   file.type.includes('javascript') || file.name.endsWith('.md')) {
            // 尝试解码base64数据
            try {
                const base64Data = file.data.split(',')[1];
                const text = atob(base64Data);
                content.innerHTML = `<pre class="preview-text">${this.escapeHtml(text)}</pre>`;
            } catch (error) {
                content.innerHTML = `
                    <div class="preview-unsupported">
                        <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z"/>
                        </svg>
                        <h4>无法预览此文件</h4>
                        <p>请下载后查看</p>
                    </div>
                `;
            }
        } else if (file.type.includes('pdf')) {
            // 尝试内嵌PDF
            content.innerHTML = `
                <embed src="${file.data}" type="application/pdf" width="100%" height="500px">
                <p class="preview-hint">如果无法显示PDF，请下载后查看</p>
            `;
        } else {
            content.innerHTML = `
                <div class="preview-unsupported">
                    <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z"/>
                    </svg>
                    <h4>无法预览此文件</h4>
                    <p>请下载后查看</p>
                </div>
            `;
        }
        
        modal.classList.add('show');
    }
    
    hidePreview() {
        document.getElementById('preview-modal').classList.remove('show');
    }
    
    downloadFile(file) {
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification(`已开始下载: ${file.originalName}`, 'success');
    }
    
    deleteFile(fileId) {
        if (this.files.has(fileId)) {
            const fileName = this.files.get(fileId).originalName;
            this.files.delete(fileId);
            this.saveFiles();
            this.updateUI();
            this.showNotification(`已删除: ${fileName}`, 'success');
        }
    }
    
    showFolderModal() {
        document.getElementById('folder-modal').classList.add('show');
        document.getElementById('folder-name').focus();
    }
    
    hideFolderModal() {
        document.getElementById('folder-modal').classList.remove('show');
        document.getElementById('folder-name').value = '';
    }
    
    createFolder() {
        const name = document.getElementById('folder-name').value.trim();
        
        if (!name) {
            this.showNotification('请输入文件夹名称', 'warning');
            return;
        }
        
        // 这里简化处理，实际应该实现完整的文件夹结构
        this.currentFolder = name;
        this.saveFiles();
        this.updateUI();
        this.hideFolderModal();
        
        this.showNotification(`已切换到文件夹: ${name}`, 'success');
    }
    
    switchView(mode) {
        this.viewMode = mode;
        const fileList = document.getElementById('file-list');
        const gridBtn = document.getElementById('grid-view-btn');
        const listBtn = document.getElementById('list-view-btn');
        
        fileList.className = `file-list ${mode}-view`;
        
        gridBtn.classList.toggle('active', mode === 'grid');
        listBtn.classList.toggle('active', mode === 'list');
    }
    
    updateStats() {
        const files = Array.from(this.files.values());
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        
        document.getElementById('file-count').textContent = files.length;
        document.getElementById('storage-usage').textContent = this.formatSize(totalSize);
        
        // 更新存储状态
        this.updateStorageStatus();
    }
    
    updateStorageStatus() {
        try {
            const totalSize = JSON.stringify(this.files).length;
            const maxSize = 5 * 1024 * 1024; // 5MB localStorage限制
            const percent = Math.round((totalSize / maxSize) * 100);
            
            let status = `${this.formatSize(totalSize)} / ${this.formatSize(maxSize)}`;
            if (percent > 80) {
                status += ' ⚠️ 空间不足';
            } else if (percent > 60) {
                status += ' ⚠️ 空间紧张';
            }
            
            document.getElementById('storage-status').textContent = status;
        } catch (error) {
            document.getElementById('storage-status').textContent = '无法检测';
        }
    }
    
    checkOnlineStatus() {
        const statusEl = document.getElementById('offline-status');
        if (navigator.onLine) {
            statusEl.textContent = '✅ 在线';
            statusEl.className = 'stat-value online';
        } else {
            statusEl.textContent = '🔴 离线';
            statusEl.className = 'stat-value offline';
        }
    }
    
    clearStorage() {
        if (confirm('确定要清空所有文件和设置吗？此操作不可撤销。')) {
            this.files.clear();
            this.currentFolder = '';
            localStorage.clear();
            this.updateUI();
            this.showNotification('已清空所有文件', 'success');
        }
    }
    
    exportData() {
        const exportData = {
            files: Object.fromEntries(this.files),
            currentFolder: this.currentFolder,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', `webd-backup-${new Date().getTime()}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('数据导出成功', 'success');
    }
    
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importData = JSON.parse(event.target.result);
                    
                    // 验证数据格式
                    if (!importData.files || !importData.currentFolder) {
                        throw new Error('无效的数据格式');
                    }
                    
                    // 合并文件（避免ID冲突）
                    Object.entries(importData.files).forEach(([id, fileData]) => {
                        const newId = this.generateId();
                        fileData.id = newId;
                        this.files.set(newId, fileData);
                    });
                    
                    this.currentFolder = importData.currentFolder;
                    this.saveFiles();
                    this.updateUI();
                    
                    this.showNotification('数据导入成功', 'success');
                } catch (error) {
                    this.showNotification(`导入失败: ${error.message}`, 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        if (type === 'warning') icon = '⚠️';
        
        notification.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
        `;
        
        container.appendChild(notification);
        
        // 自动移除通知
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    initPWA() {
        // 注册Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(registration => {
                        console.log('ServiceWorker注册成功:', registration.scope);
                    })
                    .catch(error => {
                        console.log('ServiceWorker注册失败:', error);
                    });
            });
        }
        
        // 检测是否可安装
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            // 阻止默认安装提示
            e.preventDefault();
            deferredPrompt = e;
            
            // 显示自定义安装提示
            this.showNotification('可以安装为应用程序', 'success');
            
            // 添加安装按钮（这里简化处理）
            const installBtn = document.createElement('button');
            installBtn.textContent = '📱 安装应用';
            installBtn.className = 'btn btn-primary';
            installBtn.style.marginTop = '10px';
            
            installBtn.addEventListener('click', () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('用户接受了安装');
                        } else {
                            console.log('用户拒绝了安装');
                        }
                        deferredPrompt = null;
                    });
                }
            });
            
            // 可以在这里将安装按钮添加到页面
        });
    }
}

// Service Worker (sw.js)
const CACHE_NAME = 'webd-github-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const app = new WebdGitHub();
    
    // 将app暴露给全局，方便调试
    window.webdApp = app;
    
    console.log('Webd-GitHub 已启动');
});