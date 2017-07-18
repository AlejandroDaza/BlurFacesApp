// this function only load the image
function previewFile() {
    var preview = document.querySelector('img');
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
           
}

//This function analyzes the image
function blurFace() {
    //Obtaining the attributes of the image
    var img = document.getElementById('img');
    var totalwidth = img.clientWidth;
    var totalheight = img.clientHeight;

    //The library traker.js is initialized
    var tracker = new tracking.ObjectTracker('face');
    tracker.setStepSize(1.7);
    tracking.track(img, tracker);
    
    //Clone the original image on the canvas
    var myCanvas = document.getElementById('theCanvas');
    var myCanvascontext = myCanvas.getContext('2d');
    myCanvas.width = totalwidth;
    myCanvas.height = totalheight;
    myCanvascontext.drawImage(img, 1, 1);
        
    //The method that parses the image is called
    tracker.on('track', function (event) {
        var i = 1;
        event.data.forEach(function (rect) {
            //Invoking the method that diffuses faces with the position of every face
            window.plot(rect.x, rect.y, rect.width, rect.height, i);
            i++;
        });
    });
        
    //Method that diffuses faces
    window.plot = function (x, y, w, h, i) {
        //A new canvas is created
        var canvas = document.createElement('canvas');
        canvas.classList.add('canvas');
        canvas.id     = i;
        canvas.width  = w;
        canvas.height = h;
        canvas.style.zIndex = 8;
        canvas.style.left = 1;
        canvas.style.top = 1;
        canvas.style.position = "absolute";
        canvas.style.border = "1px solid";
        //The image is modified on the new canvas
        var context = canvas.getContext('2d');
        context.filter = 'blur(5px)';
        context.drawImage(img, x, y, w, h, 1, 1, w, h);
        //The faded face is added to the result canvas
        myCanvascontext.drawImage(canvas, 1, 1, w, h, x, y, w, h);
    };
}

