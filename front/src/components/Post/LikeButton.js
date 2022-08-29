import React, { useContext, useEffect, useState } from 'react'
import { UidContext } from '../AppContext';
import { useDispatch } from 'react-redux';
import { likePost, unlikePost } from '../../actions/post.actions';

// import d'un bibliothèque pour gérer les popups
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const LikeButton = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const uid = useContext(UidContext);
    const dispatch = useDispatch();

    const like = () => {
        dispatch(likePost(post._id, uid))
        setLiked(true);
    }
    const unlike = () => {
        dispatch(unlikePost(post._id, uid))
        setLiked(false);
    }

    useEffect(() => {
        // on va cherché à savoir si l'id de l'utilisateur est dans le tableau des likes
        if (post.likers.includes(uid)) setLiked(true)
        else setLiked(false)
    }, [uid, post.likers, liked]);


    return (
        <div className='like-container'>
            {uid === null && (
                <Popup trigger={<img src="./img/icons/heart.svg" alt="like"></img>} position={['bottom center', 'bottom right', 'bottom left']}
                    closeOnDocumentClick>
                    <div>Connectez-vous pour aimer un post</div>
                </Popup>
            )}
            {uid && liked === false && (
                <img src="./img/icons/heart.svg" alt="like" onClick={like}></img>
            )}
            {uid && liked && (
                <img src="./img/icons/heart-filled.svg" alt="unlike" onClick={unlike}></img>
            )}
            <span>{post.likers.length}</span>
        </div>
    )
}

export default LikeButton