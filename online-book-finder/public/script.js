function displayBooks(data){

let output="";

data.forEach(book=>{

output+=`
<div style="border:1px solid black; padding:10px; margin:10px;">
<h3>${book.title}</h3>
<p>Author: ${book.author}</p>
<p>Category: ${book.category}</p>
<p>Price: ${book.price}</p>
<p>Rating: ${book.rating}</p>
</div>
`;

});

document.getElementById("books").innerHTML=output;

}


/* SEARCH BOOK */

function searchBook(){

const title=document.getElementById("searchTitle").value;

fetch("/books/search?title="+title)

.then(res=>res.json())

.then(data=>displayBooks(data));

}


/* FILTER CATEGORY */

function filterCategory(category){

fetch("/books/category/"+category)

.then(res=>res.json())

.then(data=>displayBooks(data));

}


/* SORT PRICE */

function sortPrice(){

fetch("/books/sort/price")

.then(res=>res.json())

.then(data=>displayBooks(data));

}


/* SORT RATING */

function sortRating(){

fetch("/books/sort/rating")

.then(res=>res.json())

.then(data=>displayBooks(data));

}


/* TOP BOOKS */

function topBooks(){

fetch("/books/top")

.then(res=>res.json())

.then(data=>displayBooks(data));

}


/* PAGINATION */

function loadBooks(page=1){

fetch("/books?page="+page)

.then(res=>res.json())

.then(data=>displayBooks(data));

}