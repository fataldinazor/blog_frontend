import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function Articles() {
  const [articles, setArticles] = useState();
  const {auth}=useAuth()
  useEffect(() => {
    fetchAllArticles();
  }, []);

  async function fetchAllArticles() {
    const url = `http://localhost:3000/api/v1/posts`;
    const response = await fetch(url,{
      headers:{
        Authorization: `Bearer ${auth.token}` 
      }
    });
    const result = await response.json();
    console.log(result);
  }
  return <div></div>;
}

export default Articles;
