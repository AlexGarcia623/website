function makeCurrentBooks() {
    for (currentBook in current_books) {
      var attributes   = current_books[currentBook];

      var author       = attributes[0];
      var whenStarted = attributes[1];
      var pages        = attributes[2];
      var selectors    = attributes[3];
      var image        = attributes[4];

      var parentDiv = document.getElementById('current');

      var newdiv = document.createElement('div');
      newdiv.setAttribute('class','bookCurrent center');
      newdiv.setAttribute('id',currentBook);

      parentDiv.appendChild(newdiv);

      newdiv = document.getElementById(currentBook);

      var col1 = document.createElement('div');
      col1.setAttribute('class','col');
      col1.setAttribute('id',currentBook + 'col1');

      var col2 = document.createElement('div');
      col2.setAttribute('class','col');
      col2.setAttribute('id',currentBook + 'col2');

      newdiv.appendChild(col1);
      newdiv.appendChild(col2);

      col1 = document.getElementById(currentBook + 'col1');
      col2 = document.getElementById(currentBook + 'col2');

      var img = document.createElement('img')
      img.src = image;
      img.setAttribute('class','center');

      col1.appendChild(img);

      var title  = document.createElement('h2');
      title.innerHTML = currentBook;

      var writer = document.createElement('h3');
      writer.innerHTML = author;

      var date   = document.createElement('p');
      date.innerHTML = 'Started: ' + whenStarted;

      col2.appendChild(title);
      col2.appendChild(writer);
      col2.appendChild(date);
    }
  }

  function changeFilter() {
    options   = document.getElementById('whichFilter').selectedOptions;
    newFilter = String(Array.from(options).map(({ value }) => value));

    document.getElementById(currentFilter).style.display = 'none';
    document.getElementById(newFilter).style.display     = 'block';

    generateBookClasses(newFilter);
    changeQuickLinks(newFilter);
    workingcounter(newFilter);

    currentFilter = newFilter;
  }

  function generateBookClasses(currentFilter) {
    if (!filterDivsExist[currentFilter]) {
      all_headers   = [];
      all_selectors = [];
      for (var currentBook in books) {
        var attributes   = books[currentBook];

        var author       = attributes[0];
        var whenFinished = attributes[1];
        var pages        = attributes[2];
        var selectors    = attributes[3];
        var image        = attributes[4];

        var parentDiv = document.getElementById(currentFilter);

        if (!all_headers.includes(selectors[filter2index[currentFilter]])) {

          create_header = document.createElement('div');
          create_header.setAttribute('id',selectors[filter2index[currentFilter]]);
          create_header.setAttribute('class','header center');

          document.getElementById(currentFilter).appendChild(create_header);

          create_header_title = document.createElement('h1');
          create_header_title.setAttribute('style','color:tomato;');
          create_header_title.innerHTML = selectors[filter2index[currentFilter]];

          create_header_info = document.createElement('p');

          document.getElementById(selectors[filter2index[currentFilter]]).appendChild(create_header_title);
          document.getElementById(selectors[filter2index[currentFilter]]).appendChild(create_header_info);

          all_headers.push(selectors[filter2index[currentFilter]])
        }

        if (!all_selectors.includes(selectors[filter2index[currentFilter]]) ) {
          create_gridish = document.createElement('div');
          create_gridish.setAttribute('id','books' + selectors[filter2index[currentFilter]]);
          create_gridish.setAttribute('class','grid-ish');

          parentDiv.appendChild(create_gridish);

          all_selectors.push(selectors[filter2index[currentFilter]]);
        } 
        var gridish = document.getElementById('books' + selectors[filter2index[currentFilter]])
  
        newdiv = document.createElement('div');
        newdiv.setAttribute("class","bookRead center");

        gridish.appendChild(newdiv);

        col1 = document.createElement('div');
        col1.setAttribute('class','col');
        col1.setAttribute('id',currentBook + 'col1' + currentFilter);

        col2 = document.createElement('div');
        col2.setAttribute('class','col');
        col2.setAttribute('id',currentBook + 'col2' + currentFilter);

        newdiv.appendChild(col1);
        newdiv.appendChild(col2);

        col1  = document.getElementById(currentBook + 'col1' + currentFilter);

        img = document.createElement('img');
        img.src = image;
        img.setAttribute('class','center');
        col1.appendChild(img);

        col2  = document.getElementById(currentBook + 'col2' + currentFilter);

        title = document.createElement('h2');
        title.innerHTML = currentBook;
        writer = document.createElement('h3');
        writer.innerHTML = author;
        date = document.createElement('p');
        date.innerHTML = 'Finished: ' + whenFinished;
        npages = document.createElement('p');
        npages.innerHTML = pages;
        npages.setAttribute('style','display:none;')
        npages.setAttribute('id',currentBook + 'pages')

        col2.appendChild(title);
        col2.appendChild(writer);
        col2.appendChild(date);
        col2.appendChild(npages);
      }
      filterDivsExist[currentFilter] = true;

      filterOptions[currentFilter] = all_headers;
    }    
  }

  function changeQuickLinks(currentFilter) {
    var quickLinks = document.getElementById('genericSelector');

    var existingElements = quickLinks.getElementsByTagName('a');

    if (existingElements.length > 0) {
      for (var i = existingElements.length; i -- > 0;) {
        existingElements[i].parentNode.removeChild(existingElements[i]);
      }
    }

    all_headers = filterOptions[currentFilter];

    for (var header in all_headers) {
        var newLink  = document.createElement('a');
        var linkText = document.createTextNode(all_headers[header]);

        newLink.appendChild(linkText);

        newLink.href  = '#'+all_headers[header];
        newLink.setAttribute('class','selector')

        quickLinks.appendChild(newLink);
      }
  }

  function workingcounter(currentFilter) {
    all_headers = filterOptions[currentFilter];

    var total_books = 0;
    var total_pages = 0;

    for (header of all_headers) {
      var parentDiv = document.getElementById('books' + header);

      var location_of_text = document.getElementById(header).getElementsByTagName('p')[0]; // 0 -> first p is the one I want to modify

      var booksWithinCategory = parentDiv.getElementsByClassName('bookRead');
      var n_books = booksWithinCategory.length;
      var n_pages = 0;

      for (book of booksWithinCategory) {
        var col2 = book.getElementsByTagName('div')[1];

        var pages = parseInt(col2.getElementsByTagName('p')[1].innerHTML); // 1 -> second p within col2 div
        n_pages   = n_pages + pages;
      }

      location_of_text.innerHTML = 'I have read ' + String(n_books) + ' books of this category for a total of ' + n_pages.toLocaleString() + ' pages';

      total_books = total_books + n_books;
      total_pages = total_pages + n_pages;
    }

    var complete_string = 'As of last update, I have finished a total of ' + String(total_books) + ' books for a total of ' + total_pages.toLocaleString() + ' pages';
    document.getElementById('recent').getElementsByTagName('p')[0].innerHTML = complete_string;
  }