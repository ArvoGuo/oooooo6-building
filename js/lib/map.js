'use strict';

function Map(options) {
  this.config(options).factory();
}

Emitter(Map.prototype);

Map.prototype.config = function(options) {
  var self = this;
  this.markers = [];
  this.element = options.element;
  this.on('updateStatus', function(index) {
    var STATUS = {
      '0': 'DEFAULT',
      '1': 'LISTEN_DRAW_POINT'
    };
    self.state = STATUS[index];
  });
  return this;
};


Map.prototype.factory = function() {
  this.target = new qq.maps.Map(this.element);
};

Map.prototype.listenDrawPointOnce = function(callback) {
  var self = this;
  this.updateStatus(1);
  qq.maps.event.addListenerOnce(this.target, 'click', handler);
  function handler(e) {
    self.updateStatus(0);
    callback && callback(e);
  }
};

Map.prototype.addMarker = function(position) {
  var icon = new qq.maps.MarkerImage(
        '../../img/tip.png',
        new qq.maps.Size(14, 21),
        new qq.maps.Point(0, 0),
        new qq.maps.Point(4, 12)
    );
  var marker = new qq.maps.Marker({
    position: position,
    icon: icon
  });
  marker.setMap(this.target);
  this.markers.push(marker);
};

Map.prototype.clearMarkers = function() {
  this.markers.forEach(function(item){
    item.setMap(null);
  });
  this.markers = [];
};

Map.prototype.updateStatus = function(index) {
  this.emit('updateStatus', index);
};


