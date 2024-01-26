import React, { Component } from "react";
import axios from "axios";

//axios.defaults.baseURL = "https://goiteens-booking-system.herokuapp.com/";
axios.defaults.baseURL = "https://booking-goiteens.netlify.app";
let path = "https://booking-goiteens.netlify.app/manager/"
let endpath = "/consultations/"

const ArticleList = ({ articles }) => (
    <ul>
      {articles.map(({ managers, time }) => (
        <li>
            
     
      {time} | {  managers.length > 0 ? managers.map(el => (<span><a href = {path+el.manager_id+endpath} target = '_blank'>{el.name}</a> <span> | </span>  </span> )) : "Немає вільних менеджерів"  }
     
          
        </li>
      ))}
    </ul>
  );


class Avaliable extends Component {

    state = {
        articles: [],
      };

    async componentDidMount() {
        
        {console.log("/avaliable_managers_list/14/6");}
        const response = await axios.get("/avaliable_managers_list/14/6");
        this.setState({ articles: response.data.data });
        // console.log(response.data.data);
        
     }
  
    render() {
        const { articles } = this.state;
        return (
          <div>
           { articles.length > 0 ? <ArticleList articles={articles} /> : "null"}
          </div>
        );
    }
  }

export default Avaliable;