
var highest_score = getCookie("highest_score");
var rounds = getCookie("rounds");

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return 0;
}

$(document).ready(function (){
    var level = 1;
    var width = 100;
    var w = 100;
    var num = 0;
    var score = 0;
    var stop = true;
    var $play = $(".play");

    function update(){
        $("#highest").html("Highest Score: "+highest_score);
        $("#rounds").html("Rounds you have played: "+rounds);
        $("#score").html("Your Score: "+score);
    }



    function build(){
        $(".platform").append('<div class="new_platform" style="width:'+width+'px ; left:0;background: darkgray"></div>');
        setTimeout(function () {
            var max=$(".main").offset().top;
            var min=50;

            for(var i=0;i<100;i++){
                var next=$(".new_platform").eq(i).offset().left;
                var sum = next+width+parseInt(Math.random()*(max-min))+min;
                $(".platform").append('<div class="new_platform" style="width:'+w+'px ; left:'+sum+'px;;background: darkgray"></div>');
                if((i+1)%5===0){
                    if(w>10)
                        w-=10;
                }
            }
        },50)
    }

    build();
    update();

    $play.mousedown(function () {
        $(".play").addClass("playDown");
        if(stop === true){
            var max=$(".main").offset().top;
            $(".rod").animate({"width":max+"px"},1000);

        }
    });

    $play.mouseup(function () {
        $(".play").removeClass("playDown");
        //console.log(stop);
        if (stop === true) {
            $(".rod").stop();
            $(".rod").addClass("fall");
            run();
            stop = false;
        }
    });

    // $("#start").click(function(){
    //     //start game
    //     $(this).hide();
    // });

    $("#help").click(function(){
        alert("Hold the button to start making the bridge longer and release to stop, try to make the Match man reach the next platform and not falling down");
    });

    $("#clear").click(function(){
        clear();
    });

    function run(){
        var len = $(".rod").width();
        setTimeout(function () {
            $(".man").find("img").attr("src","imgs/run.gif");
            $(".man").find("img").animate({"left":(len+width)+"px"},1000,function () {
                var dist = $(".new_platform").eq(num+1).offset().left-width;
                if((len+20)<dist||len>dist+width){
                    //console.log("0");
                    $(".man img").addClass("fall");
                    setTimeout(function () {
                        clear();
                    }, 500);
                }else{
                    $(".man").find("img").attr("src","imgs/stand.png").css("left","0").hide();
                    $(".rod").removeClass("fall").width("0");
                    var next=$(".new_platform").eq(num+1).css("left");
                    $(".platform").animate({"left":"-"+next},500,function () {
                        $(".man").find("img").show();
                        stop=true;
                        num++;
                        score+=level;
                        if(num%5 === 0){
                            level+=1;
                        }
                        //console.log(score);
                        update();
                    })
                }
            })
        },500)
    }

    function clear() {
        $(".platform").empty();
        stop = true;
        num=0;
        if(score>highest_score)
            highest_score=score;
        rounds+=1;
        document.cookie="highest_score="+highest_score+";rounds="+rounds;
        console.log(document.cookie);
        score = 0;
        w = 100;
        build();
        update();
        $(".man img").attr("src","imgs/stand.png").css("left","0px").removeClass("fall");
        $(".rod").removeClass("fall").width("0px");
        $(".platform").css("left","0");

    }
});