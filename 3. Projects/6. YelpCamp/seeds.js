var mongoose = require('mongoose'),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user");

var seeds =
    [{ name: "River Lake", image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", createdBy: { username: "Pikachu" }, price: "10.00" },
    { name: "Mountain Hill", image: "https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", createdBy: { username: "Pikachu" }, price: "5.00" },
    { name: "Castle Rock", image: "https://images.unsplash.com/photo-1465408687720-1d566d7753ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1955&q=80", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", createdBy: { username: "Pikachu" }, price: "20.00" },
    { name: "Sand Land", image: "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", createdBy: { username: "Pikachu" }, price: "15.00" },
    { name: "Water Valley", image: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1606&q=80", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", createdBy: { username: "Pikachu" }, price: "30.00" },
    { name: "Sunset Wind", image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", createdBy: { username: "Pikachu" }, price: "25.00" }];


async function seedDB() {
    try {
        await Campground.remove({});
        console.log('Campgrounds removed');
        await Comment.remove({});
        console.log('Comments removed');


        for (const seed of seeds) {
            let campground = await Campground.create(seed);
            console.log('Campground created');

            let comment = await Comment.create(
                {
                    text: 'Pika Pika!',
                    author: {
                        username: "Pikachu",
                        image: "https://i.ebayimg.com/images/g/JQkAAOSwynRZwKaM/s-l400.jpg"
                    }
                }
            );
            console.log('Comment created');
            comment.save();
            campground.comments.push(comment);
            campground.save();
            console.log('Comment added to campground');
        }
    } catch (err) {
        console.log(err);
    }

}

module.exports = seedDB;
