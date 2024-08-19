export function createHome() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    	<h1>Books</h1>

    <button class="button"> Add book</button>

	<table class="table">
		<thead>
			<tr class="table-header">
				<th>Id</th>
				<th>Title</th>
				<th>Author</th>
				<th>Genre</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
    
    `

    api("https://localhost:7193/api/v1/Book/all").then(response => {
        return response.json();
    }).then(data => {
        console.log(data);

        attachBooks(data.bookList);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });


    let button = document.querySelector(".button");

    button.addEventListener("click", (eve) => {
        CreateAddBookPage();
    });

}

export function CreateAddBookPage() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
      <h1>New Book</h1>
    <form>
        <p class="title-container">
            <label for="title">Title</label>
            <input name="title" type="text" id="title">
            <a class="titleErr">Title required!</a>
        </p>
        <p class="author-container">
            <label for="author">Author</label>
            <input name="author" type="text" id="author">
            <a class="authorErr">Author required!</a>
        </p>
        <p class="genre-container">
            <label for="genre">Genre</label>
            <input name="genre" type="text" id="genre">
            <a class="genreErr">Genre required!</a>
        </p>
        <div class="createBook">
         <a href="#">Create New Book</a>
        </div>
        <div class="cancel">
         <a href="#">Cancel</a>
        </div>
    </form>

    `

    let button = document.querySelector(".cancel");
    let test = document.querySelector(".createBook");

    button.addEventListener("click", (eve) => {
        createHome();
    })

    test.addEventListener("click", (eve) => {
        createBook();
    })

}

function createRow(book) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td>${book.id}</td>
				<td>${book.title}</td>
				<td>${book.author}</td>
				<td>${book.genre}</td>
    `

    return tr;
}

function api(path, method = "GET", body = null) {

    const url = path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options);
}

function attachBooks(books) {

    let lista = document.querySelector("thead");

    books.forEach(book => {

        let tr = createRow(book);
        lista.appendChild(tr);

    });

    return lista;

}

function createBook() {

    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let genre = document.getElementById("genre").value;

    let titleError = document.querySelector(".titleErr");
    let authorError = document.querySelector(".authorErr");
    let genreError = document.querySelector(".genreErr");

    let errors = [];

    if (title == '') {

        errors.push("Title");

    } else if (titleError.classList.contains("beDisplayed") && title !== '') {

        errors.pop("Title");
        titleError.classList.remove("beDisplayed");
    }

    if (author == '') {

        errors.push("Author");

    } else if (authorError.classList.contains("beDisplayed") && author !== '') {

        errors.pop("Author");
        authorError.classList.remove("beDisplayed");
    }

    if (genre == '') {

        errors.push("Genre");

    } else if (genreError.classList.contains("beDisplayed") && genre !== '') {

        errors.pop("Genre");
        genreError.classList.remove("beDisplayed");

    }

    if (errors.length == 0) {

        let book = {
            title: title,
            author: author,
            genre: genre
        }

        api("https://localhost:7193/api/v1/Book/create", "POST", book)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                createHome();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } else {

        errors.forEach(err => {

            if (err.includes("Title")) {

                titleError.classList.add("beDisplayed");
            }

            if (err.includes("Author")) {

                authorError.classList.add("beDisplayed");
            }

            if (err.includes("Genre")) {

                genreError.classList.add("beDisplayed");
            }

        })

    }

}