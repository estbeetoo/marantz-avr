var should = require('should');
var AVReciever = require('../lib/avreciever');

describe('AVReciever', function() {
  var reciever = new AVReciever('192.168.2.139');

  this.timeout(10000);

  beforeEach(function() {
    return reciever.setPowerState(true);
  });

  describe('#getStatus', function() {

    it('should return valid status', function() {
      return reciever.getState()
        .then(function(status) {
          status.should.have.property('power');
          status.should.have.property('mute');
        });
    })
  });

  describe('input functions', function() {
    it('should hide buggy CBL/SAT return value', function() {
      return receiver.setInputSource(AVReceiver.Sources.CBL_SAT).then(function() {
        return receiver.getInputSource().then(function(source) {
          source.should.be.exactly(AVReceiver.Sources.CBL_SAT);
        });
      });
    });
  });

  describe('power functions', function() {
    it('should power off', function() {
      this.timeout(15000);
      return reciever.setPowerState(false)
        .then(function() {
          return reciever.getPowerState().then(function(state) {
            state.should.be.false
          });
        })
    })
  });

  describe('#getStateFor', function() {
    it('should return state for mute', function() {
      return reciever.getStateFor('mute')
        .then(function(state) {
          (state !== undefined).should.be.ok;
        });
    })
  });

  describe('#setMuteState', function() {

    it('should set mute to true', function() {
      return reciever.setMuteState(true)
        .then(function() {
          return reciever.getMuteState();
        }).then(function(muteState) {
          muteState.should.be.true;
        });
    });

    it('should set mute to false', function() {
      return reciever.setMuteState(false)
        .then(function(status) {
          return reciever.getMuteState();
        }).then(function(muteState) {
          muteState.should.be.false;
        });
    });

  });

  describe('#setVolumeLevel', function() {
    it('should set volume to -80.0', function() {
      return reciever.setVolumeLevel(-80)
        .then(function() {
          return reciever.getVolumeLevel().then(function(volumeLevel) {
            parseFloat(volumeLevel).should.be.equal(-80.0);
          });
        });
    });
    it('should set volume to -60.0', function() {
      return reciever.setVolumeLevel(-60)
        .then(new Promise(function(resolve, reject) {
          setTimeout(function() {
            reciever.getVolumeLevel().then(function(volumeLevel) {
              parseFloat(volumeLevel).should.be.equal(-60.0);
              resolve()
            }, reject);
          });
        }));
    });
    it('should set volume to -31.0', function() {
      return reciever.setVolumeLevel(-31)
        .then(new Promise(function(resolve, reject) {
          setTimeout(function() {
            reciever.getVolumeLevel().then(function(volumeLevel) {
              parseFloat(volumeLevel).should.be.equal(-31.0);
              resolve()
            }, reject);
          });
        }));
    });
    it('should set volume to -11.0', function() {
      return reciever.setVolumeLevel(-11)
        .then(new Promise(function(resolve, reject) {
          setTimeout(function() {
            reciever.getVolumeLevel().then(function(volumeLevel) {
              parseFloat(volumeLevel).should.be.equal(-11.0);
              resolve()
            }, reject);
          });
        }));
    });
    it('should set volume to 18.0', function() {
      return reciever.setVolumeLevel(18)
        .then(new Promise(function(resolve, reject) {
          setTimeout(function() {
            reciever.getVolumeLevel().then(function(volumeLevel) {
              parseFloat(volumeLevel).should.be.equal(18.0);
              resolve()
            }, reject);
          });
        }));
    });
    it('should set volume to -80.0', function() {
      return reciever.setVolumeLevel(-80)
        .then(new Promise(function(resolve, reject) {
          setTimeout(function() {
            reciever.getVolumeLevel().then(function(volumeLevel) {
              parseFloat(volumeLevel).should.be.equal(-80.0);
              resolve()
            }, reject);
          });
        }));
    });
  });

  describe('#setVolumeLevelPercent', function() {
    it('should set volume to 0%', function() {
      return reciever.setVolumeLevelPercent(0)
        .then(function() {
          return reciever.getVolumeLevel().then(function(volumeLevel) {
            parseFloat(volumeLevel).should.be.equal(-80.0);
          });
        });
    });
    it('should set volume to 20%', function() {
      return reciever.setVolumeLevelPercent(20)
        .then(new Promise(function(resolve, reject) {
          setTimeout(function() {
            reciever.getVolumeLevel().then(function(volumeLevel) {
              parseFloat(volumeLevel).should.be.equal(-60.0);
              resolve()
            }, reject);
          });
        }));
    });
    it('should set volume to 50%', function() {
      return reciever.setVolumeLevelPercent(50)
        .then(new Promise(function(resolve, reject) {
          setTimeout(function() {
            reciever.getVolumeLevel().then(function(volumeLevel) {
              parseFloat(volumeLevel).should.be.equal(-31.0);
              resolve()
            }, reject);
          });
        }));
    });
    it('should set volume to 70%', function() {
      return reciever.setVolumeLevelPercent(70)
        .then(new Promise(function(resolve, reject) {
          setTimeout(function() {
            reciever.getVolumeLevel().then(function(volumeLevel) {
              parseFloat(volumeLevel).should.be.equal(-11.0);
              resolve()
            }, reject);
          });
        }));
    });
    it('should set volume to 100%', function() {
      return reciever.setVolumeLevelPercent(100)
        .then(new Promise(function(resolve, reject) {
          setTimeout(function() {
            reciever.getVolumeLevel().then(function(volumeLevel) {
              parseFloat(volumeLevel).should.be.equal(18.0);
              resolve()
            }, reject);
          });
        }));
    });
    it('should set volume to 0%', function() {
      return reciever.setVolumeLevelPercent(0)
        .then(new Promise(function(resolve, reject) {
          setTimeout(function() {
            reciever.getVolumeLevel().then(function(volumeLevel) {
              parseFloat(volumeLevel).should.be.equal(-80.0);
              resolve()
            }, reject);
          });
        }));
    });
  });
});
