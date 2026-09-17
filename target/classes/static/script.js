const BOOK_API = "/api/books";
const MEMBER_API = "/api/members";
const TRANSACTION_API = "/api/transactions";


// =====================================================
// BOOKS
// =====================================================

let allBooks = [];


// LOAD BOOKS

async function loadBooks() {

    try {

        const response =
            await fetch(BOOK_API);

        if (!response.ok) {
            throw new Error("Failed to load books");
        }

        allBooks =
            await response.json();

        if (document.getElementById("bookTable")) {
            displayBooks(allBooks);
        }

    } catch (error) {

        console.error(error);

        alert("Unable to load books.");

    }
}


// DISPLAY BOOKS

function displayBooks(books) {

    const table =
        document.getElementById("bookTable");

    if (!table) return;

    table.innerHTML = "";


    if (books.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    No books found
                </td>
            </tr>
        `;

        return;
    }


    books.forEach(book => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${book.id}</td>

            <td>
                <strong>${book.title}</strong>
            </td>

            <td>${book.author}</td>

            <td>${book.category || "-"}</td>

            <td>${book.quantity}</td>

            <td>${book.available}</td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteBook(${book.id})"
                >
                    Delete
                </button>

            </td>
        `;


        table.appendChild(row);

    });
}


// ADD BOOK

const bookForm =
    document.getElementById("bookForm");


if (bookForm) {

    bookForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const book = {

                title:
                    document
                        .getElementById("title")
                        .value
                        .trim(),

                author:
                    document
                        .getElementById("author")
                        .value
                        .trim(),

                category:
                    document
                        .getElementById("category")
                        .value
                        .trim(),

                quantity:
                    Number(
                        document
                            .getElementById("quantity")
                            .value
                    )
            };


            try {

                const response =
                    await fetch(BOOK_API, {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(book)
                    });


                if (!response.ok) {
                    throw new Error();
                }


                alert(
                    "Book added successfully!"
                );


                bookForm.reset();

                loadBooks();


            } catch (error) {

                console.error(error);

                alert(
                    "Failed to add book."
                );

            }

        }
    );

}


// DELETE BOOK

async function deleteBook(id) {

    if (
        !confirm(
            "Are you sure you want to delete this book?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${BOOK_API}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {
            throw new Error();
        }


        alert(
            "Book deleted successfully!"
        );


        loadBooks();


    } catch (error) {

        console.error(error);

        alert(
            "Failed to delete book."
        );

    }
}


// SEARCH BOOKS

function searchBooks() {

    const search =
        document
            .getElementById("search")
            .value
            .toLowerCase();


    const filtered =
        allBooks.filter(book =>

            book.title
                .toLowerCase()
                .includes(search)

            ||

            book.author
                .toLowerCase()
                .includes(search)

            ||

            (book.category || "")
                .toLowerCase()
                .includes(search)

        );


    displayBooks(filtered);
}


// =====================================================
// MEMBERS
// =====================================================

let allMembers = [];


// LOAD MEMBERS

async function loadMembers() {

    try {

        const response =
            await fetch(MEMBER_API);

        if (!response.ok) {
            throw new Error();
        }

        allMembers =
            await response.json();


        if (
            document.getElementById(
                "memberTable"
            )
        ) {

            displayMembers(allMembers);

        }


        loadMemberDropdown();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load members."
        );

    }
}


// DISPLAY MEMBERS

