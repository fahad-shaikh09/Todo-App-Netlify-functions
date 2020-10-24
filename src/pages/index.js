import React from "react"

// import {useEffect, useState} from "react"
import { useMutation, useQuery } from "@apollo/client"
import gql from "graphql-tag"


let titleField;
let descField;


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
    id
  }
}
`


export default function Home() {

  const {error, loading, data} = useQuery(GET_TODOS)
  const [addTodos] = useMutation(ADD_TODO)

  console.log("Data in index.js ==>>:", data)
  console.log("Error index.js ==>>:", error)

  const handleSubmit = () => {
    console.log("titleField: ", titleField.value)
    console.log("descField: ", descField.value)
      addTodos({
        variables:{
          title: titleField.value,
          desc: descField.value
        }
      })
  }

  if(loading) return <h1> Loading</h1> 

  if(error) return <h1> {error}</h1> 

  return <div>

      <h1> Todo App</h1>

      <h2>Enter Title</h2>  
      <input type="text" ref={node => titleField=node} />

      <h2>Enter Desc</h2>  
      <input type="text" ref={node => descField=node} />
      < br />

      <button onClick={handleSubmit}>Add Todo item </button>
  </div>


}
