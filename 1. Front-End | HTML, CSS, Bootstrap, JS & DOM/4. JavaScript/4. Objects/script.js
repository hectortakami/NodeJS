var theGodfather = {
    title: "The Godfather",
    director: "Francis Ford Coppola",
    duration: "2h 55min",
    genres: ["Drama", "Comedy"],
    getCategories: function () {
        this.genres.forEach(category => {
            console.log(" * " + category);
        });
    },
    synopsis: "The Godfather \"Don\" Vito Corleone is the head of the Corleone mafia family in New York. He is at the event of his daughter's wedding.",
};

var forrestGump = {
    title: "Forrest Gump",
    director: "Robert Zemeckis",
    duration: "2h 22min",
    genres: ["Drama", "Romance"],
    getCategories: function () {
        this.genres.forEach(category => {
            console.log(" * " + category);
        });
    },
    synopsis: "Forrest Gump is a simple man with a low I.Q. but good intentions. He is running through childhood with his best and only friend Jenny.",
}

var backToTheFuture = {
    title: "Back to the Future",
    director: "Robert Zemeckis",
    duration: "1h 56min",
    genres: ["Adventure", "Comedy", "Sci-fi"],
    getCategories: function () {
        this.genres.forEach(category => {
            console.log(" * " + category);
        });
    },
    synopsis: "Marty McFly, a typical American teenager of the Eighties, is accidentally sent back to 1955 in a plutonium-powered DeLorean \"time machine\" invented by a slightly mad scientist."
};


var movies = [theGodfather, forrestGump, backToTheFuture];

movies.forEach(film => {
    console.log("**********************************");
    console.log(film.title);
    console.log("Directed by: " + film.director);
    console.log("Generes: ");
    film.getCategories();
    console.log("Storyline: " + film.synopsis);
    console.log("Duration: " + film.duration);
    console.log("**********************************\n\n\n");
});


