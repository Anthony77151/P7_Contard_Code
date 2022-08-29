import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addComment, getPosts } from '../../actions/post.actions';
import { timestampParser } from '../Utils';
import ManageComment from './ManageComment';

const CardComment = ({ post }) => {
    const [text, setText] = useState("");

    // const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const handleComment = (e) => {
        e.preventDefault();
        if (text)  {
            dispatch(addComment(post._id, userData._id, text, userData.pseudo))
                .then(() => dispatch(getPosts()))
                .then(() => setText(''));
        }
    }

    return (
        <div className='comments-container'>
            {post.comments.map((comment) => {
                return (
                    <div className={comment.commenterId === userData._id ? "comment-container client" : "comment-container"} key={comment._id}>
                        <div className='left-part'>
                            <img src='../../img/profil-picture.webp' alt='profil'></img>
                        </div>
                        <div className='right-part'>
                            <div className='comment-header'>
                                <div className='pseudo'>
                                    <h3>{comment.commenterPseudo}</h3>
                                </div>
                                <span>{timestampParser(comment.timestamp)}</span>
                            </div>
                            <p>{comment.text}</p>
                            <ManageComment comment={comment} postId={post._id}/>
                        </div>
                    </div>
                )
            })}
            {userData._id && (
                <form action='' onSubmit={handleComment} className="comment-form">
                    <input type='text' name="text" onChange={(e) =>
                        setText(e.target.value)} value={text} placeholder='Laisser un commentaire'></input>
                    <br/>
                    <input type="submit" value="Envoyer"></input>
                </form>
            )}
        </div>
    )
}

export default CardComment