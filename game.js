
var highest_score = parseInt(getCookie("highest_score"));
var rounds = parseInt(getCookie("rounds"));

$(document).ready(function (){
    var level = 1;
    var width = 100;
    var w = 100;
    var num = 0;
    var score = 0;
    var stop = true;
    var running = false;
    var $play = $(".play");

    build();
    update();

    function update(){
        $("#highest").html("Highest Score: "+highest_score);
        $("#rounds").html("Rounds you have played: "+rounds);
        $("#level").html("Level: "+level);
        $("#score").html("Your Score: "+score);
    }



    function build(){
        $(".platform").append('<div class="new_platform" style="width:'+width+'px ; left:0;background: darkgray"></div>');
        setTimeout(function () {
            var max = $(".main").offset().top;
            var min = 50;

            for(var i=0;i<100;i++){
                var next=$(".new_platform").eq(i).offset().left;
                var sum = next+width+parseInt(Math.random()*(max-min))+min;
                $(".platform").append('<div class="new_platform" style="width:'+width+'px ; left:'+sum+'px;background: darkgray"></div>');
                if((i+1)%3===0){
                    if(width>20)
                        width-=20;
                }
            }
        },50)
    }


    $play.mousedown(function () {
        if(running===true)
            return ;
        $(".play").addClass("playDown");
        if(stop === true){
            var max=$(".main").offset().top;
            var w = $(".new_platform").eq(num).width();
            $(".rod").css("left",w);
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
        alert("Hold the red button to start making the bridge longer and release to stop," +
            " try to make the Match Man reach the next platform and not falling down." +
            " The platform will become shorter as the level improve.");
    });

    $("#clear").click(function(){
        clear();
    });

    function run(){
        running = true;
        var len = $(".rod").width();
        setTimeout(function () {
            var w = $(".new_platform").eq(num+1).width();
            //console.log(w);
            $(".man").find("img").attr("src","imgs/running.gif");
            $(".man").find("img").animate({"left":(len+w)+"px"},1000,function () {
                //calculate the distance of moving
                var dist = $(".new_platform").eq(num+1).offset().left-w;
                if((len+10)<dist||len>dist+w){
                    //fall
                    $(".man img").addClass("fall");
                    setTimeout(function () {
                        var msg="Game over! Your score is "+score;
                        alert(msg);
                        clear();
                    }, 500);
                }else{
                    $(".man").find("img").attr("src","imgs/man.png").css("left","0").hide();
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
                        running = false;
                    })
                }
            })
        },500)
    }

    function clear() {
        $(".platform").empty();
        stop = true;
        running = false;
        num=0;
        //update the score
        if(score>highest_score)
            highest_score=score;
        rounds+=1;
        //document.cookie="highest_score="+highest_score+";rounds="+rounds;
        // write to the cookies
        writeCookie("highest_score",highest_score,1);
        writeCookie("rounds",rounds,1);
        console.log(document.cookie);
        score = 0;
        level = 1;
        width = 100;
        build();
        update();
        $(".man img").attr("src","imgs/man.png").css("left","0px").removeClass("fall");
        $(".rod").removeClass("fall").width("0px");
        $(".platform").css("left","0");

    }
});

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

function writeCookie(name,value,days) {
    var expires = ''
    var data = new Date()
    data.setTime(data.getTime() + (days*24*60*60*1000))
    expires = ";expires=" + data.toUTCString()
    document.cookie = name + "=" + value + expires + ";";
}