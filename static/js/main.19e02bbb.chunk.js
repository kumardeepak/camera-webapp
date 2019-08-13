(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{105:function(e,t){},107:function(e,t){},140:function(e,t){},141:function(e,t){},191:function(e,t,a){"use strict";a.r(t);var n=a(4),r=a.n(n),s=a(88),o=a.n(s),i=(a(95),a(30)),c=a(31),u=a(34),l=a(32),p=a(35),d=(a(96),a(10)),g=a.n(d),m=a(15),h=a(89),f=a.n(h),b=a(18);function v(){return w.apply(this,arguments)}function w(){return(w=Object(m.a)(g.a.mark(function e(){var t;return g.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t="/camera-webapp/models",e.next=3,b.e(t);case 3:return e.next=5,b.d(t);case 5:case"end":return e.stop()}},e)}))).apply(this,arguments)}function x(e){return y.apply(this,arguments)}function y(){return(y=Object(m.a)(g.a.mark(function e(t){var a,n,r,s,o,i=arguments;return g.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=i.length>1&&void 0!==i[1]?i[1]:512,.7,n=new b.a({inputSize:a,scoreThreshold:.7}),r=!0,e.next=6,b.c(t);case 6:return s=e.sent,e.next=9,b.b(s,n).withFaceLandmarks(r);case 9:return o=e.sent,e.abrupt("return",o);case 11:case"end":return e.stop()}},e)}))).apply(this,arguments)}var M=a(188),C=600,I=600,k=160,E=35e3,j=60,F=6,O="please bring your face near to camera",S="please come near to camera, looks like you are bit from the camera",W="your full face is not getting captured, please align",D="please enable camera flash or move to a brighter place",A="we have captured the relevant images",X=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(u.a)(this,Object(l.a)(t).call(this,e))).componentWillMount=Object(m.a)(g.a.mark(function e(){return g.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,v();case 2:a.setInputDevice();case 3:case"end":return e.stop()}},e)})),a.setInputDevice=function(){navigator.mediaDevices.enumerateDevices().then(function(){var e=Object(m.a)(g.a.mark(function e(t){return g.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.setState({facingMode:"user"});case 2:a.startCapture();case 3:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}())},a.startCapture=function(){a.interval=setInterval(function(){a.capture()},1500)},a.capture=Object(m.a)(g.a.mark(function e(){return g.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!a.webcam.current){e.next=3;break}return e.next=3,x(a.webcam.current.getScreenshot(),k).then(function(e){e&&(a.processCapturePostProcessing(e.map(function(e){return e.detection}))&&(a.saveCapturedImages(a.webcam.current.getScreenshot()),window.getCapturedImage&&"[object Function]"==={}.toString.call(window.getCapturedImage)&&window.getCapturedImage(a.webcam.current.getScreenshot())),a.setState({detections:e.map(function(e){return e.detection})}))});case 3:case"end":return e.stop()}},e)})),a.saveCapturedImages=function(e){var t=a.state,n=t.capturedImages,r=t.capturedCount;n.length<F&&(n.push(e),r+=1,a.setState({capturedImages:n,capturedCount:r,displayMessage:A}))},a.renderImageURL=function(){return a.state.capturedCount>=F?r.a.createElement("div",null,a.state.capturedImages.map(function(e){return r.a.createElement("a",{key:M(),download:"".concat(M(),".jpeg"),href:e}," Download ")})):r.a.createElement("div",null)},a.processImageBrightness=function(){for(var e=a.webcam.current.getCanvas(),t=e.getContext("2d").getImageData(0,0,e.width,e.height).data,n=0,r=0,s=0,o=0,i=0,c=t.length;i<c;i+=4)n=t[i],r=t[i+1],s=t[i+2],o+=Math.floor((n+r+s)/3);return Math.floor(o/(e.width*e.height))},a.processCapturePostProcessing=function(e){if(!e||e&&0===e.length)return a.setState({displayMessage:O}),!1;var t=e.map(function(e,t){return{H:e.box.height+50,W:e.box.width,X:e.box._x,Y:e.box._y-80,A:e.box.area}});if(parseFloat(t[0].Y)<0||parseFloat(t[0].X)<0||parseFloat(t[0].X)+parseFloat(t[0].W)>C-50||parseFloat(t[0].Y)+parseFloat(t[0].H)>I-50)return a.setState({displayMessage:W}),!1;if(parseFloat(t[0].A)<E)return a.setState({displayMessage:S}),!1;var n=a.processImageBrightness();return a.setState({brightness:n}),n>j||(a.setState({displayMessage:D}),!1)},a.informationMessage=function(e){return r.a.createElement("div",null,r.a.createElement("p",{style:{backgroundColor:"blue",border:"solid",borderColor:"blue",width:C,marginTop:0,color:"#fff",transform:"translate(-3px,".concat(60,"px)")}},e))},a.debugMessage=function(e){if(a.state.capturedCount>=F)return a.renderImageURL();if(!e||e&&0===e.length)return r.a.createElement("p",null,"Camera: front");var t=e.map(function(e,t){return{H:e.box.height+50,W:e.box.width,X:e.box._x,Y:e.box._y-80,A:e.box.area}});return r.a.createElement("p",null,"H: ",t[0].H," W: ",t[0].W," X: ",t[0].X," Y: ",t[0].Y," A: ",t[0].A," B: ",a.state.brightness)},a.renderDetectionMessages=function(e){if(!e||e&&0===e.length)return a.informationMessage(a.state.displayMessage);var t=e.map(function(e,t){return{H:e.box.height+50,W:e.box.width,X:e.box._x,Y:e.box._y-80,A:e.box.area}});return parseFloat(t[0].Y)<0||parseFloat(t[0].X)<0||parseFloat(t[0].X)+parseFloat(t[0].W)>C-50||parseFloat(t[0].Y)+parseFloat(t[0].H)>I-50?a.informationMessage(a.state.displayMessage):parseFloat(t[0].A)<E?a.informationMessage(a.state.displayMessage):(0!==a.state.brightness&&null!=a.state.displayMessage&&a.informationMessage(a.state.displayMessage),a.state.capturedCount>=F&&a.informationMessage(a.state.displayMessage),e.map(function(e,t){var a=e.box.height+50,n=e.box.width,s=e.box._x,o=e.box._y-80;return r.a.createElement("div",{key:t},r.a.createElement("div",{style:{position:"absolute",border:"solid",borderColor:"blue",height:a,width:n,transform:"translate(".concat(s,"px,").concat(o,"px)")}}))}))},a.webcam=r.a.createRef(),a.state={fullDesc:null,detections:null,match:null,facingMode:null,displayMessage:null,brightness:0,capturedImages:[],capturedCount:0},a}return Object(p.a)(t,e),Object(c.a)(t,[{key:"componentWillUnmount",value:function(){clearInterval(this.interval)}},{key:"render",value:function(){var e=this.state,t=e.detections,a=e.facingMode,n=null;return a&&(n={width:C,height:I,facingMode:a}),r.a.createElement("div",{className:"Camera",style:{display:"flex",flexDirection:"column",alignItems:"center"}},this.debugMessage(t),r.a.createElement("div",{style:{width:C,height:I}},r.a.createElement("div",{style:{position:"relative",width:C,height:I}},n?r.a.createElement("div",{style:{position:"absolute"}},r.a.createElement(f.a,{audio:!1,width:C,height:I,ref:this.webcam,screenshotFormat:"image/jpeg",videoConstraints:n})):null,this.renderDetectionMessages(t))))}}]),t}(n.Component),Y=function(e){function t(){return Object(i.a)(this,t),Object(u.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement(X,{capturedImage:this.props.capturedImage}))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var _=document.getElementById("root").getAttribute("capturedImage");o.a.render(r.a.createElement(Y,{capturedImage:_}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},90:function(e,t,a){e.exports=a(191)},95:function(e,t,a){},96:function(e,t,a){}},[[90,1,2]]]);
//# sourceMappingURL=main.19e02bbb.chunk.js.map