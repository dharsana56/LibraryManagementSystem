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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/books")
@CrossOrigin
public class BookController {

    private final String URL =
            "jdbc:mysql://localhost:3306/library_management";

    private final String USER = "root";

    private final String PASSWORD =
            "101624512As*";


    // GET ALL BOOKS
    @GetMapping
    public List<Map<String, Object>> getBooks()
            throws SQLException {

        List<Map<String, Object>> books =
                new ArrayList<>();

        String sql =
                "SELECT * FROM books ORDER BY id DESC";

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

                Map<String, Object> book =
                        new HashMap<>();

                book.put("id",
                        rs.getInt("id"));

                book.put("title",
                        rs.getString("title"));

                book.put("author",
                        rs.getString("author"));

                book.put("category",
                        rs.getString("category"));

                book.put("quantity",
                        rs.getInt("quantity"));

                book.put("available",
                        rs.getInt("available"));

                books.add(book);
            }
        }

        return books;
    }


    // ADD BOOK
    @PostMapping
    public String addBook(
            @RequestBody Map<String, Object> data)
            throws SQLException {

        String title =
                (String) data.get("title");

        String author =
                (String) data.get("author");

        String category =
                (String) data.get("category");

        int quantity =
                ((Number) data.get("quantity"))
                        .intValue();


        String sql = """
                INSERT INTO books
                (title, author, category, quantity, available)
                VALUES (?, ?, ?, ?, ?)
                """;


        try (
            Connection con =
                    DriverManager.getConnection(
                            URL, USER, PASSWORD);

            PreparedStatement ps =
                    con.prepareStatement(sql)
        ) {

            ps.setString(1, title);
            ps.setString(2, author);
            ps.setString(3, category);
            ps.setInt(4, quantity);
            ps.setInt(5, quantity);

            ps.executeUpdate();
        }

        return "Book added successfully";
    }


    // DELETE BOOK
    @DeleteMapping("/{id}")
    public String deleteBook(
            @PathVariable int id)
            throws SQLException {

        String sql =
                "DELETE FROM books WHERE id = ?";


        try (
            Connection con =
                    DriverManager.getConnection(
                            URL, USER, PASSWORD);

            PreparedStatement ps =
                    con.prepareStatement(sql)
        ) {

            ps.setInt(1, id);

            ps.executeUpdate();
        }

        return "Book deleted successfully";
    }
}