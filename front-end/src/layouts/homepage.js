import React from 'react'

import Post from '../components/feed/post/post';
import posts from '../components/feed/posts';



class Homepage extends React.Component {
    postHandler(posts) {
        console.log(posts.posts);
        return posts.posts.map((post) => {
            return (
                <div>
                    <Post
                        post={post}
                    />
                </div>
            )
        }
        );
    }


    render() {
        return (
            <div>
                {this.postHandler(posts)}
            </div>
        );
    }


}

export default Homepage;