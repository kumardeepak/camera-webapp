import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription } from '../api/face';

const WIDTH = 600;
const HEIGHT = 600;
const inputSize = 160;

class VideoInput extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      fullDesc: null,
      detections: null,
      match: null,
      facingMode: null
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
          if (window.getCapturedImage && {}.toString.call(window.getCapturedImage) === '[object Function]') {
            window.getCapturedImage(this.webcam.current.getScreenshot())
          }
          this.setState({
            detections: fullDesc.map(fd => fd.detection),
          });
        }
      });
    }
  };

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

  processDetectionCriterion = (detections) => {
    let no_face_message         = 'please bring your face near to camera'
    let less_face_area_message  = 'please come near to camera, looks like you are bit from the camera'
    let face_going_out_message  = 'your full face is not getting captured, please align'
    let face_area_threshold     = 70000;

    if (!detections || (detections && detections.length === 0)) {
      return this.informationMessage(no_face_message)
    }

    let box = detections.map((detection, i) => {
      let _H = detection.box.height;
      let _W = detection.box.width;
      let _X = detection.box._x;
      let _Y = detection.box._y;
      return {
        H: _H, W: _W, X: _X, Y: _Y, A: detection.box.area
      }
    })

    if (box && box.length === 1 ) {
      if (parseFloat(box[0]['Y']) < 0.0) {
        return this.informationMessage(face_going_out_message)
      }

      if (parseFloat(box[0]['A']) < face_area_threshold) {
        return this.informationMessage(less_face_area_message)
      }
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
            {this.processDetectionCriterion(detections)}
          </div>
        </div>
      </div>
    );
  }
}

export default VideoInput;