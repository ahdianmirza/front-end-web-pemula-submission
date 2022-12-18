document.addEventListener('DOMContentLoaded', function() {
    const books = [];
    const RENDER_EVENT = 'render-book';

    const inputBook = document.getElementById('inputBook');

    function addBook() {
        const inputBookTitle = document.getElementById('inputBookTitle').value;
        const inputBookAuthor = document.getElementById('inputBookAuthor').value;
        const inputBookYear = document.getElementById('inputBookYear').value;

        function isChecked() {
            if (document.getElementById('inputBookIsComplete').checked) {
                return true;
            } else {
                return false;
            }
        }

        const inputBookIsComplete = isChecked();

        const generatedId = generateId();
        const bookObject = generateBookObject(generatedId, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function generateId() {
        return +new Date();
    }

    function generateBookObject(id, bookTitle, bookAuthor, bookYear, isCompleted) {
        return {
            id,
            bookTitle,
            bookAuthor,
            bookYear,
            isCompleted,
        }
    }

    const SAVED_EVENT = 'saved-book';
    const STORAGE_KEY = 'BOOK_SHELF_APPS'

    function isStorageExist() {
        if (typeof (Storage) === undefined) {
            alert('Browser tidak mendukung Local Storage');
            return false;
        }
        return true;
    }

    function saveData() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    function loadDataFromStorage() {
        const bookData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(bookData);

        if (data !== null) {
            for (const book of data) {
                books.push(book);
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    document.addEventListener(SAVED_EVENT, function() {
        console.log(localStorage.getItem(STORAGE_KEY));
    })

    inputBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    document.addEventListener(RENDER_EVENT, function() {
        const unreadBookList = document.getElementById('incompleteBookshelfList');
        unreadBookList.innerHTML = '';

        const readBookList = document.getElementById('completeBookshelfList');
        readBookList.innerHTML = '';

        for (const bookItem of books) {
            const bookElement = makeBookList(bookItem);
            if (!bookItem.isCompleted) {
                unreadBookList.append(bookElement);
            } else {
                readBookList.append(bookElement);
            }
        }
    });

    function makeBookList(bookObject) {
        const textBookTitle = document.createElement('h3');
        textBookTitle.innerText = bookObject.bookTitle;

        const textBookAuthor = document.createElement('p');
        textBookAuthor.innerText = 'Penulis: ' + bookObject.bookAuthor;

        const textBookYear = document.createElement('p');
        textBookYear.innerText = 'Tahun: ' + bookObject.bookYear;

        const textContainer = document.createElement('article');
        textContainer.classList.add('book_item');
        textContainer.append(textBookTitle, textBookAuthor, textBookYear);

        const container = document.createElement('div');
        container.classList.add('item', 'shadow');
        container.append(textContainer);
        container.setAttribute('id', `book-${bookObject.id}`);

        function addBookToDoneReadList(bookId) {
            const bookTarget = findBook(bookId);

            if (bookTarget === null) return;

            bookTarget.isCompleted = true;
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        }

        function findBook(bookId) {
            for (const bookItem of books) {
                if (bookItem.id === bookId) {
                    return bookItem;
                }
            }
            return null;
        }

        function addBookToUnreadList(bookId) {
            const bookTarget = findBook(bookId);

            if (bookTarget == null) return;

            bookTarget.isCompleted = false;
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        }

        function removeBookFromList(bookId) {
            const bookTarget = findBookIndex(bookId);

            if (bookTarget === -1) return;

            books.splice(bookTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        }

        function findBookIndex(bookId) {
            for (const index in books) {
                if (books[index].id === bookId) {
                    return index;
                }
            }

            return -1;
        }

        if (bookObject.isCompleted) {
            const greenNotYetButton = document.createElement('button');
            greenNotYetButton.classList.add('green');
            greenNotYetButton.innerText = 'Belum Selesai Dibaca';
            greenNotYetButton.setAttribute('type', 'button');

            greenNotYetButton.addEventListener('click', function() {
                addBookToUnreadList(bookObject.id);
            });

            const redDeleteButton = document.createElement('button');
            redDeleteButton.classList.add('red');
            redDeleteButton.innerText = 'Hapus Buku';
            redDeleteButton.setAttribute('type', 'button');

            redDeleteButton.addEventListener('click', function() {
                removeBookFromList(bookObject.id);
            });

            const actionContainer = document.createElement('div');
            actionContainer.classList.add('action');
            actionContainer.append(greenNotYetButton, redDeleteButton);

            textContainer.append(actionContainer)
        } else {
            const greenDoneButton = document.createElement('button');
            greenDoneButton.classList.add('green');
            greenDoneButton.innerText = 'Selesai Dibaca';
            greenDoneButton.setAttribute('type', 'button');

            greenDoneButton.addEventListener('click', function() {
                addBookToDoneReadList(bookObject.id);
            });

            const redDeleteButton = document.createElement('button');
            redDeleteButton.classList.add('red');
            redDeleteButton.innerText = 'Hapus Buku';
            redDeleteButton.setAttribute('type', 'button');

            redDeleteButton.addEventListener('click', function() {
                removeBookFromList(bookObject.id);
            });

            const actionContainer = document.createElement('div');
            actionContainer.classList.add('action');
            actionContainer.append(greenDoneButton, redDeleteButton);

            textContainer.append(actionContainer)
        }

        return container;
    }

    if (isStorageExist) {
        loadDataFromStorage();
    }
});