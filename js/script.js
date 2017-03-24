//jshint esversion:6

const studentListContainer = document.getElementsByClassName('student-list')[0];
const studentItems = document.getElementsByClassName('student-item');
const studentListItems = [].slice.call(studentItems);
// calculates up to first 10 students and stores in array studentsToShow
let studentsToShow = studentListItems.slice(0,10);
const numberOfPages = Math.ceil(studentListItems.length / 10);
const pageDiv = document.getElementsByClassName('page')[0];

//removes the children of htmlCollections
const removeChildren = (htmlCollections)=>{
	while(htmlCollections.firstChild){
		htmlCollections.removeChild(htmlCollections.firstChild);
	}
};
// appends items in arrayLike to parent as children
const appendChildren = (arrayLike, parent)=> {
	for(let i = 0; i < arrayLike.length; i++){
		parent.appendChild(arrayLike[i]);
	}
};
//removes the student list items from the ul with class student list
removeChildren(studentListContainer);
//and append only first 10 student list items
appendChildren(studentsToShow, studentListContainer);
//create pagination
const paginationDiv = document.createElement('div');
paginationDiv.className = 'pagination';
const paginationUl = document.createElement('ul');
paginationDiv.append(paginationUl);
let paginationLi = '';
for(let i = 1; i <= numberOfPages; i++) {
	paginationLi += '<li><a href="#">';
	paginationLi += i;
	paginationLi += '</a></li>';
}
paginationUl.innerHTML = paginationLi;
//targets the first pagination link and set class to active
paginationUl.firstElementChild.firstElementChild.className = 'active';
//append pagination to bottom of Div with class page
pageDiv.appendChild(paginationDiv);

//remove the active class from the pagination links
const removeActiveClass = () => {
	for(let i = 0; i < paginationUl.children.length; i++){
		paginationUl.children[i].firstElementChild.className = '';
	}
};

//function to enhance pagination links
const enhancePagination = (arrayLike) => {
	//add event handler to enhance the pagination links
	paginationUl.addEventListener('click', (event) => {
		if(event.target.tagName === 'A'){
			removeChildren(studentListContainer);
			studentsToShow = [];
			const pageNumber = parseInt(event.target.textContent);
			const index = pageNumber - 1;
			removeActiveClass();
			// add the active class to the clicked pagination link
			paginationUl.children[index].firstElementChild.className = 'active';
			if(pageNumber === 1){
				//slice first 10 items into studentsToShow
				studentsToShow = arrayLike.slice(0,10);
				//append only first 10 student list items
				appendChildren(studentsToShow, studentListContainer);			
			}
			else{
				//calculate the right slice start and  end for the student items to be printed
				studentsToShow = arrayLike.slice(((pageNumber * 10)-10), (pageNumber * 10));
				//appends the  students items to the ul with class student-list
				appendChildren(studentsToShow, studentListContainer);
			}
		}
	});
};
// enhance pagination links
enhancePagination(studentListItems);

//create search bar and insert in Dom
const searchDiv = document.createElement('div');
searchDiv.className = 'student-search';
const searchInputElem = document.createElement('input');
searchInputElem.setAttribute('placeholder', 'Search for students...');
const searchButton = document.createElement('button');
searchButton.textContent = 'Search';
searchDiv.appendChild(searchInputElem);
searchDiv.appendChild(searchButton);
const pageHeader = document.getElementsByClassName('page-header')[0];
//insert searchDiv into the dom
pageHeader.insertAdjacentElement('beforeend', searchDiv);

//add a click event handler to the searchDiv
searchDiv.addEventListener('click', (event)=>{
	if(event.target.tagName === 'BUTTON'){
		studentsToShow = []; 	//empty content of studentsToShow
		//show all pagination  links
		for(let i = 0; i < numberOfPages; i++){
			paginationUl.children[i].style.display = '';
		}
		const searchInputValue = searchInputElem.value.toLowerCase();
		let names = [];
		let emails = [];
		let searchMatched = [];
		//Get the name and email list to compare
		for(let i = 0; i < studentListItems.length; i++){
			names.push(studentListItems[i].querySelector('h3').textContent);
			emails.push(studentListItems[i].querySelector('.email').textContent);
		}
		//for each name or email compare with search input value and save student item on search matched
		for(let i = 0; i < studentListItems.length; i++){
			if (names[i].toLowerCase().includes(searchInputValue) || emails[i].toLowerCase().includes(searchInputValue)){
				searchMatched.push(studentListItems[i]);
			}
		}
		//gets and stores number of pages for searchMatched
		const pagesForSearch = Math.ceil(searchMatched.length /10);
		// hides all unused pagination links
		const hideUnusedPagination = () => {
			for(let i = pagesForSearch; i < numberOfPages; i++){
				paginationUl.children[i].style.display = 'none';
			}
		};
		//hides all pagination links
		const hideAllPagination = () => {
			for(let i = 0; i < numberOfPages; i++){
				paginationUl.children[i].style.display = 'none';
			}
		};
		//checks for the number of search results at a time and enhances
		if(searchMatched.length >= 1 && searchMatched.length <= 10){
			console.log(searchMatched);
			removeChildren(studentListContainer);
			appendChildren(searchMatched, studentListContainer);
			//enhance pagination effect on searchMatched
			enhancePagination(searchMatched);
			//hide pagination links
			hideAllPagination();
		}
		else if(searchMatched.length > 10){
			removeChildren(studentListContainer);
			studentsToShow = searchMatched.slice(0,10);
			appendChildren(studentsToShow, studentListContainer);
			removeActiveClass();
			//add active class to first page number 1
			paginationUl.children[0].firstElementChild.className = 'active';
			//enhance pagination effect on searchMatched
			enhancePagination(searchMatched);
			//hides unused pagination links
			hideUnusedPagination();
		}
		else{
			removeChildren(studentListContainer);
			hideAllPagination();
			const noResultMessage = document.createElement('p');
			noResultMessage.textContent = 'Search returned no result(s)!';
			studentListContainer.appendChild(noResultMessage);
		}
	}
});