function displayMembers(members) {

    const table =
        document.getElementById(
            "memberTable"
        );

    if (!table) return;


    table.innerHTML = "";


    if (members.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No members found
                </td>
            </tr>
        `;

        return;
    }


    members.forEach(member => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${member.id}</td>

            <td>
                <strong>${member.name}</strong>
            </td>

            <td>${member.email || "-"}</td>

            <td>${member.phone || "-"}</td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteMember(${member.id})"
                >
                    Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });
}


// ADD MEMBER

const memberForm =
    document.getElementById(
        "memberForm"
    );


if (memberForm) {

    memberForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const member = {

                name:
                    document
                        .getElementById(
                            "memberName"
                        )
                        .value
                        .trim(),

                email:
                    document
                        .getElementById(
                            "memberEmail"
                        )
                        .value
                        .trim(),

                phone:
                    document
                        .getElementById(
                            "memberPhone"
                        )
                        .value
                        .trim()

            };


            try {

                const response =
                    await fetch(
                        MEMBER_API,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    member
                                )
                        }
                    );


                if (!response.ok) {
                    throw new Error();
                }


                alert(
                    "Member added successfully!"
                );


                memberForm.reset();

                loadMembers();


            } catch (error) {

                console.error(error);

                alert(
                    "Failed to add member."
                );

            }

        }
    );

}


// DELETE MEMBER

async function deleteMember(id) {

    if (
        !confirm(
            "Are you sure you want to delete this member?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${MEMBER_API}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {
            throw new Error();
        }


        alert(
            "Member deleted successfully!"
        );


        loadMembers();


    } catch (error) {

        console.error(error);

        alert(
            "Failed to delete member."
        );

    }
}


// SEARCH MEMBERS

function searchMembers() {

    const search =
        document
            .getElementById(
                "memberSearch"
            )
            .value
            .toLowerCase();


    const filtered =
        allMembers.filter(member =>

            member.name
                .toLowerCase()
                .includes(search)

            ||

            (member.email || "")
                .toLowerCase()
                .includes(search)

            ||

            (member.phone || "")
                .toLowerCase()
                .includes(search)

        );


    displayMembers(filtered);
}


// MEMBER DROPDOWN

function loadMemberDropdown() {

    const select =
        document.getElementById(
            "memberSelect"
        );

    if (!select) return;


    select.innerHTML = `
        <option value="">
            Select Member
        </option>
    `;


    allMembers.forEach(member => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            member.id;

        option.textContent =
            member.name;


        select.appendChild(option);

    });
}


// =====================================================
// TRANSACTIONS
// =====================================================

let allTransactions = [];


// LOAD TRANSACTIONS

async function loadTransactions() {

    try {

        const response =
            await fetch(
                TRANSACTION_API
            );


        if (!response.ok) {
            throw new Error();
        }


        allTransactions =
            await response.json();


        if (
            document.getElementById(
                "transactionTable"
            )
        ) {

            displayTransactions(
                allTransactions
            );

        }


        updateDashboard();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load transactions."
        );

    }
}


// DISPLAY TRANSACTIONS

function displayTransactions(
    transactions
) {

    const table =
        document.getElementById(
            "transactionTable"
        );


    if (!table) return;


    table.innerHTML = "";


    if (transactions.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No transactions found
                </td>
            </tr>
        `;

        return;
    }


    transactions.forEach(transaction => {

        const row =
            document.createElement("tr");


        const statusClass =
            transaction.status === "Issued"
                ? "status-issued"
                : "status-returned";


        let action = "-";


        if (
            transaction.status ===
            "Issued"
        ) {

            action = `

                <button
                    class="return-btn"
                    onclick="returnBook(
                        ${transaction.id}
                    )"
                >
                    Return
                </button>

            `;

        }


        row.innerHTML = `

            <td>${transaction.id}</td>

            <td>
                <strong>
                    ${transaction.bookTitle}
                </strong>
            </td>

            <td>
                ${transaction.memberName}
            </td>

            <td>
                ${transaction.issueDate || "-"}
            </td>

            <td>
                ${transaction.returnDate || "-"}
            </td>

            <td>

                <span
                    class="status ${statusClass}"
                >
                    ${transaction.status}
                </span>

            </td>

            <td>
                ${action}
            </td>

        `;


        table.appendChild(row);

    });
}


// LOAD BOOK DROPDOWN

async function loadBookDropdown() {

    const select =
        document.getElementById(
            "bookSelect"
        );


    if (!select) return;


    try {

        const response =
            await fetch(BOOK_API);


        const books =
            await response.json();


        select.innerHTML = `
            <option value="">
                Select Book
            </option>
        `;


        books
            .filter(
                book => book.available > 0
            )
            .forEach(book => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    book.id;


                option.textContent =
                    `${book.title}
                     (${book.available} available)`;


                select.appendChild(
                    option
                );

            });


    } catch (error) {

        console.error(error);

    }
}


// ISSUE BOOK

const issueForm =
    document.getElementById(
        "issueForm"
    );


