var page_data={music: new Array(), movie: new Array()};
var film_instance={title:"Edge of tomorrow",
                    image:"http://ia.media-imdb.com/images/M/MV5BMTY5MjEzNjY3NV5BMl5BanBnXkFtZTgwODgzMjAwMjE@._V1_SX214_AL_.jpg",
                    director: "Doug Liman",
                    plot:"An officer finds himself caught in a time loop in a war with an alien race. His skills increase as he faces the same brutal combat scenarios, and his union with a Special Forces warrior gets him closer and closer to defeating the enemy.",
                    actors: new Array("Tom Cruise", "Emily Blunt", "Bill Paxton"),
                    genre: "sci-fi",
                    length: 113,
                    path: "notset",
                    subtitle_path: "notset"
};

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
    $("ul#content_list").append('<li class="title_list_element"><img src='+data_source[i].image+'><span class="title">'+data_source[i].title+'</span></li>');
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
        var title=this.innerText;
        var image=$(this)[0].firstChild.src;
        /*get data from db, using title as key*/
        var plot=film_instance.plot;
        var genre=film_instance.genre;
        var length=film_instance.length;
        var actors=film_instance.actors.join(", ");
        $('#details_holder').append('<div id="detail">'+
                                      '<img id="img" src='+image+'>'+
                                      '<div id="detail_title">'+title+'</div>'+
                                      '<div id="plot">'+plot+'</div>'+
                                      '<div id="actor_header">Actors:</div>'+
                                      '<div id="actor">'+actors+'</div>'+
                                      '<div id="genre">'+genre+'</div>'+
                                      '<div id="l">length:'+length+'</div>'+
                                    '</div>');
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
    page_data.movie.push(film_instance);
    page_data.movie.push(film_instance);
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
