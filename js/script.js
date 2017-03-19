//jshint esversion:6



/************************************ Functions **************************************/

//function that generates and Prints message to the  div with class student-list
let showMessage = (message) => {
	const messageParagraph = document.createElement('p');
	messageParagraph.className = 'notFound';
	messageParagraph.textContent = message;
	$studentList.append(messageParagraph);
}
//function that removes Items from the div with class student-list
let removeStudentListItems = () => {
	while ($studentList[0].firstChild) {
		$studentList[0].firstChild.remove();
	}
}

//function to enhance paginations Links
let paginationMechanism = (arrayLike) => {
	//add event handler to the ul
	paginationUl.addEventListener('click', (event) => {
		if (event.target.tagName == 'A') {
			//remove the student list items from the dom
			removeStudentListItems();
			//get the page number and stores in variable
			const pageNumber = event.target.textContent;
			//checks pageNumber and appends the right number of items
			if (pageNumber === '1') {
				//gets first 10  list items
				itemsToShow = arrayLike.slice(0, 10);
				//appends the first 10  list items to the div with class student-list
				$studentList.append(itemsToShow);
			}
			else {
				//gets the computed value of number of  list items for each page
				itemsToShow = arrayLike.slice(((pageNumber * 10) - 10), (pageNumber * 10));
				//appends the first 10  list items to the div with class student-list
				$studentList.append(itemsToShow);
			}
			/****iterate through the pagination links and checks 
			if equal to page number to add classname/remove ****/
			for (let i = 0; i < numberOfPages; i++) {
				if (paginationUl.children[i].firstChild.textContent === pageNumber) {
					paginationUl.children[i].firstChild.classList.add('active');
				}
				else {
					paginationUl.children[i].firstChild.classList.remove('active');
				}
			}
		}
	});
}

//iterate through pagination links and hide excess unneccessary pagination links
let hideExcessPaginationLinks = () => {
	for (let i = pagesForMatchedSearch; i < numberOfPages; i++) {
		paginationUl.children[i].firstChild.style.display = 'none';
	}
}

/************************************ End of Functions **************************************/


const $studentList = $('.student-list');		//selects the ul that contains the student list items
const $studentListItems = $('.student-item');		//selects the students list items in the ul with class student list
const numberOfItems = $studentListItems.length;		//calculates and stores the number of list items in the ul
let searchMatches = [];		//array to store search matches
let pagesForMatchedSearch = 0;		//stores the number of pages the searchMatches can occupy
removeStudentListItems();		//remove the student list items from the dom
let itemsToShow = $studentListItems.slice(0, 10);	// variable stores first 10 student list items
$studentList.append(itemsToShow);		//append the first 10 student list items to student-list div
const numberOfPages = Math.ceil(numberOfItems / 10);	//calculate the number of pages and store in variable
let paginationLi = '';		//stores the html of the pagination li
//create Pagination Links
for (let i = 1; i <= numberOfPages; i++) {
	paginationLi += '<li><a href="#">';
	paginationLi += i;
	paginationLi += '</a></li>';
}
//create pagination Div and append content
const paginationDiv = document.createElement('div');
paginationDiv.className = 'pagination';
const paginationUl = document.createElement('ul');
paginationDiv.append(paginationUl);
paginationUl.innerHTML = paginationLi;		//put the pagination Li as the html inside ul of the pagination Div
paginationUl.children[0].firstChild.className = 'active';		//add the class active to the first link in the pagination li
$('.page').append(paginationDiv);		//append the pagination Div into the Dom

paginationMechanism($studentListItems);		//enhance pagination Links

//create search HTML 
const studentSearchDiv = document.createElement('div');
studentSearchDiv.className = 'student-search';
const searchField = document.createElement('input');
searchField.setAttribute('placeholder', 'Search for students...');
const searchButtom = document.createElement('button');
searchButtom.textContent = 'Search';
studentSearchDiv.append(searchField, searchButtom);
$('.page-header').append(studentSearchDiv); 	//append the studentSearchDiv into the div with class page-header

//checks and hide pagination link for when number of pages is 1
if(numberOfPages === 1){
	paginationUl.children[0].firstChild.style.display = 'none'; // hide the pagination link
}

let namesArray = [];	//array to hold all names
let emailArray = []; 	//array to hold all emails

//iterate through the names and emails html collections
for (let i = 0; i < numberOfItems; i++) {
	namesArray.push($studentListItems[i].children[0].children[1].textContent);		//pushes the names into the array
	emailArray.push($studentListItems[i].children[0].children[2].textContent);		//pushes the email into the array
}

//add event listener to the search searchButtom
searchButtom.addEventListener('click', () => {
	itemsToShow = [];		//empty content of itemsToShow
	searchMatches = [];		//empty content of searhMatches
	removeStudentListItems(); 	//remove the children of the div with class student-list

	//iterate through the number of list items and push matching into searchMatches
	for (let i = 0; i < numberOfItems; i++) {
		//checks if the input value matches any item of the  namesArray or emailArray
		if (namesArray[i].includes($('.student-search input')[0].value.toLowerCase()) || emailArray[i].includes($('.student-search input')[0].value.toLowerCase())) {
			searchMatches.push($studentListItems[i]);		//stores the matched result into the searchMatches array
		}
	}

	pagesForMatchedSearch = Math.ceil(searchMatches.length / 10);		//computed value for the number of pages the searchMatches can occupy

	//iterate through the pagination links 
	for (let i = 0; i < numberOfPages; i++) {
		paginationUl.children[i].firstChild.style.display = 'inline';		//set the display property to a value of inline for all pagination links
		paginationUl.children[i].firstChild.classList.remove('active');		//removes the class active from all pagination links
	}

	paginationUl.children[0].firstChild.className = 'active';		//sets the class active to the first pagination link

	//checks and appends searchMatches to the dom if it's not empty else prints out message not found
	if (searchMatches.length > 0 && searchMatches.length < 10) {
		itemsToShow = searchMatches;
		$studentList.append(itemsToShow);
		// paginationUl.children[0].firstChild.style.display = 'none';
		// hideExcessPaginationLinks();	//hide excess pagination links
		//hide pagination links if the items is less than 11
		for(let i = 0; i < numberOfPages; i++){
			paginationUl.children[i].firstChild.style.display = 'none';
		}
	}
	else if (searchMatches.length > 10) {
		itemsToShow = searchMatches.slice(0, 10);
		$studentList.append(itemsToShow);
		hideExcessPaginationLinks();	//hide excess pagination links
		paginationMechanism(searchMatches);		//enhance pagination links
	}
	else {
		hideExcessPaginationLinks();	//hide excess pagination links 
		showMessage('Your Search Returned No Result(s)!');		//prints to the document
	}
});