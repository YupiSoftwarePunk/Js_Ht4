class Post {
    title;
    content;
    authorId;
    tags;

    constructor(title, content, authorId, tags = []) {
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.tags = tags;
        this.date = new Date();
    }
}