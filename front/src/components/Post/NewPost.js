import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, timestampParser } from '../Utils';
import { NavLink } from 'react-router-dom'
import { addPost, getPosts } from '../../actions/post.actions';

const NewPost = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [postPicture, setPostPicture] = useState(null);
    const [video, setVideo] = useState('');
    const [file, setFile] = useState();
    const userData = useSelector((state) => state.userReducer);
    const error = useSelector((state) => state.errorReducer.postErrors)
    const dispacth = useDispatch();


    const handlePost = async () => {
        if (message || postPicture || video) {
            const data = new FormData();
            data.append('posterId', userData._id);
            data.append('message', message);
            if (file) data.append('file', file);
            data.append('video', video);

            await dispacth(addPost(data));
            dispacth(getPosts());
            cancelPost('');

        } else {
            alert("Veuillez entrer un message")
        }
    }

    const handlePicture = (e) => {
        setPostPicture(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]);
        setVideo('');
    }

    useEffect(() => {
        if (!isEmpty(userData)) setIsLoading(false);

        const handleVideo = () => {
            let findLink = message.split(' ');
            for (let i = 0; i < findLink.length; i++) {
                if (findLink[i].includes('https://www.youtube') || findLink[i].includes('https://.youtube')) {
                    let embed = findLink[i].replace('watch?v=', 'embed/')
                    setVideo(embed.split('&')[0])
                    findLink.splice(i, 1);
                    setMessage(findLink.join(" "))
                    setPostPicture('');
                }
            }
        }
        handleVideo();
    }, [userData, message, video])


    const cancelPost = () => {
        setMessage('');
        setPostPicture('');
        setVideo('');
        setFile('');
    }

    return (
        <div className='post-container'>
            {isLoading ? (
                <i className='fas fa-spinner fa-spin'></i>
            ) : (
                <>
                    <div className='user-info'>
                        <NavLink exact to="/profil">
                            <img src='./img/profil-picture.webp' alt='profil'></img>
                        </NavLink>
                    </div>
                    <div className='post-form'>
                        <textarea
                            name='message'
                            id='message'
                            placeholder='Quoi de neuf ?'
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                        />
                        {/* En cas de message / image ou vidéo affiche une prévisualisation du post */}
                        {message || postPicture || video.length > 20 ? (
                            <li className="card-container">
                                <div className="card-left">
                                    <img src='./img/profil-picture.webp' alt="user-pic" />
                                </div>
                                <div className="card-right">
                                    <div className="card-header">
                                        <div className="pseudo">
                                            <h3>{userData.pseudo}</h3>
                                        </div>
                                        <span>{timestampParser(Date.now())}</span>
                                    </div>
                                    <div className="content">
                                        <p>{message}</p>
                                        <img src={postPicture} alt="" />
                                        {video && (
                                            <iframe
                                                src={video}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title={video}
                                            ></iframe>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ) : null}
                        <div className='footer-form'>
                            <div className='icon'>
                                {isEmpty(video) && (
                                    <>
                                        <img src='./img/icons/picture.svg' alt='img'></img>
                                        <input  type='file' id='file-upload' name='file' accept=".jpg, .jpeg, .png"
                                            onChange={(e) => handlePicture(e)} />
                                        <label for='file-upload'>t</label>
                                    </>
                                )}
                                {video && (
                                    <button onClick={() => setVideo('')}>Supprimer vidéo</button>
                                )}
                            </div>
                            {!isEmpty(error.format) && <p>{error.format}</p>}
                            {!isEmpty(error.maxSize) && <p>{error.maxSize}</p>}
                            <div className='btn-send'>
                                {message || postPicture || video.length > 20 ? (
                                    <button className='cancel' onClick={cancelPost}>Annuler</button>
                                ) : null}
                                <button className='send' onClick={handlePost}>Envoyer</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default NewPost