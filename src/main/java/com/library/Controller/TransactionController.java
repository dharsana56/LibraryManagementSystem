package com.library.Controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin
public class TransactionController {

    private final String URL =
            "jdbc:mysql://localhost:3306/library_management";

    private final String USER = "root";

    private final String PASSWORD =
            "101624512As*";


    // GET ALL TRANSACTIONS
    @GetMapping
    public List<Map<String, Object>> getTransactions()
            throws SQLException {

        List<Map<String, Object>> transactions =
                new ArrayList<>();

        String sql = """
                SELECT
                    t.id,
                    b.title AS book_title,
                    m.name AS member_name,
                    t.issue_date,
                    t.return_date,
                    t.status
                FROM transactions t
                JOIN books b
                    ON t.book_id = b.id
                JOIN members m
                    ON t.member_id = m.id
                ORDER BY t.id DESC
                """;


        try (
            Connection con =
                    DriverManager.getConnection(
                            URL, USER, PASSWORD);

            Statement stmt =
                    con.createStatement();

            ResultSet rs =
                    stmt.executeQuery(sql)
        ) {

            while (rs.next()) {

                Map<String, Object> transaction =
                        new HashMap<>();

                transaction.put(
                        "id",
                        rs.getInt("id")
                );

                transaction.put(
                        "bookTitle",
                        rs.getString("book_title")
                );

                transaction.put(
                        "memberName",
                        rs.getString("member_name")
                );

                transaction.put(
                        "issueDate",
                        rs.getDate("issue_date")
                );

                transaction.put(
                        "returnDate",
                        rs.getDate("return_date")
                );

                transaction.put(
                        "status",
                        rs.getString("status")
                );

                transactions.add(transaction);
            }
        }

        return transactions;
    }


    // ISSUE BOOK
    @PostMapping("/issue")
    public String issueBook(
            @RequestBody Map<String, Object> data)
            throws SQLException {

        int bookId =
                ((Number) data.get("bookId"))
                        .intValue();

        int memberId =
                ((Number) data.get("memberId"))
                        .intValue();


        Connection con = null;

        try {

            con = DriverManager.getConnection(
                    URL, USER, PASSWORD);

            con.setAutoCommit(false);


            // CHECK BOOK
            String checkBook =
                    "SELECT available FROM books WHERE id=?";

            PreparedStatement bookPs =
                    con.prepareStatement(checkBook);

            bookPs.setInt(1, bookId);

            ResultSet bookRs =
                    bookPs.executeQuery();


            if (!bookRs.next()) {

                con.rollback();

                return "Book not found";
            }


            int available =
                    bookRs.getInt("available");


            if (available <= 0) {

                con.rollback();

                return "No copies available";
            }


            // REDUCE AVAILABLE
            String updateBook =
                    """
                    UPDATE books
                    SET available = available - 1
                    WHERE id = ?
                    """;

            PreparedStatement updatePs =
                    con.prepareStatement(updateBook);

            updatePs.setInt(1, bookId);

            updatePs.executeUpdate();


            // CREATE TRANSACTION
            String insert =
                    """
                    INSERT INTO transactions
                    (book_id, member_id, issue_date, status)
                    VALUES (?, ?, CURDATE(), 'Issued')
                    """;

            PreparedStatement insertPs =
                    con.prepareStatement(insert);

            insertPs.setInt(1, bookId);
            insertPs.setInt(2, memberId);

            insertPs.executeUpdate();


            con.commit();

            return "Book issued successfully";

        } catch (SQLException e) {

            if (con != null) {
                con.rollback();
            }

            throw e;

        } finally {

            if (con != null) {
                con.close();
            }
        }
    }


    // RETURN BOOK
    @PutMapping("/{id}/return")
    public String returnBook(
            @PathVariable int id)
            throws SQLException {

        Connection con = null;

        try {

            con = DriverManager.getConnection(
                    URL, USER, PASSWORD);

            con.setAutoCommit(false);


            // FIND TRANSACTION
            String find =
                    """
                    SELECT book_id
                    FROM transactions
                    WHERE id = ?
                    AND status = 'Issued'
                    """;

            PreparedStatement findPs =
                    con.prepareStatement(find);

            findPs.setInt(1, id);

            ResultSet rs =
                    findPs.executeQuery();


            if (!rs.next()) {

                con.rollback();

                return "Transaction not found";
            }


            int bookId =
                    rs.getInt("book_id");


            // INCREASE AVAILABLE
            String updateBook =
                    """
                    UPDATE books
                    SET available = available + 1
                    WHERE id = ?
                    """;

            PreparedStatement updatePs =
                    con.prepareStatement(updateBook);

            updatePs.setInt(1, bookId);

            updatePs.executeUpdate();


            // UPDATE TRANSACTION
            String updateTransaction =
                    """
                    UPDATE transactions
                    SET return_date = CURDATE(),
                        status = 'Returned'
                    WHERE id = ?
                    """;

            PreparedStatement transactionPs =
                    con.prepareStatement(
                            updateTransaction);

            transactionPs.setInt(1, id);

            transactionPs.executeUpdate();


            con.commit();

            return "Book returned successfully";

        } catch (SQLException e) {

            if (con != null) {
                con.rollback();
            }

            throw e;

        } finally {

            if (con != null) {
                con.close();
            }
        }
    }
}