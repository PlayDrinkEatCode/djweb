// 获取DOM元素
const $ = (selectors, index = 0) => {
    const element = document.querySelectorAll(selectors);
    if (index < 0 && element.length > 1) {
        return element;
    }
    return element[index];
};


const ajax = {
    get(path, callback, ...args) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (args.length) {
                    callback(xhr.responseText, ...args);
                } else {
                    callback(xhr.responseText);
                }
            }
        };
        xhr.send();
    }
};


// 替换掉所有字符串
const replaceAll = (text, fromStr, toStr = '') => {
    while (text.includes(fromStr)) {
        text = text.replace(fromStr, toStr);
    }
    return text;
};


// 全屏功能
const requestFullscreen = (element) => {
    if (element.requestFullScreen) {
        element.requestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
};


// 退出全屏功能
const exitFullscreen = (element) => {
    if (element.requestFullScreen) {
        document.exitFullscreen();
    } else if (element.webkitRequestFullScreen) {
        document.webkitCancelFullScreen();
    } else if (element.mozRequestFullScreen) {
        document.mozCancelFullScreen();
    }
};


// 绑定元素双击控制全屏功能
const bindFullscreen = (element) => {
    element.setAttribute('clickTimes', 0);
    let times = 0;
    element.addEventListener('click', (e) => {
        if (getComputedStyle(e.target).cursor == 'pointer') {
            return element.setAttribute('clickTimes', times = 0);
        }
        times = element.getAttribute('clickTimes');
        element.setAttribute('clickTimes', ++times);
        if (times == 2) {
            if (document.fullscreenElement) {
                exitFullscreen(element);
            } else {
                requestFullscreen(element);
            }
            return element.setAttribute('clickTimes', times = 0);
        }
        setTimeout(() => {
            if (times) {
                element.setAttribute('clickTimes', --times);
            }
        }, 500);
    });
};


// 清空cookie
const clearCookie = () => {
    const cookie = document.cookie.split('; ');
    for (const i in cookie) {
        const name = cookie[i].split('=')[0];
        document.cookie = name + '=0; expires=' + new Date(0).toUTCString();
    }
};


// 添加cookie
const setCookie = (name, value) => {
    document.cookie = name + '=' + value;
};


// 获取cookie值
const getCookie = (name) => {
    const cookie = document.cookie.split('; ');
    for (const i in cookie) {
        if (name == cookie[i].split('=')[0]) {
            return cookie[i].split('=')[1];
        }
    }
};


// 判断两个数值是否接近
const isClose = (num1, num2) => {
};


// 绘制太极图
const drawTaiChiDiagram = () => {
    const canvas = $('#taiChiDiagram');
    canvas.width = 2000;
    canvas.height = 2000;
    const ctx = canvas.getContext('2d');
    ctx.translate(1000, 1000);
    ctx.lineWidth = 0;
    ctx.beginPath();
    ctx.arc(0, 0, 1000, Math.PI * 1.5, Math.PI * 2.5);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(0, 0, 1000, Math.PI * 0.5, Math.PI * 1.5);
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.translate(0, -500);
    ctx.beginPath();
    ctx.arc(0, 0, 500, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.translate(0, 1000);
    ctx.beginPath();
    ctx.arc(0, 0, 500, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.translate(0, -1000);
    ctx.beginPath();
    ctx.arc(0, 0, 125, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.translate(0, 1000);
    ctx.beginPath();
    ctx.arc(0, 0, 125, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
};