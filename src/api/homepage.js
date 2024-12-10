import config from "../config";
const { apiUrl } = config;

async function fetchHomepageArticles(){
    const url= `${apiUrl}homepage`
    console.log(url);
    try {
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Couldn't fetch details ${error}`)
    }
}

export {
    fetchHomepageArticles
}
