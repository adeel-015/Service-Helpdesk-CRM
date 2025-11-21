const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class ApiService {
  static getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async handleResponse(response) {
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));

      // If validation errors are present, include them in the thrown Error message
      let message = error.message || `HTTP ${response.status}`;
      if (error.errors && Array.isArray(error.errors)) {
        const details = error.errors
          .map((e) => (e.msg ? `${e.param}: ${e.msg}` : JSON.stringify(e)))
          .join("; ");
        message = `${message} - ${details}`;
      }

      throw new Error(message);
    }
    return response.json();
  }

  // Auth endpoints
  static async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return this.handleResponse(response);
  }

  static async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  // Ticket endpoints
  static async getTickets(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.append(key, filters[key]);
    });

    const response = await fetch(`${API_BASE_URL}/tickets?${params}`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  static async createTicket(ticketData) {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(ticketData),
    });
    return this.handleResponse(response);
  }

  static async updateTicket(id, ticketData) {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(ticketData),
    });
    return this.handleResponse(response);
  }

  static async deleteTicket(id) {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  static async assignTicket(id, agentId) {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}/assign`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ agentId }),
    });
    return this.handleResponse(response);
  }

  static async getTicketActivity(id) {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}/activity`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // User endpoints
  static async getUsers(role) {
    // Determine whether the client user is admin; if not, call the agents endpoint
    let currentUser = null;
    try {
      currentUser = JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      currentUser = null;
    }

    if (!currentUser || currentUser.role !== "admin") {
      // Non-admins can only fetch agents via the special endpoint
      const response = await fetch(`${API_BASE_URL}/users/agents`, {
        headers: this.getAuthHeader(),
      });
      const data = await this.handleResponse(response);
      return Array.isArray(data) ? data : data.users || [];
    }

    const params = role ? `?role=${role}` : "";
    const response = await fetch(`${API_BASE_URL}/users${params}`, {
      headers: this.getAuthHeader(),
    });
    const data = await this.handleResponse(response);
    // backend may return { users, total } for paginated responses
    return Array.isArray(data) ? data : data.users || [];
  }

  static async updateUser(id, userData) {
    // backend expects role update at /users/:id/role
    const response = await fetch(`${API_BASE_URL}/users/${id}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  static async deleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Profile endpoints
  static async getProfile() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: this.getAuthHeader(),
    });
    const data = await this.handleResponse(response);
    return data.user || data;
  }

  static async updateProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(profileData),
    });
    return this.handleResponse(response);
  }

  static async changePassword(passwordData) {
    const response = await fetch(`${API_BASE_URL}/users/profile/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(passwordData),
    });
    return this.handleResponse(response);
  }

  // Activity logs
  static async getActivityLogs() {
    const response = await fetch(`${API_BASE_URL}/activity-logs`, {
      headers: this.getAuthHeader(),
    });
    const data = await this.handleResponse(response);
    // backend returns { logs, total }
    return Array.isArray(data) ? data : data.logs || [];
  }
}

export default ApiService;
