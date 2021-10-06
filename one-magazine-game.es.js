var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Point {
  constructor(x, y = x) {
    __publicField(this, "x", 0);
    __publicField(this, "y", 0);
    this.x = x;
    this.y = y;
  }
  trans(fnx, fny = fnx) {
    return new Point(fnx(this.x), fny(this.y));
  }
  goto(next, ratio) {
    return new Point(this.x + ratio * (next.x - this.x), this.y + ratio * (next.y - this.y));
  }
  add({ x, y }) {
    return new Point(this.x + x, this.y + y);
  }
}
class State {
}
class RandomPathState extends State {
  constructor(speed = 0.5) {
    super();
    __publicField(this, "height", 2);
    __publicField(this, "width", 2);
    __publicField(this, "bottom", -1);
    __publicField(this, "top", 1);
    __publicField(this, "left", -1);
    __publicField(this, "right", 1);
    __publicField(this, "control", null);
    __publicField(this, "target", null);
    __publicField(this, "path", []);
    __publicField(this, "point", null);
    __publicField(this, "speed");
    const x = Math.random() * (this.right - this.left) + this.left;
    const y = Math.random() * (this.top - this.bottom) + this.bottom;
    this.speed = speed;
    this.control = [
      new Point(x, this.bottom),
      new Point(x, this.top),
      new Point(this.left, y),
      new Point(this.right, y)
    ][Math.floor(Math.random() * 4)];
    this.target = this.centerPoint();
  }
  centerPoint() {
    return new Point((this.left + this.width) / 2, (this.top + this.bottom) / 2);
  }
  randomPoint() {
    return new Point(this.left + Math.random() * (this.right - this.left), this.top + Math.random() * (this.bottom - this.top));
  }
  createNextPath() {
    const preTarget = this.target;
    const preControl = this.control;
    const rX = preTarget.x - preControl.x;
    const xEdge = rX > 0 ? this.right : this.left;
    const rY = preTarget.y - preControl.y;
    const yEdge = rY > 0 ? this.top : this.bottom;
    const pX = new Point(xEdge, (xEdge - preTarget.x) / rX * rY + preTarget.y);
    const pY = new Point((yEdge - preTarget.y) / rY * rX + preTarget.x, yEdge);
    const control = pX.y >= this.bottom && pX.y <= this.top ? pX : pY;
    let target = this.randomPoint();
    while (target.x ** 2 + target.y ** 2 > 1) {
      target = this.randomPoint();
    }
    this.control = control;
    this.target = target;
    this.path = this.besier2(preTarget, control, target).reverse();
  }
  besier2(d0, d1, d2) {
    const step = 100 / this.speed;
    const line = [];
    for (let current = 0; current <= step; current++) {
      const ratio = current / step;
      const p0 = d0.goto(d1, ratio);
      const p1 = d1.goto(d2, ratio);
      const target = p0.goto(p1, ratio);
      line.push(target);
    }
    return line;
  }
  next() {
    while (this.path.length === 0) {
      this.createNextPath();
    }
    const point = this.path.pop();
    if (!point)
      throw new Error("create next point error!");
    this.point = point;
    return point;
  }
}
class Display {
  constructor(option) {
    __publicField(this, "height");
    __publicField(this, "width");
    __publicField(this, "canvas", document.createElement("canvas"));
    __publicField(this, "cntr");
    __publicField(this, "ctx");
    this.height = option.height;
    this.width = option.width;
    this.cntr = option.cntr;
    this.canvas.height = this.height;
    this.canvas.width = this.width;
    console.log(this.cntr);
    this.cntr.appendChild(this.canvas);
    const ctx = this.canvas.getContext("2d");
    if (!ctx)
      throw new Error("ctx is null !!!");
    else
      this.ctx = ctx;
  }
  dot(point, color = [255, 255, 255, 0.3], size = 3) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(point.x, point.y, size, 0, Math.PI * 2, true);
    ctx.fillStyle = `rgba(${color.join(",")})`;
    ctx.fill();
  }
  img(img, p, s = new Point(1)) {
    const ctx = this.ctx;
    ctx.drawImage(img.img.get(), p.x - img.width / 2 * s.x, p.y - img.height / 2 * s.y, s.x * img.width, s.y * img.height);
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
class LoadTask {
  constructor() {
    __publicField(this, "val", "unfinish");
    __publicField(this, "onload", new Promise(() => {
    }));
  }
  get() {
    if (this.val === "unfinish")
      throw new Error("Resource is unfinished!");
    else
      return this.val;
  }
}
__publicField(LoadTask, "unfinish", "unfinish!");
class Resource {
}
class ImgLoadTask extends LoadTask {
  constructor(src) {
    super();
    __publicField(this, "height", 0);
    __publicField(this, "width", 0);
    const img = new Image();
    let resolve = (_) => {
    };
    let reject = (_) => {
    };
    this.onload = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.onload.then((img2) => {
      this.val = img2;
      this.height = img2.height;
      this.width = img2.width;
    });
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
  }
}
class ResImg extends Resource {
  constructor(img) {
    super();
    __publicField(this, "img");
    __publicField(this, "height", 0);
    __publicField(this, "width", 0);
    __publicField(this, "onload");
    this.img = img;
    this.img.onload.then(() => {
      this.height = img.height;
      this.width = img.width;
    });
    this.onload = this.img.onload;
  }
  draw(screen, p, scaleX = 1, scaleY = scaleX) {
    screen.ctx.drawImage(this.img.get(), p.x - this.width / 2 * scaleX, p.y - this.height / 2 * scaleY, scaleX, scaleY);
  }
}
const images = {
  target: new ResImg(new ImgLoadTask("/img/target.png")),
  backSight: new ResImg(new ImgLoadTask("/img/back.png")),
  frontSight: new ResImg(new ImgLoadTask("/img/front.png"))
};
class TouchMoveState extends State {
  constructor() {
    super();
    __publicField(this, "startMoveEvent", null);
    __publicField(this, "currentMoveEvent", null);
    __publicField(this, "cachePoint", new Point(0, 0));
    const app = document.querySelector("#app");
    if (!app || !(app instanceof HTMLElement))
      throw new Error();
    this.startMoveEvent = null;
    this.currentMoveEvent = null;
    app.addEventListener("touchstart", (e) => this.start(e));
    app.addEventListener("touchmove", (e) => this.move(e));
    app.addEventListener("touchend", (e) => this.over(e));
    app.addEventListener("touchcancel", (e) => this.over(e));
  }
  start(e) {
    e.preventDefault();
  }
  move(e) {
    e.preventDefault();
    if (!this.startMoveEvent)
      this.startMoveEvent = e;
    this.currentMoveEvent = e;
  }
  over(_) {
    if (this.currentMoveEvent && this.startMoveEvent) {
      const current = new Point(this.currentMoveEvent.touches[0].clientX - this.startMoveEvent.touches[0].clientX, this.currentMoveEvent.touches[0].clientY - this.startMoveEvent.touches[0].clientY);
      this.cachePoint = this.cachePoint.add(current);
    }
    this.startMoveEvent = null;
  }
  getPoint() {
    if (this.currentMoveEvent && this.startMoveEvent) {
      const current = new Point(this.currentMoveEvent.touches[0].clientX - this.startMoveEvent.touches[0].clientX, this.currentMoveEvent.touches[0].clientY - this.startMoveEvent.touches[0].clientY);
      return current.add(this.cachePoint);
    } else
      return this.cachePoint;
  }
}
class TouchLink {
  constructor(start, end, above) {
    __publicField(this, "above");
    __publicField(this, "start");
    __publicField(this, "end");
    __publicField(this, "up");
    this.start = start;
    this.end = end;
    this.above = above ? above.num(this.start) : 0;
    this.up = TouchLink.up(this.start, this.end, this.above);
  }
  static up(start, end, above) {
    const up = (end - start) * 8e-4 + above;
    return up >= 1 ? 1 : up;
  }
  static down(cur, end) {
    return (cur - end) * 1e-3;
  }
  num(t = new Date().getTime()) {
    const up = this.up;
    const down = TouchLink.down(t, this.end);
    const res = up - down;
    return res > 0 ? res : 0;
  }
}
class TouchTimeState extends State {
  constructor() {
    super();
    __publicField(this, "currentTouchTime", 0);
    __publicField(this, "touchsRecords");
    const app = document.querySelector("#app");
    if (!app || !(app instanceof HTMLElement))
      throw new Error();
    app.addEventListener("touchstart", (e) => this.onstart(e));
    app.addEventListener("touchmove", (e) => this.onmove(e));
    app.addEventListener("touchend", (e) => this.onover(e));
    app.addEventListener("touchcancel", (e) => this.onover(e));
  }
  onstart(e) {
    e.preventDefault();
    this.currentTouchTime = new Date().getTime();
  }
  onmove(e) {
    e.preventDefault();
  }
  onover(_) {
    if (this.currentTouchTime) {
      this.touchsRecords = new TouchLink(this.currentTouchTime, new Date().getTime(), this.touchsRecords);
    }
    this.currentTouchTime = 0;
  }
  value() {
    const t = new Date().getTime();
    if (this.currentTouchTime) {
      const above = this.touchsRecords ? this.touchsRecords.num(this.currentTouchTime) : 0;
      return TouchLink.up(this.currentTouchTime, t, above);
    } else {
      const above = this.touchsRecords ? this.touchsRecords.num(t) : 0;
      return above;
    }
  }
  num() {
    const n = this.value();
    const t = n < 0.5 ? 0 : n - 0.5;
    const f = n < 0.5 ? n : 0.5;
    const trigger = (t * 2) ** 3;
    const focus = (f * 2) ** 3;
    return { trigger, focus };
  }
}
class View {
  constructor(screen) {
    __publicField(this, "height", 2);
    __publicField(this, "width", 2);
    __publicField(this, "bottom", 1);
    __publicField(this, "top", -1);
    __publicField(this, "left", -1);
    __publicField(this, "right", 1);
    __publicField(this, "centerPoint", new Point((this.left + this.width) / 2, (this.top + this.bottom) / 2));
    __publicField(this, "screen");
    this.screen = screen;
  }
  randomPoint() {
    return new Point(this.left + Math.random() * (this.right - this.left), this.top + Math.random() * (this.bottom - this.top));
  }
  updateWidth() {
    this.width = this.right - this.left;
  }
  updateHeight() {
    this.height = this.bottom - this.top;
  }
  setCenter(point) {
    this.centerPoint = point;
  }
}
class StatusBarView extends View {
  constructor(screen) {
    super(screen);
    const option = this.screen;
    this.left = 30;
    this.right = option.width - 30;
    this.updateWidth();
    this.top = 30;
    this.bottom = 40;
    this.updateHeight();
  }
  draw(len) {
    this.drawBG();
    this.drawBar(len);
    this.drawRound();
  }
  drawRound() {
    const { screen } = this;
    screen.ctx.lineJoin = "round";
    screen.ctx.lineWidth = 2;
    screen.ctx.strokeRect(this.left, this.top, this.width, this.height);
  }
  drawBG() {
    const { screen } = this;
    screen.ctx.fillStyle = "rgba(10, 160, 252, 0.2)";
    screen.ctx.fillRect(this.left, this.top, this.width * 0.6, this.height);
    screen.ctx.fillStyle = "rgba(240, 62, 77, 0.2)";
    screen.ctx.fillRect(this.left + this.width * 0.6, this.top, this.width * 0.4, this.height);
  }
  drawBar({ focus, trigger }) {
    const { screen } = this;
    screen.ctx.fillStyle = "rgba(10, 160, 252, 1)";
    screen.ctx.fillRect(this.left, this.top, this.width * 0.6 * focus, this.height);
    screen.ctx.fillStyle = "rgba(240, 62, 77, 1)";
    screen.ctx.fillRect(this.left + this.width * 0.6, this.top, this.width * 0.4 * trigger, this.height);
  }
}
class SightView extends View {
  constructor(screen) {
    super(screen);
    this.left = 0;
    this.right = 400;
    this.updateWidth();
    this.top = 0;
    this.bottom = 800;
    this.updateHeight();
    this.setCenter(new Point(200, 400));
  }
  draw(point, num) {
    this.screen.ctx.drawImage(this.img.img.get(), ...this.scale(num, this.down(num, point)));
  }
  scale(num, p) {
    const n = num;
    const s = (1 + n) / 3;
    const width = this.width * s;
    const height = this.height * s;
    const left = p.x - width / 2;
    const top = p.y - height / 2;
    return [left, top, width, height];
  }
  down(num, p) {
    const n = num;
    return p.trans((x) => x, (y) => y + 200 * (1 - n));
  }
}
class FrontSightView extends SightView {
  constructor() {
    super(...arguments);
    __publicField(this, "img", images.frontSight);
  }
}
class BackSightView extends SightView {
  constructor() {
    super(...arguments);
    __publicField(this, "img", images.backSight);
  }
}
class Game {
  constructor(option) {
    __publicField(this, "option");
    __publicField(this, "screen", null);
    __publicField(this, "targetPosition", new RandomPathState());
    __publicField(this, "sightPosition", new RandomPathState());
    __publicField(this, "frontPosition", new RandomPathState());
    __publicField(this, "cameraPosition", new TouchMoveState());
    __publicField(this, "touchTime", new TouchTimeState());
    __publicField(this, "isRun", false);
    __publicField(this, "statusBar", null);
    __publicField(this, "backSightView", null);
    __publicField(this, "frontSightView", null);
    this.option = option;
    this.initScreen();
    this.statusBar = new StatusBarView(this.screen);
    this.backSightView = new BackSightView(this.screen);
    this.frontSightView = new FrontSightView(this.screen);
    this.start();
  }
  initScreen() {
    this.screen = new Display(this.option);
  }
  draw() {
    if (!this.isRun)
      return;
    this.screen.clear();
    const target = this.targetPosition.next().trans((x) => x * this.option.width / 2 / 10 + this.option.width / 2, (y) => y * this.option.height / 2 / 10 + this.option.height / 2);
    const touch = this.cameraPosition.getPoint();
    this.screen.img(images.target, target.add(touch), new Point(0.5));
    const back = this.sightPosition.next().trans((x) => x * this.option.width / 2 / 100 * 4 + this.option.width / 2, (x) => x * this.option.height / 2 / 100 * 4 + this.option.height / 2);
    const front = back.add(this.frontPosition.next().trans((x) => x * this.option.width / 2 * 2 / 100, (y) => y * this.option.height / 2 * 2 / 100));
    const { focus, trigger } = this.touchTime.num();
    this.screen.dot(front, [0, 255, 0, 1], 4);
    this.frontSightView.draw(front, focus);
    this.backSightView.draw(back, focus);
    this.statusBar.draw({ focus, trigger });
    requestAnimationFrame(() => this.draw());
  }
  async start() {
    await Promise.all(Array.from(Object.values(images)).map((v) => v.onload));
    this.isRun = true;
    this.draw();
  }
  stop() {
    this.isRun = false;
  }
}
const _App = class {
  constructor() {
    __publicField(this, "device", {
      mode: "pc",
      width: 360,
      height: 640
    });
    __publicField(this, "game", null);
    __publicField(this, "element", null);
    if (_App.main)
      return _App.main;
    this.initDeviceInfo();
    this.initElement();
    this.initGame();
  }
  initDeviceInfo() {
    const { width, height } = document.body.getClientRects()[0];
    const mode = height > width && width > 320 ? "mobile" : "pc";
    console.log(mode);
    this.device = { width, mode, height };
  }
  initGame() {
    const { width, height } = this.device.mode === "mobile" ? this.device : { width: 360, height: 640 };
    const cntr = this.element;
    this.game = new Game({ width, height, cntr });
  }
  initElement() {
    this.element = document.createElement("div");
    this.element.id = "app";
    this.element.dataset.mode = this.device.mode;
    document.body.appendChild(this.element);
  }
  onLog(fn) {
    fn("game init!");
  }
};
let App = _App;
__publicField(App, "main", new _App());
App.main.onLog((msg) => console.log(msg));
