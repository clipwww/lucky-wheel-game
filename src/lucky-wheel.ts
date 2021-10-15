import './lucky-wheel.scss';

export enum EventEnum {
  SpinnerLoaded,
  RotationStart,
  RotationEnd,
}

export const createSpinner = () => {
  const RAD = 180 / Math.PI; // 弧度

  let $spinner: HTMLElement;
  let $dot: HTMLElement;
  let pieceLength: number;

  const eventRegistry: {
    [key: string]: Function[],
  } = {};

  let colors: string[] = ['#555', '#ddd', '#777', '#bbb', '#999']
  let isDisabled: boolean = false;
  let isRotate: boolean = false;
  let currentTarget: number = 0;
  let spinnerCenter: { x: number, y: number } = {
    x: 0,
    y: 0,
  }
  let currentAngle = 0;

  const init = (length = 8) => {
    pieceLength = length;
    // 初始化
    initSpinner();
    unbindEvent();
    bindEvent();
  }

  const bindEvent = (): void => {
    $spinner.addEventListener('transitionend', rotationEnd);
    $spinner.addEventListener('webkitTransitionEnd', rotationEnd);
    $spinner.addEventListener('oTransitionEnd', rotationEnd);
    window.addEventListener('resize', getSpinnerCenter);
  }

  const unbindEvent = (): void => {
    $spinner.removeEventListener('transitionend', rotationEnd);
    $spinner.removeEventListener('webkitTransitionEnd', rotationEnd);
    $spinner.removeEventListener('oTransitionEnd', rotationEnd);
    window.removeEventListener('resize', getSpinnerCenter);
  }

  const initSpinner = async (): Promise<void> => {
    $spinner = document.getElementById('js-spinner');


    const halfHeight = $spinner.clientHeight / 2;
    const degrees = 360 / pieceLength;
    const is180 = degrees === 180;
    let bottomWidth = is180 ? halfHeight : (Math.tan((degrees / 2) * Math.PI / 180) * halfHeight);

    $spinner.innerHTML = `
      ${Array(pieceLength).fill('').map((_, i) => {

      const color = colors[i % colors.length];
      const borderColor = is180 ? `${color} ${color} ${color};` : `${color} transparent transparent;`

      return `<div class="spinner__piece" data-target="${i + 1}">
          <div class="content" style="
            transform: rotate(${i * (degrees)}deg); 
            border-width: ${halfHeight}px ${bottomWidth}px 0; 
            border-color: ${borderColor}">
            <span>${i + 1}</span>
          </div>
        </div>`
    }).join('')}
      <div id="js-dot" class="spinner__dot"></div>
    `


    $dot = document.getElementById('js-dot');

    dispatchEvent(EventEnum.SpinnerLoaded);

    getSpinnerCenter();
    checkDotPosition(); // 亮起指針指向的獎勵
  }

  const getSpinnerCenter = () => {
    const { left, top } = $spinner.getBoundingClientRect()
    const width = $spinner.clientWidth;
    const height = width;
    spinnerCenter = {
      // 取得轉盤中心位置
      x: left + (width / 2),
      y: top + (height / 2),
    }
  }

  const setRotate = (bool: boolean) => {
    isRotate = bool;
  }


  const setDisabled = (bool: boolean) => {
    isDisabled = bool;
  }

  const setTransform = ($el: HTMLElement, value: string): void => {
    $el.style['OTransform'] = value;
    $el.style['MozTransform'] = value;
    $el.style['msTransform'] = value;
    $el.style.webkitTransform = value;
    $el.style.transform = value;
  }

  const setTransitionDuration = ($el: HTMLElement, value: string): void => {
    $el.style['OTransitionDuration'] = value;
    $el.style['MozTransitionDuration'] = value;
    $el.style['msTransitionDuration'] = value;
    $el.style.webkitTransitionDuration = value;
    $el.style.transitionDuration = value;
  }


  const checkDotPosition = () => {
    const { left: spinnerX, top: spinnerY } = $dot.getBoundingClientRect();
    const x = spinnerX - spinnerCenter.x;
    const y = spinnerY - spinnerCenter.y;
    let angle = (RAD * Math.atan2(y, x)) - 135;
    angle = angle >= 0 ? angle : angle + 360;

    if (isRotate) {
      // window.requestAnimationFrame(checkDotPosition);
      setTimeout(checkDotPosition, 1);
    }
    // console.log(angle)
  }

  const rotation = (target: number): void => {
    if (isRotate || isDisabled) {
      return;
    }
    setRotate(true);

    currentTarget = target;
    const degrees = 360 / pieceLength;
    let end = 360 + -(target * degrees - (degrees / 2));
    let start = end + degrees;

    const pieceAngle = Math.abs(end - start);

    // console.log(start, end, pieceAngle, target)

    start = Math.abs(start);
    end = Math.abs(end);

    let endAngleRandom = getRandom(
      Math.min(start, end) + (pieceAngle / 3),
      Math.max(start, end) - (pieceAngle / 3),
    );
    // console.log(endAngleRandom);


    checkDotPosition();
    // currentAngle不等於0代表已經轉過一次
    // 將上次轉的位置補至一圈後再加上這次要轉的角度
    const duration = getRandom(3, 6);
    currentAngle = currentAngle + (currentAngle !== 0 ? 360 - (currentAngle % 360) : 0) + endAngleRandom + (360 * duration);
    setTransitionDuration($spinner, `${duration}s`);
    setTransform($spinner, `rotate(${currentAngle}deg)`);
    dispatchEvent(EventEnum.RotationStart);
  }

  const rotationEnd = () => {
    // 轉動transition結束
    setRotate(false);
    dispatchEvent(EventEnum.RotationEnd, currentTarget);
  }

  const getRandom = (minNum: number, maxNum: number): number => {
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  }

  const addEventListener = (type: string | number, handler: Function): void => {
    // 註冊監聽事件
    type = `${type}`.toLowerCase();

    if (!eventRegistry.hasOwnProperty(type)) {
      eventRegistry[type] = [];
    }

    if (eventRegistry[type].indexOf(handler) == -1) {
      eventRegistry[type].push(handler);
    }
  }

  const removeEventListener = (type: string | number, handler: Function): void => {
    // 刪除監聽事件
    type = `${type}`.toLowerCase();

    if (!eventRegistry.hasOwnProperty(type)) {
      eventRegistry[type] = [];
    }

    const findIndex = eventRegistry[type].indexOf(handler);
    if (findIndex < 0) {
      eventRegistry[type].splice(findIndex, 1);
    }
  };

  const dispatchEvent = (type: string | number, ...arg: any): void => {
    // 觸發事件
    type = `${type}`.toLowerCase();

    if (!eventRegistry.hasOwnProperty(type)) {
      return;
    }

    const len = eventRegistry[type].length;

    for (let i = 0; i < len; i++) {
      eventRegistry[type][i].call(this, ...arg);
    }
  }


  return {
    init,
    rotation,
    setTransform,
    setDisabled,
    getRandom,
    addEventListener,
    removeEventListener
  }
}
