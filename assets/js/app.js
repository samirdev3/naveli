/** Mobile Detection */
let isMobile=!1;/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&(isMobile=!0);

/** copyright year */
const year = document.querySelector(".year");
const d = new Date();
const n = d.getFullYear();
year.innerHTML = n;

/** waves classes */
//createWaves("_wone","#fff");
//createWaves("_wtwo","#fff");
//createWaves("_wthree","#ff9022");

/** Waves */
function createWaves($class, $color){
    var cvs,ctx;
    //var nodes = 5;
    var waves = [];
    var waveHeight = 20;//height of the wave peak
    var colours = [$color];

    function init() 
    {
    cvs = document.querySelector("."+$class);
    ctx = cvs.getContext("2d");

    var temp = new wave($color,8);
    setInterval(update,15);//time of wave formation
    }

    function update(array) 
    {
    ctx.fillRect(0,0,cvs.width,cvs.height);
    ctx.globalCompositeOperation = "copy";
    for (var i = 0; i < waves.length; i++) {
        for (var j = 0; j < waves[i].nodes.length; j++) {
        bounce(waves[i].nodes[j]);
        }
        drawWave(waves[i]);
    }
    }

    function wave(colour,nodes) {
    // body...
    this.colour = colour;
    this.nodes = [];
    var tick = 1;
    for (var i = 0; i <= nodes+2; i++) {
        var temp = [(i-1)*cvs.width/nodes,0,i*100,0.5];//this.speed*plusOrMinus//last parameter i.e. 0.5 indicates speed of wave animation
        this.nodes.push(temp);
    }
    waves.push(this);
    }

    function bounce(node) {

    node[1] = waveHeight/2*Math.sin(node[2]/20)+cvs.height/2;
    node[2] = node[2] + node[3];

    }

    function drawWave (obj) {
    var diff = function(a,b) 
    {
        return (b - a)/2 + a;
    }
    ctx.fillStyle = obj.colour;
    ctx.beginPath();
    ctx.moveTo(0,cvs.height-55);
    for (var i = 0; i < obj.nodes.length; i++) {
        if (obj.nodes[i+1]) 
        {
        ctx.quadraticCurveTo(
            obj.nodes[i][0],obj.nodes[i][1],
            diff(obj.nodes[i][0],obj.nodes[i+1][0]),diff(obj.nodes[i][1],obj.nodes[i+1][1])
        );
        }
        else
        {
        ctx.lineTo(obj.nodes[i][0],obj.nodes[i][1]);
        ctx.lineTo(cvs.width,cvs.height-55);
        }
        
    }
    ctx.closePath();
    ctx.fill();
    }

    document.addEventListener("DOMContentLoaded",init,false);
};

jQuery(document).ready(function(){
    /** marquee text */
    var mqchild = jQuery('.running-text');
    mqchild.each(function(index){
        var childLength = jQuery(this).find('.marquee-child.one').width()*1.5;
        jQuery(this).width(childLength);
    });
});