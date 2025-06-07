import { render, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "./RegisterForm";
import { AuthContext } from "../../context/AuthContext";
import { MemoryRouter } from "react-router-dom";
import React from "react";


describe("RegisterForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            token: "fake-token",
            user: { id: 1, email: "new@user.com" },
          }),
      })
    );
  });

  it("submits form and calls register endpoint", async () => {
    const mockLogin = jest.fn();

    const { getByPlaceholderText, getByRole } = render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <MemoryRouter>
          <RegisterForm />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(getByPlaceholderText("Enter email"), {
      target: { value: "new@user.com" },
    });
    fireEvent.change(getByPlaceholderText("Set password"), {
      target: { value: "mypassword" },
    });

    fireEvent.click(getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/register"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "new@user.com",
            password: "mypassword",
          }),
        })
      );
    });

    expect(mockLogin).toHaveBeenCalledWith("fake-token", {
      id: 1,
      email: "new@user.com",
    });
  });
});
