import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription } from '../api/face';
const uuidv4                        = require('uuid/v4')

const WIDTH                         = 600;
const HEIGHT                        = 600;
const inputSize                     = 160;
const FACE_AREA_THRESHOLD           = 35000
const BRIGHTNESS_THRESHOLD          = 60
const MAX_IMAGE_CAPTURES            = 6
const no_face_message               = 'please bring your face near to camera'
const less_face_area_message        = 'please come near to camera, looks like you are bit from the camera'
const face_out_of_frame_message     = 'your full face is not getting captured, please align'
const brightness_inadequate_message = 'please enable camera flash or move to a brighter place'
const capture_complete_message      = 'we have capture the relevant images'

class VideoInput extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      fullDesc: null,
      detections: null,
      match: null,
      facingMode: null,
      displayMessage: null,
      brightness: 0,
      capturedImages: [],
      capturedCount: 0
    };
  }

  componentWillMount = async () => {
    await loadModels();
    this.setInputDevice();
  };

  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      await this.setState({
        facingMode: 'user'
      });
      this.startCapture();
    });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 1500);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  capture = async () => {
    if (!!this.webcam.current) {
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize
      ).then(fullDesc => {
        if (!!fullDesc) {
          if(this.processCapturePostProcessing(fullDesc.map(fd => fd.detection))) {
            // save the appropriate images
            this.saveCapturedImages(this.webcam.current.getScreenshot())

            // make callback
            if (window.getCapturedImage && {}.toString.call(window.getCapturedImage) === '[object Function]') {
              window.getCapturedImage(this.webcam.current.getScreenshot())
            }
          }
          this.setState({
            detections: fullDesc.map(fd => fd.detection),
          });
        }
      });
    }
  };

  saveCapturedImages = (data) => {
    let { capturedImages, capturedCount } = this.state;
    if (capturedImages.length < MAX_IMAGE_CAPTURES) {
      capturedImages.push(data)
      capturedCount = capturedCount + 1

      this.setState({
        capturedImages: capturedImages,
        capturedCount: capturedCount,
        displayMessage: capture_complete_message
      })
    }
  }

  renderImageURL = () => {
    if (this.state.capturedCount >= MAX_IMAGE_CAPTURES) {
      return(
        <div>
          {this.state.capturedImages.map(image => <a key={uuidv4()} download={`${uuidv4()}.jpeg`} href={image}> Download </a>)}
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

  processImageBrightness = () => {
    let canvas    = this.webcam.current.getCanvas();
    let ctx       = canvas.getContext('2d');
    var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    var data      = imageData.data;

    var r = 0, g = 0, b = 0, avg = 0, colorSum = 0;

    for(var x = 0, len = data.length; x < len; x+=4) {
        r     = data[x];
        g     = data[x+1];
        b     = data[x+2];
        avg   = Math.floor((r+g+b)/3);
        colorSum += avg;
    }
    var brightness = Math.floor(colorSum / (canvas.width * canvas.height));
    return brightness
  }

  processCapturePostProcessing = (detections) => {
    if (!detections || (detections && detections.length === 0)) {
      this.setState({
        displayMessage: no_face_message
      })
      return false
    }
  
    let box = detections.map((detection, i) => {
      let _H = detection.box.height + 50;
      let _W = detection.box.width;
      let _X = detection.box._x;
      let _Y = detection.box._y - 80;
      return {
        H: _H, W: _W, X: _X, Y: _Y, A: detection.box.area
      }
    })
    if (parseFloat(box[0]['Y']) < 0.0 || parseFloat(box[0]['X']) < 0.0) {
      this.setState({
        displayMessage: face_out_of_frame_message
      })
      return false
    }

    if (parseFloat(box[0]['A']) < FACE_AREA_THRESHOLD) {
      this.setState({
        displayMessage: less_face_area_message
      })
      return false
    }

    let brightness = this.processImageBrightness()
    this.setState({
      brightness: brightness
    })
    if ( brightness > BRIGHTNESS_THRESHOLD) {
    } else {
      this.setState({
        displayMessage: brightness_inadequate_message
      })
      return false
    }

    return true
  }

  informationMessage = (message) => {
    return (
      <div>
        <p style={{ backgroundColor: 'blue', border: 'solid', borderColor: 'blue', width: WIDTH, marginTop: 0, color: '#fff', transform: `translate(-3px,${60}px)`}}>
          {message}
        </p>
      </div>
    )
  }

  debugMessage = (detections) => {
    if (this.state.capturedCount >= MAX_IMAGE_CAPTURES) {
      return this.renderImageURL()
    } else {
      if (!detections || (detections && detections.length === 0)) {
        return (<p>Camera: front</p>)
      }
  
      let box = detections.map((detection, i) => {
        let _H = detection.box.height + 50;
        let _W = detection.box.width;
        let _X = detection.box._x;
        let _Y = detection.box._y - 80;
        return {
          H: _H, W: _W, X: _X, Y: _Y, A: detection.box.area
        }
      })
      return <p>H: {box[0]['H']} W: {box[0]['W']} X: {box[0]['X']} Y: {box[0]['Y']} A: {box[0]['A']} B: {this.state.brightness}</p>
    }
  }

  renderDetectionMessages = (detections) => {
    if (!detections || (detections && detections.length === 0)) {
      return this.informationMessage(this.state.displayMessage)
    }

    let box = detections.map((detection, i) => {
      let _H = detection.box.height + 50;
      let _W = detection.box.width;
      let _X = detection.box._x;
      let _Y = detection.box._y - 80;
      return {
        H: _H, W: _W, X: _X, Y: _Y, A: detection.box.area
      }
    })

    if (parseFloat(box[0]['Y']) < 0.0 || parseFloat(box[0]['X']) < 0.0) {
      return this.informationMessage(this.state.displayMessage)
    }

    if (parseFloat(box[0]['A']) < FACE_AREA_THRESHOLD) {
      return this.informationMessage(this.state.displayMessage)
    }

    if (this.state.brightness !== 0 && this.state.displayMessage != null) {
      return this.informationMessage(this.state.displayMessage)
    }

    if (this.state.capturedCount >=  MAX_IMAGE_CAPTURES) {
      return this.informationMessage(this.state.displayMessage)
    }

    // all good, draw the box
    return detections.map((detection, i) => {
      let _H = detection.box.height + 50;
      let _W = detection.box.width;
      let _X = detection.box._x;
      let _Y = detection.box._y - 80;
      return (
        <div key={i}>
          <div
            style={{
              position: 'absolute',
              border: 'solid',
              borderColor: 'blue',
              height: _H,
              width: _W,
              transform: `translate(${_X}px,${_Y}px)`
            }}
          >
          </div>
        </div>
      );
    });
  }

  render() {
    const { detections, facingMode } = this.state;
    let videoConstraints = null;
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode
      };
    }

    return (
      <div className="Camera" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {this.debugMessage(detections)}
        <div style={{ width: WIDTH, height: HEIGHT }} >
          <div style={{ position: 'relative', width: WIDTH, height: HEIGHT}}>
            {!!videoConstraints ? (
              <div style={{ position: 'absolute' }}>
                <Webcam
                  audio={false}
                  width={WIDTH}
                  height={HEIGHT}
                  ref={this.webcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </div>
            ) : null}
            {this.renderDetectionMessages(detections)}
          </div>
        </div>
      </div>
    );
  }
}

export default VideoInput;