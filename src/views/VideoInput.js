import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription } from '../api/face';
import overlayImage from '../images/overlay.png';

const WIDTH = 420;
const HEIGHT = 420;
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
      // let inputDevice = await devices.filter(
      //   device => device.kind === 'videoinput'
      // );
      await this.setState({
        facingMode: 'user'
      });
      // if (inputDevice.length < 2) {
      //   await this.setState({
      //     facingMode: 'user'
      //   });
      // } else {
      //   await this.setState({
      //     facingMode: { exact: 'environment' }
      //   });
      // }
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

  renderSupportingMessageAndAudioMessage = (message) => {
    return (
      <div>
      <p
        style={{
          backgroundColor: 'blue',
          border: 'solid',
          borderColor: 'blue',
          width: WIDTH,
          marginTop: 0,
          color: '#fff',
          transform: `translate(-3px,${60}px)`
        }}
      >
        {message}
      </p>
      </div>
    )
  }

  render() {
    const { detections, facingMode } = this.state;
    // let message = 'face'
    let info_message = 'please bring your face near to camera'

    let videoConstraints = null;
    let camera = '';
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode
      };

      if (facingMode === 'user') {
        camera = 'Front';
      } else {
        camera = 'Back';
      }
    }

    // let drawBox = null;
    // if (!!detections) {
    //   drawBox = detections.map((detection, i) => {
    //     let _H = detection.box.height;
    //     let _W = detection.box.width;
    //     let _X = detection.box._x;
    //     let _Y = detection.box._y;
    //     return (
    //       <div key={i}>
    //         <div
    //           style={{
    //             position: 'absolute',
    //             border: 'solid',
    //             borderColor: 'blue',
    //             height: _H,
    //             width: _W,
    //             transform: `translate(${_X}px,${_Y}px)`
    //           }}
    //         >
    //           <p
    //             style={{
    //               backgroundColor: 'blue',
    //               border: 'solid',
    //               borderColor: 'blue',
    //               width: _W,
    //               marginTop: 0,
    //               color: '#fff',
    //               transform: `translate(-3px,${_H}px)`
    //             }}
    //           >
    //             {message}
    //           </p>
    //         </div>
    //       </div>
    //     );
    //   });
    // }

    if (detections && detections.length > 0) {
      // console.log(detections[0].score)
      // console.log(detections)
    }

    return (
      <div
        className="Camera"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <p>Camera: {camera}</p>
        <div
          style={{
            width: WIDTH,
            height: HEIGHT
          }}
        >
          <div style={{ position: 'relative', width: WIDTH}}>
            {!!videoConstraints ? (
              <div style={{ position: 'absolute' }}>
              <div style={{ position:'absolute', 
                            width:WIDTH,
                            height:HEIGHT,
                            backgroundImage:`url(${overlayImage})`
                          }}></div>
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
            {(detections && detections.length > 0) ? null : this.renderSupportingMessageAndAudioMessage(info_message)}
          </div>
        </div>
      </div>
    );
  }
}

export default VideoInput;