 const posts = [
    {
        _id: '67bb5874b69b67321c767318',
        caption: 'this is a post',
        image: 'https://res.cloudinary.com/duthu0r3j/image/upload/…4/QuickChat/download%20%2813%29-1740331120750.jpg',
        author: '67ba9e258c275c5462ff17cc',
        likes: Array(3),
    },
    {
        _id: '67c469350339670f9c73a320',
        caption: 'it is a second post',
        image: 'https://res.cloudinary.com/duthu0r3j/image/upload/v1740925238/QuickChat/gndec_logo-1740925159914.png',
        author: '67ba9e258c275c5462ff17cc',
        likes: Array(3),
    }
];

const postId = '67c469350339670f9c73a320'; // Example postId

const foundPost = posts.find(post => post._id === postId);

console.log(foundPost);
