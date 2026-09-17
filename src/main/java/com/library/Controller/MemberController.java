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
@RequestMapping("/api/members")
@CrossOrigin
public class MemberController {

    private final String URL =
            "jdbc:mysql://localhost:3306/library_management";

    private final String USER = "root";

    private final String PASSWORD =
            "101624512As*";


    // GET ALL MEMBERS
    @GetMapping
    public List<Map<String, Object>> getMembers()
            throws SQLException {

        List<Map<String, Object>> members =
                new ArrayList<>();

        String sql =
                "SELECT * FROM members ORDER BY id DESC";

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

                Map<String, Object> member =
                        new HashMap<>();

                member.put(
                        "id",
                        rs.getInt("id")
                );

                member.put(
                        "name",
                        rs.getString("name")
                );

                member.put(
                        "email",
                        rs.getString("email")
                );

                member.put(
                        "phone",
                        rs.getString("phone")
                );

                members.add(member);
            }
        }

        return members;
    }


    // ADD MEMBER
    @PostMapping
    public String addMember(
            @RequestBody Map<String, Object> data)
            throws SQLException {

        String name =
                (String) data.get("name");

        String email =
                (String) data.get("email");

        String phone =
                (String) data.get("phone");


        String sql = """
                INSERT INTO members
                (name, email, phone)
                VALUES (?, ?, ?)
                """;


        try (
            Connection con =
                    DriverManager.getConnection(
                            URL, USER, PASSWORD);

            PreparedStatement ps =
                    con.prepareStatement(sql)
        ) {

            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, phone);

            ps.executeUpdate();
        }

        return "Member added successfully";
    }


    // DELETE MEMBER
    @DeleteMapping("/{id}")
    public String deleteMember(
            @PathVariable int id)
            throws SQLException {

        String sql =
                "DELETE FROM members WHERE id = ?";

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

        return "Member deleted successfully";
    }
}