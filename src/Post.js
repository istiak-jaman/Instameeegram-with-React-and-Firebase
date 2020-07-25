import React, {useState, useEffect} from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import SendIcon from '@material-ui/icons/Send';
import firebase from 'firebase';

function Post({postId, username, user, caption, imageUrl}) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });

        }

        return () => {
            unsubscribe();
        };

    }, [postId]);

    const postComment = (e) => {
        e.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">
            {/* header ->avatar + username */}
            <div class="post__header">
                <Avatar alt={username}
                src="/static/images/avatar/1.jpg" 
                className="post__avatar" />
                <h3>{username}</h3>
            </div>
            
            

            {/* Image  */}
            <img className="post__image" src={imageUrl} alt="" />

            {/* Username + Caption */}
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>

            {/* comments */}
            
            <div className="post__comments">
                {comments.map((comment) => (
                    <p><strong>{comment.username}</strong> {comment.text} </p>
                )) }

            </div>

            {user && (
              <form className="post__commentBox">
                <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    disabled={!comment}
                    className="post__button"
                    type="submit"
                    onClick={postComment}
                >
                <SendIcon fontSize="small" />
                </button>

              </form>
            )}
            
            

        </div>
    )
}

export default Post
