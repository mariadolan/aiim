import { create } from "zustand";
import axios from "axios";
import { useEffect } from "react";

const BASE_URL = "https://aiim.xandervarga.me/";

const useArticleStore = create(() => ({
  articles: null,
}));

const useArticles = () => {
  const articles = useArticleStore((state) => state.articles);

  useEffect(() => {
    if (!articles) {
      console.log("getting articles");

      axios
        .get(`${BASE_URL}article`)
        .then((res) => useArticleStore.setState({ articles: res.data }));


    }
  }, []);

  return articles;
};

export default useArticles;
