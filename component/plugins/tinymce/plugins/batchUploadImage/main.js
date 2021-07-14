const {editor, dialog} = parent.BatchUploadImage;
const uploadHandler = editor.getParam('images_upload_handler', undefined, 'function');
const fileType = editor.getParam('batch_upload_image_type', ['jpg', 'jpeg', 'png', 'gif'], 'array');
const accept = fileType.map(type => `.${type}`).toString();
const uploadButton = document.querySelector('#upload');
const list = document.querySelector('#list');
const images = [];

// 添加图片
document.querySelector('#choose').addEventListener('click', () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('multiple', 'multiple');
    input.setAttribute('accept', accept);
    input.onchange = function () {
        checkImage(this.files);
    }
    input.click();
});

// 批量上传
uploadButton.addEventListener('click', function () {
    let length = 0;
    images.forEach(v => {
        if (v.url === '') {
            length++;
            if (v.state === -1) {
                v.state = 0;
            }
        }
    });

    if (length) {
        this.disabled = true;
        uploadQueue();
    }
});

// 取消
document.querySelector('#cancel').addEventListener('click', () => {
    dialog.close();
});

// 清空列表
document.querySelector('#empty').addEventListener('click', () => {
    document.querySelector('#list').innerHTML = '';
    images.length = 0;
});

// 全部插入
document.querySelector('#insert').addEventListener('click', () => {
    if (images.length) {
        let html = '';
        images.forEach(img => {
            if (img.url) {
                html += `<img src="${img.url}" alt="" />`;
            }
        });
        editor.insertContent(html);
        images.length = 0;
    }
    dialog.close();
});

/**
 * 拖拽上传
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Document/drop_event
 */
document.addEventListener('dragover', e => e.preventDefault());
document.querySelector('#main').addEventListener('drop', function (e) {
    e.preventDefault();
    checkImage(e.dataTransfer.files);
});

// 删除
list.addEventListener('click', ({target}) => {
    if (target.classList.contains('remove')) {
        let index = Array.from(list.querySelectorAll('.remove')).indexOf(target);
        list.removeChild(target.parentElement);
        delete images.splice(index, 1);
    }
});

// 获取文件扩展名
function ext(filename) {
    return filename.split('.').pop();
}

// 检查图片格式
function checkImage(files) {
    if (files.length) {
        const _files = Array.from(files).filter(file => fileType.indexOf(ext(file.name)) > -1);
        let items = _files.map(file => {
            let blobUrl = window.URL.createObjectURL(file);
            images.push({file: file, blobUrl: blobUrl, url: '', state: 0});
            return `<li class="item" data-state="0"><img class="image" src="${blobUrl}" alt=""><div class="name" title="${file.name}">${file.name}</div><span class="remove"></span></li>`;
        });
        list.innerHTML += items.join('');
    }
}

// 图片上传队列
function uploadQueue() {
    let index = images.findIndex(v => v.state === 0);
    if (index === -1) {
        uploadButton.disabled = false;
        return;
    }

    let item = list.querySelectorAll('li')[index];
    item.dataset.state = '1'; // 上传中

    const img = images[index];
    const data = {
        file: img.file,
        blob: () => img.file
    };
    uploadHandler(data, function (url) {
        img.url = url;
        img.state = 2;
        item.dataset.state = '2'; // 上传成功
        uploadQueue();
    }, function () {
        img.state = -1;
        item.dataset.state = '-1'; // 上传失败
        uploadQueue();
    });
}