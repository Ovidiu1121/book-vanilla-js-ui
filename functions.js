export function createHome(alert) {

    let container = document.querySelector(".container");


    container.innerHTML = `

      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
       </div>  

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

    let button = document.querySelector(".button");
    let table = document.querySelector(".table");
    const alertPlaceholder = document.querySelector('.container-alert');
    let load = document.querySelector(".spinner-border");

    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    api("https://localhost:7193/api/v1/Book/all").then(response => {
        return response.json();
    }).then(data => {
        load.classList = "";
        console.log(data);

        attachBooks(data.bookList);
    }).catch(error => {
        load.classList = "";

        console.error('Error fetching data:', error);

        appendAlert(error, "danger");
    });

    button.addEventListener("click", (eve) => {
        CreateAddBookPage();
    });

    table.addEventListener("click", (eve) => {

        console.log(eve.target.textContent);

        if (eve.target.classList.contains("updateBook")) {
            api(`https://localhost:7193/api/v1/Book/id/${eve.target.textContent}`).then(res => {
                return res.json();
            }).then(data => {
                console.log(data);

                let book = {
                    title: data.title,
                    author: data.author,
                    genre: data.genre
                }
                CreateUpdatePage(book, eve.target.textContent);

            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        }

    });

    if (alert === "deleted") {
        load.classList = "";
        appendAlert("Book has been DELETED with success!", "success");
    }

    if (alert === "updated") {
        load.classList = "";
        appendAlert("Book has been UPDATED with success!", "success");
    }

    if (alert === "added") {
        load.classList = "";
        appendAlert("Book has been ADDED with success!", "success");
    }

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
        createHome("");
    })

    test.addEventListener("click", (eve) => {
        createUpdateBook("create");
    })

}

export function CreateUpdatePage(book, idBook) {

    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>Update Book</h1>
    <form>
        <p>
            <label for="title">Title</label>
            <input name="title" type="text" id="title" value="${book.title}">
             <a class="titleErr">Title required!</a>
        </p>
        <p>
            <label for="author">Author</label>
            <input name="author" type="text" id="author" value="${book.author}">
             <a class="authorErr">Author required!</a>
        </p>
        <p>
            <label for="genre">Genre</label>
            <input name="genre" type="text" id="genre" value="${book.genre}">
             <a class="genreErr">Genre required!</a>
        </p>

        <div class="submitUpdate">
         <a href="#">Update Book</a>
        </div>

          <div class="cancel">
         <a href="#">Cancel</a>
        </div>
        <div class="submitDelete">
         <a href="#">Delete Book</a>
        </div>
    </form>
    `

    let cancelButton = document.querySelector(".cancel");
    let submitUpdateButton = document.querySelector(".submitUpdate");
    let submitDeleteButton = document.querySelector(".submitDelete");
    let titleinput = document.getElementById("title");
    let authorinput = document.getElementById("author");

    titleinput.disabled = true;
    authorinput.disabled = true;

    cancelButton.addEventListener("click", (eve) => {
        createHome("");
    });

    submitUpdateButton.addEventListener("click", (eve) => {
        createUpdateBook("update", idBook);
    });

    submitDeleteButton.addEventListener("click", (eve) => {

        api(`https://localhost:7193/api/v1/Book/delete/${idBook}`, "DELETE")
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);

                createHome("deleted");
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    })


}

function createRow(book) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td class="updateBook">${book.id}</td>
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

function createUpdateBook(request, idBook) {

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

        if (request === "create") {
            api("https://localhost:7193/api/v1/Book/create", "POST", book)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("added");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else if (request === "update") {
            api(`https://localhost:7193/api/v1/Book/update/${idBook}`, "PUT", book)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("updated");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
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