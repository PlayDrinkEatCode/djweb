{
    let light = 'dark';
    let otherLight = 'blue';
    let clicked = false;
    let loaded = false;
    let x;
    let endX;
    let indexText;
    const page = {
        colorStyle: 'colorStyle'
    };
    let pageNow = 0;
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


    const pageShow = (text, pageIndex) => {
        if (pageIndex == pageNow) {
            container.innerHTML = '';
            text = text.split('\r\n');
            for (const i in text) {
                setElement(text[i]);
            }
        }
    };


    const setPage = (name) => {
        container.innerHTML = '';
        container.style.display = 'block';
        ajax.get('txt/page/' + page[name] + '.txt', pageShow, pageNow);
    };


    const setHeader = (text) => {
        text = text.split('\r\n');
        for (const i in text) {
            const name = text[i].split('-')[0];
            const path = text[i].split('-')[1];
            const nav = document.createElement('nav');
            nav.innerHTML = name;
            nav.addEventListener('click', () => {
                if (+i != pageNow) {
                    if (pageNow >= 0) {
                        $('nav', pageNow).classList.remove('now');
                    }
                    nav.classList.add('now');
                    homeText.style.display = 'none';
                    pageNow = +i;
                    setPage(name);
                }
            });
            header.appendChild(nav);
            page[name] = path;
        }
    };


    const loadingAnimation = () => {
        const text = '网页正在加载...';
        const nowText = loadingText.innerHTML;
        setTimeout(() => {
            if (nowText != text) {
                loadingText.innerHTML = nowText + text[nowText.length];
            } else {
                loadingText.innerHTML = '';
            }
            loadingAnimation();
        }, 200);
    };


    const headerShow = () => {
        header.style.height = '10%';
        Object.assign(main.style, {
            top: '17.5%',
            height: '75%'
        });
        const timer = setInterval(() => {
            const need = parseInt(window.innerHeight * 0.1);
            const now = parseInt(header.offsetHeight);
            if (now >= need) {
                header.classList.add('show');
                if (pageNow >= 0) {
                    $('nav', pageNow).classList.add('now');
                }
                homeText.style.opacity = 0;
                let homeTextTimer = setInterval(() => {
                    if (getComputedStyle(homeText).opacity == 0) {
                        if (getComputedStyle(homeText).display != 'none') {
                            homeText.style.display = 'none';
                            container.style.display =' block';
                            setPage($('nav', pageNow).innerHTML);
                        }
                        clearInterval(homeTextTimer);
                    }
                }, 10);
                clearInterval(timer);
            }
        }, 10);
    };


    const musicBtnShow = () => {
        musicBtn.onclick = () => {};
        Object.assign(musicBtn.style, {
            cursor: 'pointer',
            opacity: 1
        });
        $('.menu').style.display = 'block';
        const timer = setInterval(() => {
            if (getComputedStyle(musicBtn).opacity == 1) {
                musicBtn.addEventListener('click', () => {
                    if (music.paused) {
                        music.play();
                    } else {
                        music.pause();
                    }
                });
                musicBtn.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    menuShow(0);
                });
                music.play();
                clearInterval(timer);
            }
        }, 10);
    };


    const homeTextAnimation = () => {
        const text = setElement(indexText, true).toUpperCase();
        const nowText = homeText.innerHTML;
        if (nowText != text) {
            setTimeout(() => {
                homeText.innerHTML = nowText + text[nowText.length];
                homeTextAnimation(text);
            }, 100);
        } else {
            headerShow();
            musicBtnShow();
        }
    };


    const loadEvent = () => {
        if (loaded) {
            setTimeout(() => {
                loading.style.opacity = 0;
                const timer = setInterval(() => {
                    if (getComputedStyle(loading).opacity == 0) {
                        loading.style.display = 'none';
                        homeTextAnimation();
                        clearInterval(timer);
                    }
                }, 10);
            }, 2000);
        }
    };


    const setLight = (needLight) => {
        document.body.classList.remove(light);
        light = needLight;
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
        document.body.classList.add(light);
        setCookie('light', light);
    };

    
    const showSetLightPage = () => {
        if (pageNow != -2) {
            if (homeText.innerHTML == setElement(indexText, true).toUpperCase()) {
                homeText.style.display = 'none';
            }
            if (getComputedStyle(homeText).display == 'none') {
                if (pageNow >= 0) {
                    $('nav', pageNow).classList.remove('now');
                }
                pageNow = -2;
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
                    showSetLightPage();
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
        linkMenuHide();
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


    const linkMenuHide = () => {
        Object.assign($('#linkMenu').style, {
            width: '',
            height: '',
            boxShadow: ''
        });
        const timer = setInterval(() => {
            if (getComputedStyle($('#linkMenu')).width.replace('px', '') == 0) {
                Object.assign($('#linkMenu').style, {
                    top: '',
                    left: ''
                });
                clearInterval(timer);
            }
        }, 10);
    };


    {
        drawTaiChiDiagram();
        setBtnFunction();
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
                const timer = setInterval(() => {
                    if (getComputedStyle(loadingText).opacity == 0) {
                        taiChiDiagram.style.animation = 'taiChiDiagramRotate linear 2s infinite';
                        Object.assign(loadingText.style, {
                            transition: '',
                            opacity: 1
                        });
                        loadingText.innerHTML = '';
                        loadingAnimation();
                        loadEvent();
                        clearInterval(timer);
                    }
                }, 10);
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
        linkMenuHide();
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


    lightBtn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        menuShow(1);
    });


    mask.addEventListener('click', () => {
        menuHide();
        linkMenuHide();
        mask.style.display = 'none';
    });


    window.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if ((e.target != musicBtn || getComputedStyle(musicBtn).opacity == 0) && e.target != lightBtn && !e.target.classList.contains('btn')) {
            const linkMenu = $('#linkMenu');
            let x;
            let y;
            if (e.clientX < 5) {
                x = 5;
            } else if (e.clientX + window.innerHeight * 0.14 < window.innerWidth - 5) {
                x = e.clientX;
            } else {
                x = e.clientX - window.innerHeight * 0.14 - 5;
            }
            if (e.clientY < 5) {
                y = 5;
            } else if (e.clientY + window.innerHeight * 0.05 < window.innerHeight - 5) {
                y = e.clientY;
            } else {
                y = e.clientY - window.innerHeight * 0.05 - 5;
            }
            if (getComputedStyle(musicBtn).opacity != 0) {
                if (e.clientY > musicBtn.offsetTop && e.clientX < musicBtn.offsetLeft + musicBtn.offsetWidth + 5) {
                    x = musicBtn.offsetLeft + musicBtn.offsetWidth + 5;
                }
                if (e.clientX < musicBtn.offsetLeft + musicBtn.offsetWidth && e.clientY + window.innerHeight * 0.05 > musicBtn.offsetTop) {
                    y = musicBtn.offsetTop - window.innerHeight * 0.05 - 5;
                }
            }
            if (e.clientY > lightBtn.offsetTop && e.clientX + window.innerHeight * 0.14 > lightBtn.offsetLeft) {
                x = lightBtn.offsetLeft - window.innerHeight * 0.14 - 5;
            }
            if (e.clientX > lightBtn.offsetLeft && e.clientY + window.innerHeight * 0.05 > lightBtn.offsetTop) {
                y = lightBtn.offsetTop - window.innerHeight * 0.05 - 5;
            }
            Object.assign(linkMenu.style, {
                top: y + 'px',
                left: x + 'px',
                width: '14vh',
                height: '5vh',
                boxShadow: '0 0 5px #000000'
            });
            menuHide();
            mask.style.display = 'block';
        }
    });


    window.addEventListener('resize', () => {
        linkMenuHide();
        const menu = $('.menu', -1);
        for (let i = 0; i < menu.length; i++) {
            if (!menu[i].classList.contains('hide')) {
                return;
            }
        }
        mask.style.display = 'none';
    });


    window.addEventListener('mousedown', (e) => {
        x = e.clientX;
    });


    window.addEventListener('mouseup', (e) => {
        if (x - e.clientX > window.innerWidth * 0.2) {
            showSetLightPage();
        }
    });


    window.addEventListener('touchstart', (e) => {
        x = e.touches[0].clientX;
    });


    window.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });
    

    window.addEventListener('touchend', () => {
        if (endX && x - endX > window.innerWidth * 0.2) {
            showSetLightPage();
        }
        endX = null;
    });


    window.addEventListener('load', () => {
        loaded = true;
        if (clicked) {
            loadEvent();
        }
    });


    // 双击全屏功能
    bindFullscreen($('html'));
}