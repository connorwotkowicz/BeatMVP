import { render, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { AuthContext } from "../../context/AuthContext";
import { MemoryRouter } from "react-router-dom";
import React from "react";


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Login", () => {
  it("submits login and calls AuthContext login", async () => {
    const mockLogin = jest.fn();
    const fakeToken = "fake-jwt-token";
    const fakeUser = { id: 1, email: "test@example.com" };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: fakeToken, user: fakeUser }),
      })
    );

    const { getByPlaceholderText, getByRole } = render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(fakeToken, fakeUser);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/login"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      })
    );
  });

  it("displays error message on failed login", async () => {
    const mockLogin = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Invalid credentials" }),
      })
    );

    const { getByPlaceholderText, getByRole, findByText } = render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(getByRole("button"));

    const errorMessage = await findByText(/invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
