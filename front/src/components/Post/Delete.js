import React from 'react'
import { useDispatch } from 'react-redux'
import { deletePost } from '../../actions/post.actions';

const Delete = (props) => {
    const dispatch = useDispatch();

    const deleteQuote = () => {
        dispatch(deletePost(props.id))
    }

    return (
        // permet de mettre un pop-up de confirmation
        <div onClick={() => {
            if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
                deleteQuote()
            }
        }}>
            <img src="./img/icons/trash.svg" alt='trash'></img>
        </div>
    )
}

export default Delete