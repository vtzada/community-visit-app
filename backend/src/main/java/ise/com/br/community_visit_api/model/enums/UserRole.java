package ise.com.br.community_visit_api.model.enums;

public enum UserRole {

    ADMIN("admin"),
    VOLUNTARIO("voluntario"),
    SOLICITANTE("solicitante");

    private final String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}