import React from "react"
import { useMutation, useQuery } from "@apollo/client"
import gql from "graphql-tag"
import "./../styles/styles.css"

const GET_TODOS = gql`
  {
    allTodos {
      id
      title
      desc
    }
  }
`

const ADD_TODO = gql`
  mutation addTodos($title: String, $desc: String){
   addTodos(title: $title, desc: $desc){
    title,
    desc,
    id
  }
}
`

export default function Home() {

  let titleField;
  let descField;

  const { error, loading, data } = useQuery(GET_TODOS)
  const [addTodos] = useMutation(ADD_TODO)

  console.log("Data in index.js ==>>:", data)
  console.log("Error index.js ==>>:", error)

  const handleSubmit = () => {
    console.log("titleField: ", titleField.value)
    console.log("descField: ", descField.value)
    addTodos({
      variables: {
        title: titleField.value,
        desc: descField.value
      },
      refetchQueries: [{ query: GET_TODOS }]
    }
    )
  }

  if (loading) return <h1> Loading</h1>

  if (error) return <h1> {error}</h1>

  return <div className="main">

    <h1> Todo App</h1>

    <h2>Enter Title</h2>
    <input type="text" ref={node => titleField = node} />

    <h2>Enter Desc</h2>
    <input type="text" ref={node => descField = node} />

    < br />
    <button onClick={handleSubmit}>Add Todo item </button>
    < br />
    < br />

    <h3> Data from Server </h3>
    <div className="table">
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>TITLE</th>
            <th>DESC</th>
          </tr>
        </thead>

        <tbody>
          {data.allTodos.map(d => {
            return (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.title} </td>
                <td>{d.desc} </td>
              </tr>

            )
          })}

        </tbody>
      </table>
    </div>
  </div>
}
