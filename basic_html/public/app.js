var page_data={music: new Array(), movie: new Array()};


function toggleSubContent()
{
    $("#sub_content").toggleClass("resize");
    $("#details_holder").toggleClass("resize");
    $("#content_list_holder").toggleClass("resize");
}

function addMovies(data_source)
{
  if ($("ul#content_list").length>1)
  {
    return;
  }
  for(var i=0;i<data_source.length;i++)
  {
    $("ul#content_list").append('<div class="li_element_holder"><li class="title_list_element"><img src='+data_source[i].img+'><span class="title">'+data_source[i].title+'</span></div></li>');
  }
}

function removeMovies()
{
    $("ul#content_list").empty();
}

function toggleMovies()
{
    if ($("#music").hasClass("hidden") && $("#download").hasClass("hidden"))
    {
      addMovies(page_data.movie);
      $('li.title_list_element').click(function () {
        $(this).animate({zoom: 2}, 500, 'linear').animate({zoom: 1}, 500, 'linear');
        $('#detail').remove();
        var title=this.innerText;
        var image=$(this)[0].firstChild.src;
        var film_instance="-";
        for(var i=0;i<page_data.movie.length;i++)
        {
          if (title==page_data.movie[i]["title"])
          {
            film_instance=page_data.movie[i];
            var plot=film_instance["plot"];
            var genre=film_instance["genre"];
            var length=film_instance["length"];
            var director= film_instance["director"];
            var actors=film_instance["actors"];
            $('#details_holder').append('<div id="detail">'+
                                          '<img id="img" src='+image+'>'+
                                          '<div id="detail_title">'+title+'</div>'+
                                          '<div id="plot">'+plot+'</div>'+
                                          '<div id="sub_info">'+
                                          '<div id="director_header">Director:</div>'+
                                          '<div id="director">'+director+'</div>'+
                                          '<div id="actor_header">Actors:</div>'+
                                          '<div id="actor">'+actors+'</div>'+
                                          '<div id="genre">Genre: '+genre+'</div>'+
                                          '<div id="l">Length: '+length+" mins"+'</div>'+
                                          '</div>'+
                                          '</div>'
                                          );
          }
        }
      });
    }
    else
    {
      removeMovies();
      $('#detail').remove();
    }
}

$( document ).ready(function() 
{
  
    /*var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'me',
      password : 'secret'
    });

    connection.connect();*/

    var socket = io.connect('http://localhost:8080');
    socket.on('connect', function(data){
      socket.emit('remote_loading');
    });
    socket.on('movie_entry', function(data) {
      console.log(data.data);
      page_data.movie.push(data.data);
    });
    
    //page_data.movie.push(film_instance);
    //for(var i=0;i<20;i++)
    //{
    //$("#content_list").append('<li class="title_list_element"><span class="title">Title</span></li>');
    //}
    $(".menu_element").click(function () {
      switch(this.id)
      {
        case "music":
          $("#menu").toggleClass("resize");
          toggleSubContent();
          $("#search").addClass("hidden");
          $(".menu_element").toggleClass("hidden");
          $("#music").removeClass("hidden");
          break;
        case "movie":
          $("#menu").toggleClass("resize");
          toggleSubContent();
          $("#search").addClass("hidden");
          $(".menu_element").toggleClass("hidden");
          $("#movie").removeClass("hidden");
          toggleMovies();
          break;
        case "download":
          $("#menu").toggleClass("resize");
          $("#sub_content").toggleClass("resize");
          $("#details_holder").removeClass("resize");
          $("#content_list_holder").removeClass("resize");
          $("#search").toggleClass("resize");
          $(".menu_element").toggleClass("hidden");
          $("#download").removeClass("hidden");
          $("#search").removeClass("hidden");
          break;
        case "settings":
          $("#menu").toggleClass("resize");
          $("#sub_content").toggleClass("resize");
          $(".menu_element").toggleClass("hidden");
          $("#settings").removeClass("hidden");
          break;
        default:
          break;
      }
    });
    
    $('#search_form input[type="text"]').click(function () {
      $("#keyboard").toggleClass("hidden");
    });
});
