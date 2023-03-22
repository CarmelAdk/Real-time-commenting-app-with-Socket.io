const {findUserById} = require("./users");

let comments = [];
let lastId = 1;

const getCommentWithAuthor = (comment) => {
    return {
        ...comment,
        author : findUserById(comment.authorId),
    };
};

const createComment = (params) => {

    const comment = {
        id: lastId++,
        body: params.body,
        authorId: params.authorId,
        insertedAt: new Date().toISOString(),
    };

    comments.push(comment);

    return getCommentWithAuthor(comment);
};

const listComments = () => {
    return comments.map(getCommentWithAuthor);
};

module.exports = {createComment, listComments};