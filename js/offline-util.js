// these is some utility code to generate the pixelized ".js" data, to
// be used offline

// this generates a set of points based off of text

function generate() {
    canvas.width = 27;
    canvas.height = 27;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '24px sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText('.js', 0, 20);

    var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = [];

    for(var i=0; i<image.data.length; i+=4) {
        if(image.data[i] > 0) {
            var x = (i / 4) % image.width;
            var y = Math.floor((i / 4) / image.width);
            data.push([x, y]);
        }
    }

    console.log(data.toSource());
    return data;
}


// this creates a little pixel editor to manipulate the image data

function editor() {
    canvas.width = 27*4;
    canvas.height = 27*4;

    for(var i=0; i<data.length; i++) {
        if(data[i][0] >= 12) {
            data[i][0] += 2;
        }
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'blue';

        for(var i=0; i<data.length; i++) {
            ctx.fillRect(data[i][0] * 4, data[i][1] * 4, 4, 4);
        }
    }

    render();

    canvas.addEventListener('mousedown', function(e) {
        var offset = canvas.getBoundingClientRect();
        var x = Math.floor((e.pageX - offset.left) / 4);
        var y = Math.floor((e.pageY - offset.top) / 4);

        console.log(x, y);

        var idx = null;
        for(var i=0; i<data.length; i++) {
            if(data[i][0] == x && data[i][1] == y) {
                idx = i;
            }
        }

        if(e.button == 1) {
            if(idx !== null) {
                data.splice(idx, 1);
            }
        }
        else {
            if(idx === null) {
                data.push([x, y]);
            }
        }

        render();
    });
}
