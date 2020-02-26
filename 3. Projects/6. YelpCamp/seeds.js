var mongoose = require('mongoose'),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data =
    [{ name: "River Lake", image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", createdBy: { username: "Ned Flanders" } },
    { name: "Mountain Hill", image: "https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", createdBy: { username: "Ned Flanders" } },
    { name: "Castle Rock", image: "https://images.unsplash.com/photo-1465408687720-1d566d7753ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1955&q=80", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", createdBy: { username: "Ned Flanders" } },
    { name: "Sand Land", image: "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", createdBy: { username: "Ned Flanders" } },
    { name: "Water Valley", image: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1606&q=80", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", createdBy: { username: "Ned Flanders" } },
    { name: "Sunset Wind", image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", createdBy: { username: "Ned Flanders" } }];

function seedDB() {
    // Remove any data from the database
    Campground.remove({}, (err) => {
        if (err) {
            console.log("Error while dropping `campgrounds` collection.");
        } else {
            console.log("-> seedDB _ `campgrounds` collection dropped.");
            // Insert the default campgrounds  seeding values
            data.forEach(seedCampground => {
                Campground.create(seedCampground, (err, campground) => {
                    if (err) {
                        console.log("Error while inserting `campgrounds` data.");
                    }
                    else {
                        console.log("-> seedDB _ register `campgrounds` added.");
                        // Insert the default comments seeding values
                        Comment.create({
                            text: "This place is great, but I wish there was internet",
                            author: {
                                username: "Homer Simpson",
                                image: "https://www.grupoblc.com/wp-content/uploads/2013/10/images_curiosita_homer.jpg"
                            }
                        }, (err, comment) => {
                            if (err) {
                                console.log("Error while inserting `comment` data to `campground`");
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("-> seedDB _ register `comment` added.");
                            }
                        });
                    }
                })
            });
        }
    });

}

module.exports = seedDB;
