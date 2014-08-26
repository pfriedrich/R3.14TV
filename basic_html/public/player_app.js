var is_playing=false;
var sub_on=false;
var current=0;

var length=113;
var title="Edge of Tomorrow";

function toHHMMSS(input) {
    var sec_num = parseInt(input, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

function vol_up()
{
  
}

function vol_down()
{
  
}

function toggle_subtit()
{
    if (sub_on)
    {
      
    }
    else
    {
      
    }
}

function forward()
{
  current=current+5;
  play_movie();
}

function step_forward()
{
  current=current+60;
  play_movie();
}

function back()
{
  current=current-5;
  play_movie();
}

function step_back()
{
  current=current-60;
  play_movie();
}


function play_movie()
{
  if (is_playing)
  {
    current=current+1;
    if (current>=length)
    {
      current=length;
    }
  }
  if (current<0)
  {
    current=0;
  }
  $('progress').attr('value',current);
  $('#elapsed_time').text(toHHMMSS(length)+"/"+toHHMMSS(current.toString()));
}

$( document ).ready(function() 
{
  current=0;
  play_movie();
  $('#title').text(title);
  /*must remove*/
  $('progress').attr('max',length);
  $('progress').attr('value',current);
  $('.back').click(back);
  $('.back_jump').click(step_back);
  $('.forw').click(forward);
  $('.forw_jump').click(step_forward);
  
  $('.voldown').click(vol_down);
  $('.volup').click(vol_up);
  $('.subtitle').click(toggle_subtit);
  $('#icon.play').click(function () {
    $('#icon.play').toggleClass('pause');
    if ($('#icon.play').hasClass('pause'))
    {
      is_playing=true;
    }
    else
    {
      is_playing=false;
    }
    });
  window.setInterval(play_movie,1000);
});
