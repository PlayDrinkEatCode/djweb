{
    let light = 'dark';
    let otherLight = 'blue';
    let clicked = false;
    let loaded = false;
    let indexText;
    const page = {
        colorStyle: 'colorStyle'
    };
    const html = $('html');
    const loading = $('#loading');
    const taiChiDiagram = $('#taiChiDiagram');
    const loadingText = $('.text');
    const header = $('header');
    const main = $('main');
    const container = $('#container');
    const containers = [container];
    const homeText = $('#homeText');
    const music = $('audio');
    const musicBtn = $('#musicBtn');
    const lightBtn = $('#lightBtn');
    const mask = $('#mask');
    const animationCanvas = $('#animationCanvas');


    // 绑定移动进入配色设置页面功能
    bindMoveFunction(html, {
        default: () => {
            html.setAttribute('data-startX', 'null');
            html.setAttribute('data-endX', 'null');
        },
        start: (e) => {
            if (e.clientX != null) {
                html.setAttribute('data-startX', e.clientX);
            } else {
                html.setAttribute('data-startX', e.touches[0].clientX);
            }
        },
        move: (e) => {
            if (html.getAttribute('data-startX') != 'null') {
                if (e.clientX != null) {
                    html.setAttribute('data-endX', e.clientX);
                } else {
                    html.setAttribute('data-endX', e.touches[0].clientX);
                }
            }
        },
        end: () => {
            const x = html.getAttribute('data-startX');
            const endX = html.getAttribute('data-endX');
            if (endX != 'null' && +x - +endX > window.innerWidth * 0.2) {
                lightPageShow();
                html.setAttribute('data-clicktimes', 0);
            }
            html.setAttribute('data-startX', 'null');
            html.setAttribute('data-endX', 'null');
        }
    });
    // 双击全屏功能
    bindFullscreen(html);
    animationCanvas.width = window.innerWidth;
    animationCanvas.height = window.innerHeight;
    // 绑定背景下雨动画
    const rainAnimation = bindRainAnimation(animationCanvas, 100);

    
    const getClosestKeyWord = (keyWords, text) => {
        let index = text.length;
        let keyWord;
        for (const i in keyWords) {
            const keyWordIndex = text.indexOf(i);
            if (keyWordIndex >= 0 && keyWordIndex < index) {
                index = keyWordIndex;
                keyWord = i;
            }
        }
        return keyWord;
    };


    const getComputedText = (keyWords, text) => {
        while (getClosestKeyWord(keyWords, text)) {
            text = text.replace(getClosestKeyWord(keyWords, text), '');
        }
        return text;
    };


    const getKeyWords = (text) => {
        return {
            '[page-y-center:]': {
                target: 'container',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }
            },
            '[y-center:]': {
                style: {
                    display: 'flex',
                    justifyContent: 'center'
                }
            },
            '[indent:]': {
                style: {
                    textIndent: '2em'
                }
            },
            '[center:]': {
                style: {
                    textAlign: 'center'
                }
            },
            '[right:]': {
                style: {
                    textAlign: 'right'
                }
            },
            '[uppercase:]': {
                style: {
                    textTransform: 'uppercase'
                }
            },
            '[opacity-change:]': {
                style: {
                    opacity: 0,
                    animation: 'opacityChange linear 4s infinite'
                }
            },
            '[title:]': {
                style: {
                    textAlign: 'center'
                }
            },
            [text.match(/\[font-size:[\d\.]*?:\]/)]: {
                className: 'font-size',
                setProperty: {
                    property: '--font-size',
                    value: (() => {
                        if (text.match(/\[font-size:[\d\.]*?:\]/)) {
                            return text.split('[font-size:')[1].split(':]')[0];
                        }
                    })()
                }
            },
            [text.match(/\[color:.*?:\]/)]: {
                className: 'color',
                style: {
                    color: (() => {
                        if (text.match(/\[color:.*?:\]/)) {
                            return text.split('[color:')[1].split(':]')[0];
                        }
                    })()
                }
            },
            [text.match(/\[link:.*?:\]/)]: {
                style: {
                    display: 'contents',
                    textDecoration: 'none',
                    cursor: 'pointer'
                },
                function: {
                    click: (text) => {
                        window.open(text.keyWordName.split('[link:')[1].split(':]')[0]);
                    },
                    mouseover: (text) => {
                        text.target.classList.remove('link');
                    },
                    mouseout: (text) => {
                        text.target.classList.add('link');
                    }
                },
                className: 'link'
            },
            '[:link]': {},
            [text.match(/\[image:.*?:\]/)]: {
                style: {
                    display: 'block',
                    margin: 'auto',
                    maxWidth: '80%',
                    maxHeight: '50vh'
                }
            },
            [text.match(/\[icon:.*?:\]/)]: {
                style: {
                    borderRadius: '50%',
                    transition: 'all 1s'
                },
                className: 'icon'
            },
            '[friendly-link:]': {
                style: {
                    display: 'flex',
                    marginLeft: '30%',
                    width: 'fit-content'
                },
                className: 'friendlyLink'
            },
            '[:friendly-link]': {},
            '[link-text:]': {
                style: {
                    display: 'flex',
                    width: 'fit-content',
                    alignItems: 'center',
                    transition: 'all 1s'
                }
            },
            '[:link-text]': {},
            [text.match(/\[light:.*?:\]/)]: {
                style: {
                    display: (() => {
                        if (text.match(/\[light:.*?:\]/)) {
                            return text.split('[light:')[1].split(':]')[0] == light ? 'block' : 'none';
                        }
                    })()
                },
                className: ['light', 'light-' + (() => {
                    if (text.match(/\[light:.*?:\]/)) {
                        return text.split('[light:')[1].split(':]')[0];
                    }
                })()]
            },
            '[:light]': {},
            [text.match(/\[color-style:.*?:\]/)]: {
                style: {
                    background: (() => {
                        if (text.match(/\[color-style:.*?:\]/)) {
                            return text.split('[color-style:')[1].split(':')[1].split(':]')[0];
                        }
                    })()
                },
                className: 'colorStyle',
                function: {
                    'click': (text) => {
                        setLight(text.keyWordName.split('[color-style:')[1].split(':')[0]);
                    }
                }
            }
        };
    };
    

    const setElement = (text, special = false) => {
        if (special) {
            return getComputedText(getKeyWords(text), text);
        }
        if (containers.length > 1) {
            containers.pop();
        }
        const newContainer = document.createElement('div');
        containers.push(newContainer);
        let target = containers[containers.length - 1];
        let keyWords = getKeyWords(text);
        while (getClosestKeyWord(keyWords, text)) {
            let keyWordName = getClosestKeyWord(keyWords, text);
            const keyWord = keyWords[keyWordName];
            if (keyWord.target == 'container') {
                target = containers[0];
            } else {
                target = containers[containers.length - 1];
            }
            if (keyWordName == '[title:]') {
                text = text.replace('[title:]', '[title:][font-size:1.5:]');
                keyWords = getKeyWords(text);
            }
            if (keyWordName) {
                const keyWordIndex = text.indexOf(keyWordName);
                if (keyWordIndex > 0) {
                    target.append(text.slice(0, keyWordIndex));
                }
                text = text.slice(keyWordIndex);
            }
            if (keyWordName.includes('[link:')) {
                target = document.createElement('a');
                containers[containers.length - 1].appendChild(target);
                containers.push(target);
            }
            if (keyWordName == '[:link]') {
                containers.pop();
                target = containers[containers.length - 1];
            }
            if (keyWordName == '[friendly-link:]') {
                target = document.createElement('div');
                containers[containers.length - 1].appendChild(target);
                containers.push(target);
            }
            if (keyWordName == '[:friendly-link]') {
                containers.pop();
                target = containers[containers.length - 1];
            }
            if (keyWordName == '[link-text:]') {
                target = document.createElement('div');
                containers[containers.length - 1].appendChild(target);
                containers.push(target);
            }
            if (keyWordName == '[:link-text]') {
                containers.pop();
                target = containers[containers.length - 1];
            }
            if (keyWordName.includes('[image:')) {
                const image = document.createElement('img');
                image.src = keyWordName.split('[image:')[1].split(':]')[0];
                containers[containers.length - 1].appendChild(image);
            }
            if (keyWordName.includes('[icon:')) {
                target = document.createElement('img');
                target.src = keyWordName.split('[icon:')[1].split(':]')[0];
                containers[containers.length - 1].appendChild(target);
            }
            if (keyWordName.includes('[light:')) {
                target = document.createElement('div');
                containers[containers.length - 1].appendChild(target);
                containers.push(target);
            }
            if (keyWordName == '[:light]') {
                containers.pop();
                target = containers[containers.length - 1];
            }
            if (keyWordName.includes('[color-style:')) {
                target = document.createElement('div');
                containers[containers.length - 1].appendChild(target);
            }
            const className = keyWord.className;
            if (className) {
                if (typeof className == 'string') {
                    target.classList.add(className);
                } else {
                    for (const i in className) {
                        target.classList.add(className[i]);
                    }
                }
            }
            if (keyWord.style) {
                Object.assign(target.style, keyWord.style);
            }
            if (keyWord.setProperty) {
                const setProperty = keyWord.setProperty;
                target.style.setProperty(setProperty.property, setProperty.value);
            }
            if (keyWord.function) {
                for (const i in keyWord.function) {
                    target.addEventListener(i, ((keyWordName, target) => {
                        return () => {
                            keyWord.function[i]({
                                keyWordName,
                                target
                            });
                        };
                    })(keyWordName, target));
                }
            }
            text = text.replace(keyWordName, '');
            if (keyWord.target == 'container' || keyWordName.includes('[icon:')) {
                target = containers[containers.length - 1];
            }
            keyWords = getKeyWords(text);
        }
        target.append(text.slice(0, text.length));
        containers[0].appendChild(newContainer);
    };


    const setPage = (name) => {
        if ($('#homeText')) {
            main.removeChild(homeText);
            container.style.display = 'block';
        }
        container.innerHTML = '';
        container.style.display = 'block';
        nowNavSet();
        ajax.get('txt/page/' + page[name] + '.txt', (text, pageNow) => {
            if (pageNow == html.getAttribute('data-pageNow')) {
                container.innerHTML = '';
                text = text.split('\r\n');
                for (const i in text) {
                    setElement(text[i]);
                }
            }
        }, html.getAttribute('data-pageNow'));
    };


    const setHeader = (text) => {
        text = text.split('\r\n');
        for (const i in text) {
            const name = text[i].split('-')[0];
            const path = text[i].split('-')[1];
            const nav = document.createElement('nav');
            nav.innerHTML = name;
            nav.addEventListener('click', () => {
                const pageNow = html.getAttribute('data-pageNow');
                if (i != pageNow) {
                    html.setAttribute('data-pageNow', i);
                    setPage(name);
                }
            });
            header.appendChild(nav);
            page[name] = path;
        }
    };


    const nowNavSet = () => {
        const pageNow = html.getAttribute('data-pageNow');
        const lastNav = header.querySelector('.now');
        if (lastNav) {
            lastNav.classList.remove('now');
        }
        if (pageNow >= 0) {
            $('nav', pageNow).classList.add('now');
        }
    };


    const headerShow = () => {
        header.style.height = '10%';
        Object.assign(main.style, {
            top: '17.5%',
            height: '75%'
        });
        bindEqualValues(() => parseInt(header.offsetHeight) >= parseInt(window.innerHeight * 0.1), true, () => {
            header.classList.add('show');
            nowNavSet();
            homeText.style.opacity = 0;
            bindEqualValues(() => +getComputedStyle(homeText).opacity, 0, () => {
                if ($('#homeText')) {
                    setPage($('nav', html.getAttribute('data-pageNow')).innerHTML);
                }
            });
        });
    };


    const musicBtnShow = () => {
        musicBtn.onclick = () => {};
        Object.assign(musicBtn.style, {
            cursor: 'pointer',
            opacity: 1
        });
        $('.menu').style.display = 'block';
        bindEqualValues(() => getComputedStyle(musicBtn).opacity, 1, () => {
            musicBtn.addEventListener('click', () => {
                if (music.paused) {
                    music.play();
                } else {
                    music.pause();
                }
            });

            // 绑定音乐播放控制按钮菜单
            bindMenu(musicBtn, {
                show() {
                    menuShow(0);
                }
            });
            // 播放背景音乐
            music.play();
        });
    };


    const loadEvent = () => {
        if (loaded) {
            setTimeout(() => {
                loading.style.opacity = 0;
                bindEqualValues(() => getComputedStyle(loading).opacity, 0, () => {
                    main.removeChild(loading);
                    bindTextAnimation(homeText, setElement(indexText, true).toUpperCase(), 100, () => {
                        if (homeText.innerHTML == setElement(indexText, true).toUpperCase()) {
                            headerShow();
                            musicBtnShow();
                            return true;
                        }
                        return false;
                    });
                });
            }, 2000);
        }
    };


    const setLight = (needLight) => {
        document.body.classList.remove(light);
        light = needLight;
        document.body.classList.add(light);
        setCookie('light', light);
        rainAnimation.getColor();
        if (light == 'dark') {
            lightBtn.innerHTML = '&#xe7c5;';
        } else if (light == 'white') {
            lightBtn.innerHTML = '&#xe7c0;';
        } else {
            lightBtn.innerHTML = '&#xe7bf;';
            otherLight = light;
            setCookie('otherLight', light);
        }
        const lightElement = $('.light', -1);
        if (lightElement) {
            for (let i = 0; i < lightElement.length; i++) {
                if (lightElement[i].classList.contains('light-' + light)) {
                    lightElement[i].style.display = 'block';
                } else {
                    lightElement[i].style.display = 'none';
                }
            }
        }
    };

    
    const lightPageShow = () => {
        const pageNow = html.getAttribute('data-pageNow');
        if (pageNow != -2) {
            if (($('#homeText') && homeText.innerHTML == setElement(indexText, true).toUpperCase()) || !$('#homeText')) {
                html.setAttribute('data-pageNow', -2);
                setPage('colorStyle');
            }
        }
    }


    const setBtnFunction = () => {
        const btn = $('.btn', -1);
        for (let i = 0; i < btn.length; i++) {
            if (btn[i].innerHTML == '播放') {
                btn[i].addEventListener('click', () => {
                    if (music.paused) {
                        music.play();
                    } else {
                        music.pause();
                    }
                });
            } else if (btn[i].innerHTML == '白天配色') {
                btn[i].addEventListener('click', () => {
                    setLight('white');
                });
            } else if (btn[i].innerHTML == '黑夜配色') {
                btn[i].addEventListener('click', () => {
                    setLight('dark');
                });
            } else if (btn[i].innerHTML == '喜爱配色') {
                btn[i].addEventListener('click', () => {
                    setLight(otherLight);
                });
            } else if (btn[i].innerHTML == '配色设置页') {
                btn[i].addEventListener('click', () => {
                    lightPageShow();
                });
            } else if (btn[i].innerHTML == '关闭动画') {
                btn[i].addEventListener('click', () => {
                    if (btn[i].innerHTML == '关闭动画') {
                        rainAnimation.stop();
                        btn[i].innerHTML = '开启动画';
                    } else {
                        rainAnimation.start();
                        btn[i].innerHTML = '关闭动画';
                    }
                });
            } else if (btn[i].getAttribute('data-href')) {
                btn[i].addEventListener('click', () => {
                    window.open(btn[i].getAttribute('data-href'));
                });
            }
        }
    };


    const menuShow = (index) => {
        const menu = $('.menu', index);
        menu.classList.remove('hide');
        Object.assign(menu.style, {
            width: '17vh',
            height: '20vh',
            boxShadow: '0 0 5px #000000'
        });
        if (index) {
            lightBtn.style.background = 'none';
        } else {
            musicBtn.style.background = 'none';
        }
        mask.style.display = 'block';
        pageMenuHide();
    };


    const menuHide = () => {
        const menu = $('.menu', -1);
        for (let i = 0; i < menu.length; i++) {
            menu[i].classList.add('hide');
            Object.assign(menu[i].style, {
                width: '',
                height: '',
                boxShadow: ''
            });
        }
        musicBtn.style.background = '';
        lightBtn.style.background = '';
    };


    const pageMenuHide = () => {
        Object.assign($('#pageMenu').style, {
            width: '',
            height: '',
            boxShadow: ''
        });
        bindEqualValues(() => getComputedStyle($('#pageMenu')).width.replace('px', ''), 0, () => {
            Object.assign($('#pageMenu').style, {
                top: '',
                left: ''
            });
        });
    };


    {
        drawTaiChiDiagram();
        setBtnFunction();
        html.setAttribute('data-pageNow', 0);
        if (getCookie('light')) {
            light = getCookie('light');
        }
        if (getCookie('otherLight')) {
            otherLight = getCookie('otherLight');
        }
        document.body.classList.add(light);
        setLight(light);
        document.body.style.display = 'block';
        ajax.get('txt/page.txt', setHeader);
        ajax.get('txt/page/index.txt', (text) => {
            indexText = text;
        });
        taiChiDiagram.addEventListener('click', () => {
            if (!clicked) {
                clicked = true;
                taiChiDiagram.style.cursor = 'auto';
                loadingText.style.opacity = 0;
                bindEqualValues(() => getComputedStyle(loadingText).opacity, 0, () => {
                    taiChiDiagram.style.animation = 'taiChiDiagramRotate linear 2s infinite';
                    Object.assign(loadingText.style, {
                        transition: '',
                        opacity: 1
                    });
                    loadingText.innerHTML = '';
                    bindTextAnimation(loadingText, '网页正在加载...', 200, () => !$('#loading'));
                    loadEvent();
                });
            }
        });
    };


    music.addEventListener('ended', () => {
        music.currentTime = 0;
        music.play();
    });


    music.addEventListener('pause', () => {
        musicBtn.innerHTML = '&#xe62b;';
        $('.btn', 1).innerHTML = '播放';
    });


    music.addEventListener('play', () => {
        musicBtn.innerHTML = '&#xe62a;';
        $('.btn', 1).innerHTML = '暂停';
    });


    musicBtn.onclick = () => {
        menuHide();
        pageMenuHide();
        mask.style.display = 'none';
    };


    lightBtn.addEventListener('click', () => {
        if (light == 'dark') {
            setLight('white');
        } else if (light == 'white') {
            setLight(otherLight);
        } else {
            setLight('dark');
        }
    });

    
    // 绑定配色切换按钮菜单
    bindMenu(lightBtn, {
        show() {
            menuShow(1);
        }
    });

    


    mask.addEventListener('click', () => {
        menuHide();
        pageMenuHide();
        mask.style.display = 'none';
    });


    // 绑定页面菜单
    bindMenu(window, {
        show(e) {
            if ((e.target != musicBtn || getComputedStyle(musicBtn).opacity == 0) && e.target != lightBtn && !e.target.classList.contains('btn')) {
                const pageMenu = $('#pageMenu');
                let x;
                let y;
                const width = window.innerHeight * 0.14;
                const height = window.innerHeight * 0.12;
                if (e.touches) {
                    x = e.touches[0].clientX;
                    y = e.touches[0].clientY;
                } else {
                    x = e.clientX;
                    y = e.clientY;
                }
                if (x < 5) {
                    x = 5;
                } else if (x + width > window.innerWidth - 5) {
                    x = x - width - 5;
                }
                if (y < 5) {
                    y = 5;
                } else if (y + height > window.innerHeight - 5) {
                    y = y - height - 5;
                }
                if (getComputedStyle(musicBtn).opacity != 0) {
                    if (y > musicBtn.offsetTop && x < musicBtn.offsetLeft + musicBtn.offsetWidth + 5) {
                        x = musicBtn.offsetLeft + musicBtn.offsetWidth + 5;
                    }
                    if (x < musicBtn.offsetLeft + musicBtn.offsetWidth && y + height > musicBtn.offsetTop) {
                        y = musicBtn.offsetTop - height - 5;
                    }
                }
                if (y > lightBtn.offsetTop && x + width > lightBtn.offsetLeft) {
                    x = lightBtn.offsetLeft - width - 5;
                }
                if (x > lightBtn.offsetLeft && y + height > lightBtn.offsetTop) {
                    y = lightBtn.offsetTop - height - 5;
                }
                Object.assign(pageMenu.style, {
                    top: y + 'px',
                    left: x + 'px',
                    width: '14vh',
                    height: '10vh',
                    boxShadow: '0 0 5px #000000'
                });
                menuHide();
                mask.style.display = 'block';
            }
        }
    });


    window.addEventListener('resize', () => {
        pageMenuHide();
        const menu = $('.menu', -1);
        for (let i = 0; i < menu.length; i++) {
            if (!menu[i].classList.contains('hide')) {
                return;
            }
        }
        mask.style.display = 'none';
        animationCanvas.width = window.innerWidth;
        animationCanvas.height = window.innerHeight;
    });


    window.addEventListener('load', () => {
        loaded = true;
        if (clicked) {
            loadEvent();
        }
    });
}