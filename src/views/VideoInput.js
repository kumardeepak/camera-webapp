import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription } from '../api/face';

const WIDTH = 600;
const HEIGHT = 600;
const inputSize = 160;
const FACE_AREA_THRESHOLD = 70000

class VideoInput extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      fullDesc: null,
      detections: null,
      match: null,
      facingMode: null,
      displayMessage: null
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

  processCapturePostProcessing = (detections) => {
    let no_face_message             = 'please bring your face near to camera'
    let less_face_area_message      = 'please come near to camera, looks like you are bit from the camera'
    let face_out_of_frame_message   = 'your full face is not getting captured, please align'
  
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
    console.log(box[0])

    return <p>H: {box[0]['H']} W: {box[0]['W']} X: {box[0]['X']} Y: {box[0]['Y']} A: {box[0]['A']}</p>

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