import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, editComment } from '../../actions/post.actions';
import { UidContext } from '../AppContext';

const ManageComment = ({ comment, postId }) => {
    const [isAuthor, setIsAuthor] = useState(false);
    const [edit, setEdit] = useState(false);
    const [text, setText] = useState('');
    const uid = useContext(UidContext);
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userReducer);


    const handleEdit = (e) => {
        e.preventDefault();
        if (text) {
            dispatch(editComment(postId, comment._id, text));
            setText('');
            setEdit(false);
        }
    }

    const handleDelete = () => {
        dispatch(deleteComment(postId, comment._id))
    }

    useEffect(() => {
        const checkAuthor = () => {
            if (uid === comment.commenterId || userData.isAdmin === true) {
                setIsAuthor(true);
            }
        }
        checkAuthor();
    }, [uid, comment.commenterId, userData.isAdmin])

    return (
        <div className='edit-comment'>
            {(isAuthor || userData.isAdmin === true) && edit === false && (
                <span onClick={() => setEdit(!edit)}>
                    <img src='./img/icons/edit.svg' alt="edit-comment"></img>
                </span>
            )}
            {(isAuthor || userData.isAdmin === true) && edit && (
                <form action="" onSubmit={handleEdit} className="edit-comment-form">
                        <label htmlFor='text' onClick={() => setEdit(!edit)}>Editer</label>
                    <br/>
                        <input type='text' name='text' onChange={(e) => setText(e.target.value)} defaultValue={comment.text}></input>
                    <br/>
                    <div className='btn'>
                        <span onClick={() => {
                            if (window.confirm("Voulez-vous supprimer ce commentaire ?")) {
                                handleDelete();
                            }
                        }}>
                            <img src="./img/icons/trash.svg" alt='delete'></img>
                        </span>
                    <input type="submit" value='Valider'></input>
                    </div>
                </form>
            )}
        </div>
    )
}

export default ManageComment