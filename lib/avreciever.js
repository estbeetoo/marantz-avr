var request = require('request');
var parseXmlString = require('xml2js').parseString;
var qs = require('querystring');
var RateLimiter = require('limiter').RateLimiter;

const STATUS_URL = '/goform/formMainZone_MainZoneXml.xml';
const POST_URL = '/index.put.asp';
var AVReciever = function(ipAddress, port) {
  //TODO: handle port parameter
  this.ipAddress = ipAddress
  this.limiter = new RateLimiter(1, 250);
  this.powerState = null;
}

AVReciever.Sources = {
  GAME: "GAME",
  CBL_SAT: "SAT/CBL",
  NETWORK: "NET",
  USB: "USB/IPOD",
  TUNER: "TUNER",
  DVD: "DVD",
  BLUERAY: "BD",
  HD_RADIO: "HDRADIO",
  AUX1: "AUX1",
  AUX2: "AUX2",
  MEDIA_PLAYER: "MPLAY",
  TV: "TV",
  PHONO: "PHONO",
  INTERNET_RADIO: "IRADIO",
  MXPORT: "M-XPORT",
  NETHOME: "NETHOME"
};

AVReciever.SurroundModes = {
  MOVIE: "MOVIE",
  MUSIC: "MUSIC",
  GAME: "GAME",
  PURE_DIRECT: "PURE DIRECT",
  DIRECT: "DIRECT",
  STEREO: "STEREO",
  STANDARD: "STANDARD",
  SIMULATION: "SIMULATION",
  AUTO: "AUTO",
  LEFT: "LEFT"
};

AVReciever.prototype.getState = function() {
  var convertStatusToModel = function(status) {
    var getValue = function(name) {
      var value = status.item[name][0].value;
      if (typeof value === 'object' && Array.isArray(value)) {
        if (value.length === 1) {
          value = value[0];
        }
      }
      if (typeof value === 'string') {
        value = value.toUpperCase().trim();
      }

      if (value === "ON") {
        value = true;
      } else if (value === "OFF") {
        value = false;
      } else if (value === "STANDBY") {
        value = false;
      }

      // At least one model of receiver reports its input source as "CBL/SAT",
      // but requires it be written as "SAT/CBL". We hide that by translating
      // from the read value here so any client code can work off the sources
      // enum above.
      if (value === "CBL/SAT") {
        value = "SAT/CBL";
      }

      return value;
    }

    var model = {
      power: this.powerState = getValue('ZonePower'),
      input: getValue('InputFuncSelect'),
      volumeLevel: getValue('MasterVolume') === '--' ? '-80.0' : getValue('MasterVolume'),
      mute: getValue('Mute'),
      surroundMode: getValue('selectSurround')
    }
    return model;
  }
  return new Promise((function(resolve, reject) {
    this._request({
        url: 'http://' + this.ipAddress + STATUS_URL + '?_=' + new Date().getTime()
      },
      function(err, response, body) {
        if (!err && response.statusCode == 200) {
          parseXmlString(body, function(err, result) {
            var model = convertStatusToModel(result);
            resolve(model);
          });
        } else {
          reject(err);
        }
      }
    )
  }).bind(this));
};

AVReciever.prototype.sendCommand = function(cmd) {
  return new Promise((function(resolve, reject) {
    var body = qs.stringify({cmd0: cmd});
    this._request({
      url: 'http://' + this.ipAddress + '/MainZone' + POST_URL,
      method: 'POST',
      headers: {
        'Content-type': 'text/html'
      },
      body: body
    }, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        resolve();
      } else {
        reject(err);
      }
    })
  }).bind(this));
};

AVReciever.prototype.getStateFor = function(name) {
  return new Promise((function(resolve, reject) {
    this.getState().then(function(state) {
      if (name == 'zonepower')
        this.powerState = state[name];
      resolve(state[name]);
    }, function(err) {
      reject(err);
    });
  }).bind(this));
}

AVReciever.prototype.setMuteState = function(muted) {
  return this.sendCommand("PutVolumeMute/" + (muted ? "on" : "off"));
};

AVReciever.prototype.getMuteState = function() {
  return this.getStateFor('mute');
}

AVReciever.prototype.volumeDown = function(level) {
  return this.sendCommand("PutMasterVolumeBtn/<");
}

AVReciever.prototype.volumeUp = function(level) {
  return this.sendCommand("PutMasterVolumeBtn/>");
}

AVReciever.prototype.setVolumeLevel = function(level) {
  return this.sendCommand("PutMasterVolumeSet/" + level);
}

AVReciever.prototype.setVolumeLevelPercent = function(level) {
  level = Math.round(0.98 * parseFloat(level) - 80);
  return this.sendCommand("PutMasterVolumeSet/" + level);
}

AVReciever.prototype.getVolumeLevel = function() {
  return this.getStateFor('volumeLevel');
}

AVReciever.prototype.setInputSource = function(source) {
  return this.sendCommand("PutZone_InputFunction/" + source);
}

AVReciever.prototype.getInputSource = function() {
  return this.getStateFor('input');
}

AVReciever.prototype.setSurroundMode = function(surroundMode) {
  return this.sendCommand("PutSurroundMode/" + surroundMode);
}

AVReciever.prototype.getSurroundMode = function() {
  return this.getStateFor('surroundMode');
}

AVReciever.prototype.setPowerState = function(state) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.sendCommand('PutZone_OnOff/' + (state ? "ON" : "OFF"))
      .then(function() {
        // Power state takes a long time so we wait a bit
        if (this.powerState == null || this.powerState != state) {
          setTimeout(resolve, 3000);
        }
        else {
          setTimeout(resolve, 1000);
        }
      }, reject);
  });
}

AVReciever.prototype.getPowerState = function() {
  return this.getStateFor('power');
}

AVReciever.prototype._request = function(options, callback) {
  this.limiter.removeTokens(1, function() {
    request(options, callback);
  });
}

module.exports = AVReciever;
