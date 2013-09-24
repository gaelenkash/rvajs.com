window.requestAnimFrame = (function(){
    return (window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            });
})();

var canvas = document.querySelector('.logo canvas');
var ctx = canvas.getContext('2d');
canvas.width = 200;
canvas.height = 150;

var data = [[8, 3], [9, 3], [8, 4], [9, 4], [10, 4], [8, 5], [9, 5], [17, 6], [18, 6], [19, 6], [20, 6], [21, 6], [15, 7], [16, 7], [17, 7], [18, 7], [19, 7], [20, 7], [21, 7], [22, 7], [23, 7], [8, 8], [9, 8], [10, 8], [15, 8], [16, 8], [17, 8], [18, 8], [19, 8], [20, 8], [21, 8], [22, 8], [23, 8], [24, 8], [8, 9], [9, 9], [10, 9], [14, 9], [15, 9], [16, 9], [17, 9], [18, 9], [20, 9], [21, 9], [22, 9], [23, 9], [24, 9], [8, 10], [9, 10], [10, 10], [14, 10], [15, 10], [16, 10], [17, 10], [22, 10], [23, 10], [24, 10], [8, 11], [9, 11], [10, 11], [14, 11], [15, 11], [16, 11], [17, 11], [18, 11], [19, 11], [23, 11], [24, 11], [8, 12], [9, 12], [10, 12], [14, 12], [15, 12], [16, 12], [17, 12], [18, 12], [19, 12], [20, 12], [21, 12], [22, 12], [8, 13], [9, 13], [10, 13], [15, 13], [16, 13], [17, 13], [18, 13], [19, 13], [20, 13], [21, 13], [22, 13], [23, 13], [24, 13], [8, 14], [9, 14], [10, 14], [17, 14], [18, 14], [19, 14], [20, 14], [21, 14], [22, 14], [23, 14], [24, 14], [25, 14], [8, 15], [9, 15], [10, 15], [14, 15], [15, 15], [16, 15], [21, 15], [22, 15], [23, 15], [24, 15], [25, 15], [8, 16], [9, 16], [10, 16], [14, 16], [15, 16], [16, 16], [17, 16], [22, 16], [23, 16], [24, 16], [25, 16], [2, 17], [3, 17], [4, 17], [8, 17], [9, 17], [10, 17], [14, 17], [15, 17], [16, 17], [17, 17], [18, 17], [21, 17], [22, 17], [23, 17], [24, 17], [25, 17], [2, 18], [3, 18], [4, 18], [8, 18], [9, 18], [10, 18], [14, 18], [15, 18], [16, 18], [17, 18], [18, 18], [19, 18], [20, 18], [21, 18], [22, 18], [23, 18], [24, 18], [2, 19], [3, 19], [4, 19], [8, 19], [9, 19], [10, 19], [15, 19], [16, 19], [17, 19], [18, 19], [19, 19], [20, 19], [21, 19], [22, 19], [23, 19], [8, 20], [9, 20], [10, 20], [17, 20], [18, 20], [19, 20], [20, 20], [21, 20], [22, 20], [8, 21], [9, 21], [10, 21], [6, 22], [8, 22], [9, 22], [10, 22], [6, 23], [7, 23], [8, 23], [9, 23], [10, 23], [6, 24], [7, 24], [8, 24], [9, 24], [10, 3], [5, 21], [5, 22], [5, 23], [6, 21], [7, 22], [10, 5], [11, 10], [11, 12], [11, 18], [11, 17], [11, 16], [11, 15], [11, 14], [11, 13], [11, 11], [11, 19], [11, 20], [11, 22], [11, 21]];

// vectors

function vadd(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}

function vsub(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1]];
}

function vcopy(v) {
    return [v[0], v[1]];
}

function vmul(v, scalar) {
    return [v[0] * scalar, v[1] * scalar];
}

function vrotate(v, angle) {
    var cs = Math.cos(angle);
    var sn = Math.sin(angle);
    return [
        v[0] * cs - v[1] * sn,
        v[0] * sn + v[1] * cs
    ];
}

function vnormalize(v) {
    var l = v[0] * v[0] + v[1] * v[1];
    if(l > 0) {
        l = 1 / Math.sqrt(l);
        return [v[0] * l, v[1] * l];
    }
    return [0, 0];
}

function vlength(v) {
    var l = v[0] * v[0] + v[1] * v[1];
    return Math.sqrt(l);
}

function Point(x, y) {
    x *= 5;
    y *= 5;

    this.pos = [x, y];
    this.origPos = [x, y];
    this.velocity = [0, 0];
}

Point.prototype.render = function() {
    ctx.fillStyle = '#607848';
    ctx.fillRect(this.pos[0], this.pos[1], 5, 5);
};

Point.prototype.update = function(dt) {
    var speed = 1;
    var targetPos = this.targetPos;

    if(mousePos) {
        var ab = vsub(this.pos, mousePos);
        this.velocity = vadd(
            this.velocity,
            vmul(vnormalize(ab), (1 - Math.min(vlength(ab) / 50, 1)) * 50)
        );
    }

    var ab = vsub(this.origPos, this.pos);
    var ablen = vlength(ab);
    var pull = vmul(vnormalize(ab), ablen);
    this.velocity = vadd(this.velocity, pull);
    this.pos = vadd(this.pos, vmul(this.velocity, dt));

    this.velocity = vmul(this.velocity, .97);

    if(ablen < .0001) {
        this.velocity = [Math.random() * 50, Math.random() * 50];
    }
};

var points = [];
var mousePos = null;

for(var i=0; i<data.length; i++) {
    var d = data[i];
    var p = new Point(d[0], d[1]);
    points.push(p);
}

document.body.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    var pos = [e.pageX - rect.left, e.pageY - rect.top];

    if(pos[0] < rect.width && pos[1] < rect.height) {
        mousePos = pos;
    }
    else {
        mousePos = null;
    }
});

function heartbeat() {
    var now = Date.now();
    var dt = (now - last) / 1000;
    last = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(var i=0; i<points.length; i++) {
        var p = points[i];
        p.render();
        p.update(.016);
    }

    requestAnimFrame(heartbeat);
}

var last = Date.now();
heartbeat();
