//GETTING THE DATA FROM THE API 
export function getQuestions() {
  return  fetch('https://opentdb.com/api.php?amount=5&type=multiple')
    .then(res => res.json())
    .then(data => {
    
        const newArray = [...data.results]
        return newArray
          
    }) 
}