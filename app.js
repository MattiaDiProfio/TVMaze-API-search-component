/*
Mattia Di Profio
TVMaze API project
15/01/23
JS logic
*/

/* ------------------------------------------ global variables ------------------------------------------------ */
//default image link if no link is specified
const defaultImg = 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bW92aWV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60';
let searchResultDiv = document.querySelector('#search-result');


/* ------------------------------------------ classes ------------------------------------------------ */
//standard class to create instance of bootstrap alert
class BoostrapAlert {
    constructor(style, title, message) {
        this.style = this._check(style);
        this.title = title;
        this.message = message;
    }
    
    //auxiliary method to check valid bootstrap style 
    _check(style) { 
        const validStyles = ['warning', 'danger', 'primary', 'info'];
        return validStyles.includes(style) ? style : 'primary';
    }

    //create and return instance of custom bootstrap alert
    getHTML() {
        const html = `
            <div class="alert alert-${this.style}" role="alert">
                <h4 class="alert-heading">${this.title}</h4>
                <p>${this.message}</p>
                <hr>
                <p class="mb-0">Please try again later.</p>
            </div>
        `;
        return html;
    }
}
//standard class to create instance of bootstrap card
class BootstrapCard {
    constructor(img, title, score, description) {
        this.img = img;
        this.title = title;
        this.score = score;
        this.description = description;
    }

    //method to generate custom bootstrap card component
    getHTML() {
        const html = `
            <div class="card col-3-xl col-6-md">
                <img src=${this.img} class="card-img-top my-3">
                <div class="card-body">
                <h5 class="card-title d-flex justify-content-between">${this.title} (${this.score})</h5>
                <p class="card-text">${this.description}</p>
                </div>
            </div>
        `;
        return html;
    }
}

/* ------------------------------------------ auxiliary functions ------------------------------------------------ */
//remove HTML tags from the 'summary' of each card
const formatSummary = summary => {
    if (summary === null || summary === undefined) return 'No summary available';
    let temp = summary.split('');
    //set a maximum of 100 characters on the string
    if (temp.length > 150) {
        temp = temp.slice(0, 149);
        temp.push('...');
    }
    return temp.join('');
}

/* ------------------------------------------ main logic of API call ------------------------------------------------ */
//execute API call with form parameters
const form = document.querySelector('#movie-search-form');
form.addEventListener('submit', async (e) => {
    try {
        searchResultDiv.innerHTML = ''; //reset the page content after each search/API call

        //user input retrieved through the form
        let userInput = document.querySelector('#movie-title').value,
            url = `https://api.tvmaze.com/search/shows?q=${userInput}`,
            response = await axios.get(url);

        //display bootstrap alert if no results found
        if (response.data.length === 0) {
            let noResultsAlert = new BoostrapAlert('danger', 'Oh no :(', 'Looks like no results matched your search!');
            searchResultDiv.innerHTML = noResultsAlert.getHTML();
        }

        //format API data info into array of objects with essential keys-value pairs
        let skimmedMovieData = [];
        for(let obj of response.data) {
            let currObj = {};
            //extract needed information 
            currObj['score'] = (obj.score === undefined ? 0 : Math.round(obj.score*100)/10);
            currObj['name'] = obj.show.name;
            currObj['summary'] = formatSummary(obj.show.summary);
            currObj['image'] = (obj.show.image === null ? defaultImg : obj.show.image.medium);
            
            skimmedMovieData.push(currObj);
        }

        //create bootstrap card instances and append them to the results page
        for(let obj of skimmedMovieData) {
            let card = new BootstrapCard(obj.image, obj.name, obj.score, obj.summary);
            searchResultDiv.innerHTML += card.getHTML();
        }
    }
    catch(e) {
        //display bootstrap alert if error occurs
        let errorAlert = new BoostrapAlert('danger', 'Oh no :(', 'Looks like an error occured while retrieving the movie data!');
        searchResultDiv.innerHTML = errorAlert.getHTML();
        console.log(e); //show technical error for dev purposes
    }
});
