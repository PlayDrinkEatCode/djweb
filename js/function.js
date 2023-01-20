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


// 获取随机整数
const getRandomInt = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}


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
    element.setAttribute('data-clickTimes', 0);
    element.addEventListener('click', (e) => {
        if (getComputedStyle(e.target).cursor == 'pointer') {
            return element.setAttribute('data-clickTimes', 0);
        }
        let times = element.getAttribute('data-clickTimes');
        element.setAttribute('data-clickTimes', ++times);
        if (times == 2) {
            if (document.fullscreenElement) {
                exitFullscreen(element);
            } else {
                requestFullscreen(element);
            }
            return element.setAttribute('data-clickTimes', 0);
        }
        setTimeout(() => {
            let times = element.getAttribute('data-clickTimes');
            if (+times) {
                element.setAttribute('data-clickTimes', --times);
            }
        }, 500);
    });
};


// 绑定移动功能
const bindMoveFunction = (element, functions) => {
    if (functions.default) {
        functions.default();
    }
    if (functions.start) {
        element.addEventListener('mousedown', functions.start);
        element.addEventListener('touchstart', functions.start);
    }
    if (functions.move) {
        element.addEventListener('mousemove', functions.move);
        element.addEventListener('touchmove', functions.move);
    }
    if (functions.end) {
        element.addEventListener('mouseup', functions.end);
        element.addEventListener('touchend', functions.end);
    }
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


// 绑定文字动画
const bindTextAnimation = (element, text, time, end) => {
    const textAnimation = () => {
        const nowText = element.innerHTML;
        const timer = setTimeout(() => {
            if (end && end()) {
                return clearInterval(timer);
            }
            if (nowText != text) {
                element.innerHTML = nowText + text[nowText.length];
            } else {
                element.innerHTML = '';
            }
            textAnimation();
        }, time);
    };
    textAnimation();
};


// 绑定值相等事件
const bindEqualValues = (value1, value2, event) => {
    const timer = setInterval(() => {
        const value = [];
        if (typeof value1 == 'function') {
            value[0] = value1();
        } else {
            value[0] = value1;
        }
        if (typeof value2 == 'function') {
            value[1] = value2();
        } else {
            value[1] = value2;
        }
        if (value[0] == value[1]) {
            event();
            clearInterval(timer);
        }
    }, 10);
};


// 绑定菜单功能
const bindMenu = (element, functions) => {
    const state = {
        valid: true,
        x: 0,
        y: 0,
        target: null,
        timer: 0
    };
    const show = (e) => {
        if (state.valid) {
            functions.show(e);
            state.valid = false;
        }
    }
    element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        show(e);
    });
    element.addEventListener('mousedown', (e) => {
        state.valid = true;
    });
    element.addEventListener('touchstart', (e) => {
        state.valid = true;
        state.x = e.touches[0].clientX;
        state.y = e.touches[0].clientY;
        state.target = e.touches[0].target;
        state.timer = setTimeout(() => {
            show(e);
        }, 500);
    });
    element.addEventListener('touchmove', (e) => {
        if (e.target != state.target) {
            state.valid = false;
        }
    });
    element.addEventListener('touchend', (e) => {
        clearTimeout(state.timer);
        if (!state.valid) {
            e.preventDefault();
        }
    });
};


// 绑定下雨动画
const bindRainAnimation = (canvas, rainDensity) => {
    let timer;
    let needCreate;
    const ctx = canvas.getContext('2d');
    const rains = [];
    const waters = [];
    const color = {};
    const getColor = () => {
        const colorStyle = getComputedStyle($('body'));
        color.red = +colorStyle.getPropertyValue('--rain-red');
        color.green = +colorStyle.getPropertyValue('--rain-green');
        color.blue = +colorStyle.getPropertyValue('--rain-blue');
    };
    const createWater = (rain) => {
        const number = parseInt(rain.size / 5);
        for (let i = 0; i < number; i++) {
            waters.push({
                x: getRandomInt(rain.x - 5, rain.x + 5),
                y: getRandomInt(window.innerHeight - 5, window.innerHeight),
                opacity: rain.opacity,
                xSpeed: getRandomInt(-2, 2),
                ySpeed: -3
            });
        }
    };
    const drawWater = (water) => {
        if (water.y > window.innerHeight) {
            waters.splice(waters.indexOf(water), 1);
            return;
        }
        water.x += water.xSpeed;
        water.y += water.ySpeed;
        water.ySpeed++;
        ctx.beginPath();
        ctx.arc(water.x, water.y, 0.5, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(${color.red}, ${color.green}, ${color.blue}, ${water.opacity})`;
        ctx.fillStyle = `rgba(${color.red}, ${color.green}, ${color.blue}, ${water.opacity})`;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    };
    const createRain = (number) => {
        for (let i = 0; i < number; i++) {
            rains.push({
                water: true,
                x: getRandomInt(0, window.innerWidth),
                y: getRandomInt(-window.innerHeight, -30),
                size: getRandomInt(15, 30),
                opacity: (() => {
                    let opacity = Math.random();
                    if (opacity < 0.3) {
                        opacity += 0.3;
                    }
                    return opacity.toFixed(1);
                })() ,
                speed: 5
            });
        }
    };
    const drawRain = (rain) => {
        if (rain.y >= window.innerHeight) {
            rains.splice(rains.indexOf(rain), 1);
            if (needCreate) {
                createRain(1);
            }
            return;
        }
        rain.y += rain.speed;
        if (rain.y >= 0 && rain.speed < 10) {
            rain.speed++;
        }
        if (rain.water && rain.y + rain.size >= window.innerHeight) {
            createWater(rain);
            rain.water = false;
        }
        ctx.beginPath();
        ctx.moveTo(rain.x, rain.y);
        ctx.lineTo(rain.x, rain.y + rain.size);
        ctx.strokeStyle = `rgba(${color.red}, ${color.green}, ${color.blue}, ${rain.opacity})`;
        ctx.stroke();
        ctx.closePath();
    };
    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const i in rains) {
            drawRain(rains[i]);
        }
        for (const i in waters) {
            drawWater(waters[i]);
        }
        if (!rains.length && !waters.length) {
            clearInterval(timer);
            timer = null;
        }
    };
    const start = () => {
        getColor();
        needCreate = true;
        if (!timer) {
            timer = setInterval(() => draw(), 10);
        }
        createRain(rainDensity - rains.length);
    };
    start();
    return {
        stop() {
            needCreate = false;
            draw();
        },
        start,
        getColor
    };
};