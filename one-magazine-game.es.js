var t=Object.defineProperty,i=(i,e,s)=>(((i,e,s)=>{e in i?t(i,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):i[e]=s})(i,"symbol"!=typeof e?e+"":e,s),s);class e{constructor(t,e=t){i(this,"x",0),i(this,"y",0),this.x=t,this.y=e}trans(t,i=t){return new e(t(this.x),i(this.y))}goto(t,i){return new e(this.x+i*(t.x-this.x),this.y+i*(t.y-this.y))}add({x:t,y:i}){return new e(this.x+t,this.y+i)}}class s{constructor(){i(this,"height",2),i(this,"width",2),i(this,"bottom",-1),i(this,"top",1),i(this,"left",-1),i(this,"right",1)}centerPoint(){return new e((this.left+this.width)/2,(this.top+this.bottom)/2)}randomPoint(){return new e(this.left+Math.random()*(this.right-this.left),this.top+Math.random()*(this.bottom-this.top))}}class h extends s{constructor(t=.5){super(),i(this,"control",null),i(this,"target",null),i(this,"path",[]),i(this,"point",null),i(this,"speed");const s=Math.random()*(this.right-this.left)+this.left,h=Math.random()*(this.top-this.bottom)+this.bottom;this.speed=t,this.control=[new e(s,this.bottom),new e(s,this.top),new e(this.left,h),new e(this.right,h)][Math.floor(4*Math.random())],this.target=this.centerPoint()}createNextPath(){const t=this.target,i=this.control,s=t.x-i.x,h=s>0?this.right:this.left,n=t.y-i.y,o=n>0?this.top:this.bottom,r=new e(h,(h-t.x)/s*n+t.y),c=new e((o-t.y)/n*s+t.x,o),a=r.y>=this.bottom&&r.y<=this.top?r:c;let l=this.randomPoint();for(;l.x**2+l.y**2>1;)l=this.randomPoint();this.control=a,this.target=l,this.path=this.besier2(t,a,l).reverse()}besier2(t,i,e){const s=100/this.speed,h=[];for(let n=0;n<=s;n++){const o=n/s,r=t.goto(i,o),c=i.goto(e,o),a=r.goto(c,o);h.push(a)}return h}next(){for(;0===this.path.length;)this.createNextPath();const t=this.path.pop();if(!t)throw new Error("create next point error!");return this.point=t,t}}class n{constructor(t){i(this,"height"),i(this,"width"),i(this,"canvas",document.createElement("canvas")),i(this,"cntr"),i(this,"ctx"),this.height=t.height,this.width=t.width,this.cntr=t.cntr,this.canvas.height=this.height,this.canvas.width=this.width,console.log(this.cntr),this.cntr.appendChild(this.canvas);const e=this.canvas.getContext("2d");if(!e)throw new Error("ctx is null !!!");this.ctx=e}dot(t,i=[255,255,255,.3],e=3){const s=this.ctx;s.beginPath(),s.arc(t.x,t.y,e,0,2*Math.PI,!0),s.fillStyle=`rgba(${i.join(",")})`,s.fill()}img(t,i,s=new e(1)){this.ctx.drawImage(t.img.get(),i.x-t.width/2*s.x,i.y-t.height/2*s.y,s.x*t.width,s.y*t.height)}clear(){this.ctx.clearRect(0,0,this.width,this.height)}}class o{constructor(){i(this,"val","unfinish"),i(this,"onload",new Promise((()=>{})))}get(){if("unfinish"===this.val)throw new Error("Resource is unfinished!");return this.val}}i(o,"unfinish","unfinish!");const r=class extends class{}{constructor(t){super(),i(this,"img"),i(this,"height",0),i(this,"width",0),i(this,"onload"),this.img=t,this.img.onload.then((()=>{this.height=t.height,this.width=t.width})),this.onload=this.img.onload}draw(t,i,e=1,s=e){t.ctx.drawImage(this.img.get(),i.x-this.width/2*e,i.y-this.height/2*s,e,s)}};let c=r;i(c,"files",{target:new r(new class extends o{constructor(t){super(),i(this,"height",0),i(this,"width",0);const e=new Image;let s=t=>{},h=t=>{};this.onload=new Promise(((t,i)=>{s=t,h=i})),this.onload.then((t=>{this.val=t,this.height=t.height,this.width=t.width})),e.src=t,e.onload=()=>{s(e)},e.onerror=t=>{h(t)}}}("/img/target.png"))});class a extends s{constructor(){super(),i(this,"startMoveEvent",null),i(this,"currentMoveEvent",null),i(this,"cachePoint",new e(0,0));const t=document.querySelector("#app");if(!(t&&t instanceof HTMLElement))throw new Error;this.startMoveEvent=null,this.currentMoveEvent=null,t.addEventListener("touchstart",(t=>this.start(t))),t.addEventListener("touchmove",(t=>this.move(t))),t.addEventListener("touchend",(t=>this.over(t))),t.addEventListener("touchcancel",(t=>this.over(t)))}start(t){t.preventDefault()}move(t){t.preventDefault(),this.startMoveEvent||(this.startMoveEvent=t),this.currentMoveEvent=t}over(t){if(this.currentMoveEvent&&this.startMoveEvent){const t=new e(this.currentMoveEvent.touches[0].clientX-this.startMoveEvent.touches[0].clientX,this.currentMoveEvent.touches[0].clientY-this.startMoveEvent.touches[0].clientY);this.cachePoint=this.cachePoint.add(t)}this.startMoveEvent=null}getPoint(){if(this.currentMoveEvent&&this.startMoveEvent){const t=new e(this.currentMoveEvent.touches[0].clientX-this.startMoveEvent.touches[0].clientX,this.currentMoveEvent.touches[0].clientY-this.startMoveEvent.touches[0].clientY);return console.log(t),t.add(this.cachePoint)}return this.cachePoint}}class l{constructor(t){i(this,"option"),i(this,"screen",null),i(this,"targetPosition",new h),i(this,"sightPosition",new h),i(this,"frontPosition",new h),i(this,"touchPosition",new a),i(this,"isRun",!1),this.option=t,this.initScreen(),this.start()}initScreen(){this.screen=new n(this.option)}draw(){if(!this.isRun)return;this.screen.clear();const t=this.targetPosition.next().trans((t=>t*this.option.width/2/10+this.option.width/2),(t=>t*this.option.height/2/10+this.option.height/2)),i=this.touchPosition.getPoint();this.screen.img(c.files.target,t.add(i),new e(.5));const s=this.sightPosition.next().trans((t=>t*this.option.width/2/100+this.option.width/2),(t=>t*this.option.height/2/100+this.option.height/2)),h=s.add(this.frontPosition.next().trans((t=>t*this.option.width/2/100),(t=>t*this.option.height/2/100)));this.screen.dot(h,[0,255,0,1],4),this.screen.dot(s,[255,0,0,.7],4),requestAnimationFrame((()=>this.draw()))}async start(){await Promise.all(Array.from(Object.values(c.files)).map((t=>t.onload))),this.isRun=!0,this.draw()}stop(){this.isRun=!1}}const d=class{constructor(){if(i(this,"device",{mode:"pc",width:360,height:640}),i(this,"game",null),i(this,"element",null),d.main)return d.main;this.initDeviceInfo(),this.initElement(),this.initGame()}initDeviceInfo(){const{width:t,height:i}=document.body.getClientRects()[0],e=i>t&&t>320?"mobile":"pc";console.log(e),this.device={width:t,mode:e,height:i}}initGame(){const{width:t,height:i}="mobile"===this.device.mode?this.device:{width:360,height:640},e=this.element;this.game=new l({width:t,height:i,cntr:e})}initElement(){this.element=document.createElement("div"),this.element.id="app",this.element.dataset.mode=this.device.mode,document.body.appendChild(this.element)}onLog(t){t("game init!")}};let u=d;i(u,"main",new d),u.main.onLog((t=>console.log(t)));