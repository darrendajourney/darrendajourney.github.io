window.onload = function() {
    const canvas = document.getElementById("Canvas");
    const context = canvas.getContext("2d");
    canvas.width = 1500;
    canvas.height = 500;
    const balls = [];
    
    class Particles {
        constructor () {
            this.x = Math.random ()  * canvas.width;
            this.y = Math.random () * canvas.height;
            this.radius = (Math.random() * 7 + 1);
            this.opacity = Math.random () * 0.8 + 0.1;
            this.xv = 0;
            this.xy = 0;
            this.friction = 0.94
            this.speedX = 0.3;
            this.speedY = 0.3;
        }
        draw() {
            //context.fillStyle = "white";
            context.strokeStyle = "white";
            context.lineWidth = 3;
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.stroke();   
            context.closePath();
            context.globalAlpha = this.opacity;
            context.fill();
        }
        update(){
            this.x += this.speedX;
            this.y += this.speedY;
            this.xv += Math.random() * 0.2 - 0.1;
            this.xy += Math.random() * 0.2 - 0.1;
            this.x += this.xv;
            this.y += this.xy;
            this.xv *= this.friction;
            this.xy *= this.friction;

            if (this.x > canvas.width) {
                this.x = 0;
            }else if (this.x < 0) {
                canvas.width;
            }
            if (this.y > canvas.height) {
                this.y = 0;
            }else if (this.y < 0); {
                canvas.height;
            }
           
            if (this.x + this.radius > canvas.width ||
                this.x - this.radius < 0){
                    this.speedX = -this.speedX;
            }
            if (this.y + this.radius > canvas.height ||
                this.y + this.radius < 0){
                    this.speedY = -this.speedY;
            }
            this.draw();
        }
    }
    
    function init(){
        for (let i = 0; i < 150; i++){
            balls.push(new Particles());
        }
    }
    function animate(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < balls.length; i++){
            balls[i].update();
        }
    //analyser.getByteFrequencyData(binCount);
    //for (let i = 0; i < binCount; i++) {
        //let v = binCount[i] /= Math.pow(10, 4);
        //this.opacity = v;
    //}
        requestAnimationFrame(animate);
        }
       
        init();
        animate();
    }