if (issueForm) {

    issueForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const bookId =
                Number(
                    document
                        .getElementById(
                            "bookSelect"
                        )
                        .value
                );


            const memberId =
                Number(
                    document
                        .getElementById(
                            "memberSelect"
                        )
                        .value
                );


            if (!bookId || !memberId) {

                alert(
                    "Please select both member and book."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        `${TRANSACTION_API}/issue`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    bookId:
                                        bookId,

                                    memberId:
                                        memberId
                                })
                        }
                    );


                const message =
                    await response.text();


                alert(message);


                if (response.ok) {

                    issueForm.reset();

                    loadTransactions();

                    loadBooks();

                    loadBookDropdown();

                }


            } catch (error) {

                console.error(error);

                alert(
                    "Failed to issue book."
                );

            }

        }
    );

}


// RETURN BOOK

async function returnBook(id) {

    if (
        !confirm(
            "Return this book?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${TRANSACTION_API}/${id}/return`,
                {
                    method: "PUT"
                }
            );


        const message =
            await response.text();


        alert(message);


        if (response.ok) {

            loadTransactions();

            loadBooks();

            loadBookDropdown();

        }


    } catch (error) {

        console.error(error);

        alert(
            "Failed to return book."
        );

    }
}


// SEARCH TRANSACTIONS

function searchTransactions() {

    const search =
        document
            .getElementById(
                "transactionSearch"
            )
            .value
            .toLowerCase();


    const filtered =
        allTransactions.filter(transaction =>

            transaction.bookTitle
                .toLowerCase()
                .includes(search)

            ||

            transaction.memberName
                .toLowerCase()
                .includes(search)

            ||

            transaction.status
                .toLowerCase()
                .includes(search)

        );


    displayTransactions(
        filtered
    );
}


// =====================================================
// DASHBOARD
// =====================================================

async function updateDashboard() {

    try {

        const [
            booksResponse,
            membersResponse,
            transactionsResponse
        ] = await Promise.all([

            fetch(BOOK_API),

            fetch(MEMBER_API),

            fetch(TRANSACTION_API)

        ]);


        const books =
            await booksResponse.json();


        const members =
            await membersResponse.json();


        const transactions =
            await transactionsResponse.json();


        const totalBooks =
            books.reduce(
                (sum, book) =>
                    sum + book.quantity,
                0
            );


        const availableBooks =
            books.reduce(
                (sum, book) =>
                    sum + book.available,
                0
            );


        const issuedBooks =
            transactions.filter(
                t => t.status === "Issued"
            ).length;


        const returnedBooks =
            transactions.filter(
                t => t.status === "Returned"
            ).length;


        const totalBooksElement =
            document.getElementById(
                "totalBooks"
            );


        if (totalBooksElement) {

            totalBooksElement.textContent =
                totalBooks;

        }


        const availableElement =
            document.getElementById(
                "availableBooks"
            );


        if (availableElement) {

            availableElement.textContent =
                availableBooks;

        }


        const membersElement =
            document.getElementById(
                "totalMembers"
            );


        if (membersElement) {

            membersElement.textContent =
                members.length;

        }


        const issuedElement =
            document.getElementById(
                "issuedBooks"
            );


        if (issuedElement) {

            issuedElement.textContent =
                issuedBooks;

        }


        const returnedElement =
            document.getElementById(
                "returnedBooks"
            );


        if (returnedElement) {

            returnedElement.textContent =
                returnedBooks;

        }


        displayRecentTransactions(
            transactions
        );


    } catch (error) {

        console.error(error);

    }
}


// RECENT TRANSACTIONS

function displayRecentTransactions(
    transactions
) {

    const table =
        document.getElementById(
            "recentTransactions"
        );


    if (!table) return;


    table.innerHTML = "";


    const recent =
        transactions.slice(0, 5);


    if (recent.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No transactions yet
                </td>
            </tr>
        `;

        return;
    }


    recent.forEach(transaction => {

        const row =
            document.createElement("tr");


        const statusClass =
            transaction.status === "Issued"
                ? "status-issued"
                : "status-returned";


        row.innerHTML = `

            <td>
                ${transaction.bookTitle}
            </td>

            <td>
                ${transaction.memberName}
            </td>

            <td>
                ${transaction.issueDate || "-"}
            </td>

            <td>
                ${transaction.returnDate || "-"}
            </td>

            <td>

                <span
                    class="status ${statusClass}"
                >
                    ${transaction.status}
                </span>

            </td>

        `;


        table.appendChild(row);

    });
}


// =====================================================
// PAGE INITIALIZATION
// =====================================================

loadBooks();

loadMembers();

loadTransactions();

loadBookDropdown();

updateDashboard();