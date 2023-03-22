import Comment from './Comment';
import {useEffect, useState} from 'react';
const SERVER_ADDRESS = "http://localhost:4000";

const Comments = ({ selectedUserId, socket }) => {
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState('');



    const sendComment = async () => {

        const response = await fetch(`${SERVER_ADDRESS}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                body: input,
                authorId: selectedUserId
            })
        });

        if(response.ok) {
            setInput('');
        }
    }

    //Useless
    const fetchComments = async () => {
        const response = await fetch(`${SERVER_ADDRESS}/comments`);
        const comments = await response.json();
        setComments(comments);
    }

    useEffect(() => {   
        fetchComments();
    }, []);

    useEffect(() => {
        socket.on("new-comment", ({comment}) => {
            setComments((comments) => [...comments, comment]);
        });

        return () => {
            socket.off("new-comment");
        };
    }, [socket, setComments, selectedUserId]);

    return (
        <div className="Comments">
            <h3 className="Comments-title">
                {comments.length == 0 ? '0 commentaire' :
                comments.length == 1 ? '1 commentaire' : 
                `${comments.length} commentaires`}
            </h3>
            <div className="Comments-list">
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment}  
                    isYou={selectedUserId === comment.author.id}/>
                ))}
            </div>

            <div className="Comments-box">
                <form 
                    onSubmit={
                    (e) => {
                        e.preventDefault();
                        sendComment();
                    }}>
                    <textarea   
                        className="Comments-box__input"
                        name="body"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button className="Comments-box__button" 
                        disabled={input.length === 0 || selectedUserId === ""}
                        type="submit">
                        Envoyer 
                    </button>

                </form>
            </div>
        </div>
    );
}


export default Comments;