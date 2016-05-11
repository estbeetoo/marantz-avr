var should = require('should');
var AVReciever = require('../lib/avreciever');

describe('AVReciever', function() {
  var reciever = new AVReciever('192.168.2.106');

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
});