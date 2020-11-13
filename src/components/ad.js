import React, {Component} from 'react';
import {adDemoMode} from '../config.js';

export default class Ad extends Component {
  componentDidMount() {
    window['nitroAds'].createAd(this.props.id, {
      "demo": adDemoMode,
      "refreshLimit": 10,
      "refreshTime": 90,
      "renderVisibleOnly": false,
      "refreshVisibleOnly": true,
      "sizes": this.props.sizes,
      "format": this.props.format,
      "anchor": "bottom",
      "mediaQuery": this.props.format === "anchor" && "(max-width: 992px)",
      "report": {
        "enabled": true,
        "wording": "Report Ad",
        "position": "top-right"
      }
    });
  }

  render() {
    return <div id={this.props.id}/>;
  }
}