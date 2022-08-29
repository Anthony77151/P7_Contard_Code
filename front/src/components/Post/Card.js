import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../../actions/post.actions';
import { dateParser, isEmpty } from '../Utils';
import CardComment from './CardComment';
import Delete from './Delete';
import LikeButton from './LikeButton';

const Card = ({ post }) => {
    // is loading permet d'avoir un petit loader le temps que les posts chargent
    const [isLoading, setIsLoading] = useState(true);
    // update le post
    const [isUpdated, setIsUpdated] = useState(false);
    const [textUpdate, setTextUpdate] = useState(null);
    // affiche les commentaires
    const [showComments, setShowComments] = useState(false);
    
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const updateItem = () => {
        if (textUpdate) {
            dispatch(updatePost(post._id, textUpdate))
        }
        setIsUpdated(false);
    }

    // si on à les post on enlève le loader
    useEffect(() => {
        !isEmpty(usersData[0]) && setIsLoading(false);
    }, [usersData]);

    return (
        <li className='card-container' key={post._id}>
            {isLoading ? (
                <i className='fas fa-spinner fa-spin'></i>
            ) : (
                <>
                    <div className='card-left'>
                        <img src='./img/profil-picture.webp' alt='profil'></img>
                    </div>
                    <div className='card-right'>
                        <div className='card-header'>
                            <div className='pseudo'>
                                <h3>
                                    {!isEmpty(usersData[0]) && usersData.map((user) => {
                                        if (user._id === post.posterId) return user.pseudo;
                                        else return null
                                    }).join('')}
                                </h3>
                            </div>
                            <span>{dateParser(post.createdAt)}</span>
                        </div>
                        {isUpdated === false && <p>{post.message}</p>}
                        {isUpdated && (
                            <div className='update-post'>
                                <textarea
                                    defaultValue={post.message}
                                    onChange={(e) => setTextUpdate(e.target.value)}
                                />
                                <div className='button-container'>
                                    <button className='btn' onClick={updateItem}>
                                        Valider modification
                                    </button>
                                </div>
                            </div>
                        )}
                        {post.picture && (
                            <img src={post.picture} alt="card-pic" className='card-pic'></img>
                        )}
                        {post.video && (
                            <iframe
                                width='500'
                                height='300'
                                src={post.video}
                                frameBorder='0'
                                allow='accelerometer; autoplay; encrypted-media;clipboard-crite; gyroscope; picture-in-picture'
                                allowFullScreen
                                title={post._id}
                            ></iframe>
                        )}
                        {(userData._id === post.posterId || userData.isAdmin === true) && (
                            <div className='button-container'>
                                <div onClick={() => setIsUpdated(!isUpdated)}>
                                    <img src='./img/icons/edit.svg' alt="edit"></img>
                                </div>
                                <Delete id={post._id}/>
                            </div>
                        )}
                        <div className='card-footer'>
                            <div className='comment-icon'>
                                {/* affiche les commentaires lors du clique (ou les caches si déjà affiché)  */}
                                <img onClick={() => setShowComments(!showComments)} src="./img/icons/message1.svg" alt='comment'></img>
                                <span>{post.comments.length}</span>
                            </div>
                            <LikeButton post={post} />
                        </div>
                        {showComments && <CardComment post={post} />}
                    </div>
                </>
            )}
        </li>
    )
}

export default Card