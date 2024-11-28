import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

function ArticleId() {
  const [artcile, setArticle] = useState([]);
  const [comments, setComments]= useState([]);
  useEffect(()=>{
    const fetchData=async()=>{
      await fetchArticle()
    }
  })
  const location = useLocation();
  const params = useParams();
  async function fetchArticle(){

  }
  
  console.log(location, params.articleId);
  return (
    <div id="full-page" className="bg-gray-100">
      <div id="container" className="mx-20 outline-dotted">
        <div id="" className="grid grid-cols-4">
          <div id="left-side" className="col-span-3 outline-dotted">
          </div>
          <div id="right-side" className="col-span-1 outline-dotted">
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleId;
