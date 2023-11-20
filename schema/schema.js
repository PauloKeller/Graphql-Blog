const Post = require('../models/post')
const Author = require('../models/author')
const Comment = require('../models/comment')
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = require('graphql')

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return Post.find({ authorId: parent.id })
            }
        }
    })
})

const PostType = new GraphQLObjectType({
    name:'Post',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        likes: { type: GraphQLInt },
        body: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorId)
            }
        }, 
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args){
                return Comment.find({ postId: parent.id })
            }
        }
    })
})

const CommentType = new GraphQLObjectType({
    name:'Comment',
    fields: () => ({
        id: { type: GraphQLID },
        body: { type: GraphQLString },
        post: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return Post.findById(parent.postId)
            }
        },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorId)
            }
        }
    })
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        Author: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Author.findById(args.id)
            }
        },
        Authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find()
            }
        },
        post: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Post.findById(args.id)
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find()
            }
        },
        comment: {
            type: CommentType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Comment.findById(args.id)
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args) {
                return Comment.find()
            }
        },
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                return author.save()
            }
        },
        createPost: {
            type: PostType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                likes: { type: new GraphQLNonNull(GraphQLInt) },
                body: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let post = new Post({
                    title: args.title,
                    body: args.body,
                    likes: args.likes,
                    authorId: args.authorId
                })
                return post.save()
            }
        },
        createComment: {
            type: CommentType,
            args: {
                body: { type: new GraphQLNonNull(GraphQLString) },
                postId: { type: new GraphQLNonNull(GraphQLID) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let comment = new Comment({
                    body: args.body,
                    postId: args.postId,
                    authorId: args.authorId
                })
                return comment.save()
            }
        },
        deleteComment: {
            type: CommentType,
            args: {
                commentId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Comment.deleteOne({ _id: args.commentId })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
})