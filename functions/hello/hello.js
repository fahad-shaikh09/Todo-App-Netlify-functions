const { ApolloServer, gql } = require('apollo-server-lambda')

var faunadb = require("faunadb")
q = faunadb.query

const typeDefs = gql`
  type Query {
    hello: String
    allTodos: [Todos]
  }

  type Todos {
    id: ID
    title: String!
    desc: String!
  }

  type Mutation {
    addTodos(title: String, desc: String): Todos
  } 
`

// const Todos = [
//   { id: 1, title: 'Shopping', desc: "buying clothes" },
//   { id: 2, title: 'Outing', desc: "for spending time" },
//   { id: 3, title: 'Walking', desc: "morning walk" },
// ]

const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return 'Hello, world!'
    },
    allTodos: async (root, args, context) => {

      try{
        var adminClient = new faunadb.Client({secret: "fnAD478qs6ACAZU-GkpG0-zvvTWwyu_8UAsM2hDi"})
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('desc'))),  //desc is index in faunadb
            q.Lambda(x => q.Get(x))
          )
        )
        console.log(" result.data in hello function.js ==>>", result.data)
        return result.data.map(d=>{
          return {id: d.ts,
          title:d.data.title,
          desc:d.data.desc}
        })

      }catch(err){
        console.log("error from function:", err)
      }

      return Todos
    },
  },

  Mutation:{
    addTodos: async (_, {title, desc}) => {
      console.log("Title:", title)
      console.log("Desc:", desc)
        try{
        var adminClient = new faunadb.Client({secret: "fnAD478qs6ACAZU-GkpG0-zvvTWwyu_8UAsM2hDi"})

          const result = await adminClient.query(
            q.Create(
              q.Collection("todos"),{
                data: {
                  title,
                  desc
                }
              }
            )
          )
        return result.data
        }
        catch(err){
          console.log("error in mutation AddTodos===========", err)
        }

      }

  } 

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
