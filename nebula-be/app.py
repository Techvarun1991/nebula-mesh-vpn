from flask import Flask, request, jsonify
from keycloak_utils import (
    get_access_token, verify_token, get_user_info, create_user, update_user,
    delete_user, assign_role_to_user, remove_role_from_user, reset_password, logout_user,refresh_access_token
)
import datetime


app = Flask(__name__)

# Login Route (Already Implemented)
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    token = get_access_token(username, password)
    if "error" in token:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify(token)

# Protected Route (Already Implemented)
@app.route("/protected", methods=["GET"])
def protected():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing Authorization Header"}), 401

    token = auth_header.split(" ")[1]
    validation = verify_token({"access_token": token})

    if not validation.get("active"):
        return jsonify({"error": "Invalid or expired token"}), 401

    user_info = get_user_info({"access_token": token})
    return jsonify({"message": "Access granted", "user": user_info})

# Register a new user
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    required_fields = ["username", "email", "first_name", "last_name", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    response = create_user(
        data["username"], data["email"], data["first_name"], data["last_name"], data["password"]
    )
    return jsonify(response)

# Update user details
@app.route("/update/<user_id>", methods=["PUT"])
def update(user_id):
    data = request.json
    response = update_user(user_id, data)
    return jsonify(response)

# Delete a user
@app.route("/delete/<user_id>", methods=["DELETE"])
def delete(user_id):
    response = delete_user(user_id)
    return jsonify(response)

# Assign role to user
@app.route("/assign-role/<user_id>", methods=["POST"])
def assign_role(user_id):
    role_name = request.json.get("role_name")
    response = assign_role_to_user(user_id, role_name)
    return jsonify(response)

# Remove role from user
@app.route("/remove-role/<user_id>", methods=["POST"])
def remove_role(user_id):
    role_name = request.json.get("role_name")
    response = remove_role_from_user(user_id, role_name)
    return jsonify(response)

# Reset user password
@app.route("/reset-password/<user_id>", methods=["POST"])
def reset_password_route(user_id):
    new_password = request.json.get("new_password")
    response = reset_password(user_id, new_password)
    return jsonify(response)

# Logout user
@app.route("/logout/<user_id>", methods=["POST"])
def logout(user_id):
    response = logout_user(user_id)
    return jsonify(response)

@app.route("/userinfo", methods=["GET"])
def userinfo():
    """
    Extracts user details from the token, including username, email, roles, etc.
    Only returns: username, email, email_verified, user_id, last_name, first_name, Role, created_at.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing Authorization Header"}), 401

    try:
        token_str = auth_header.split(" ")[1]
    except IndexError:
        return jsonify({"error": "Invalid Authorization Header"}), 400

    # Introspect the token
    introspection = verify_token({"access_token": token_str})
    if not introspection.get("active"):
        return jsonify({"error": "Invalid or expired token"}), 401

    # Fetch user info
    user_info = get_user_info({"access_token": token_str})
    if "error" in user_info:
        return jsonify({"error": user_info["error"]}), 400

    # Extract Role (Only return ADMIN or USER)
    roles = introspection.get("realm_access", {}).get("roles", [])
    user_role = "USER"  # Default role
    if "ADMIN" in roles:
        user_role = "ADMIN"
    elif "USER" in roles:
        user_role = "USER"

    # Convert 'iat' (issued at) timestamp to human-readable format
    created_at = datetime.datetime.utcfromtimestamp(int(introspection.get("iat", 0))).isoformat() if "iat" in introspection else None

    # Construct the response with required fields
    response_data = {
        "username": introspection.get("preferred_username"),
        "email": introspection.get("email"),
        "email_verified": introspection.get("email_verified"),
        "user_id": introspection.get("sub"),
        "last_name": introspection.get("family_name"),
        "first_name": introspection.get("given_name"),
        "Role": user_role,
        "created_at": created_at
    }

    return jsonify(response_data), 200

@app.route("/refresh-token", methods=["POST"])
def refresh_token():
    """
    Uses the refresh token to get a new access token.
    """
    data = request.get_json()
    refresh_token = data.get("refresh_token")

    if not refresh_token:
        return jsonify({"error": "Missing refresh_token in request"}), 400

    new_token_response = refresh_access_token(refresh_token)
    if "error" in new_token_response:
        return jsonify({"error": new_token_response["error"]}), 400

    return jsonify(new_token_response), 200


# Middleware to extract roles from token
def get_roles_from_token(token):
    user_info = verify_token(token)
    
    if not user_info.get("active"):
        return None, {"error": "Invalid or expired token"}, 401

    roles = user_info.get("realm_access", {}).get("roles", [])
    return roles, None


# Open (public) API
@app.route("/public", methods=["GET"])
def public_api():
    return jsonify({"message": "This is a public API accessible to everyone"}), 200


# API accessible only by USERS
@app.route("/user", methods=["GET"])
def user_api():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    
    roles, error_response = get_roles_from_token(token)
    if error_response:
        return jsonify(error_response)

    if "USER" not in roles:
        return jsonify({"error": "Access denied"}), 403

    return jsonify({"message": "Hello, USER! This API is for USER role only"}), 200


# API accessible only by ADMINS
@app.route("/admin", methods=["GET"])
def admin_api():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    
    roles, error_response = get_roles_from_token(token)
    if error_response:
        return jsonify(error_response)

    if "ADMIN" not in roles:
        return jsonify({"error": "Access denied"}), 403

    return jsonify({"message": "Hello, ADMIN! This API is for ADMIN role only"}), 200


# API accessible by both USERS and ADMINS
@app.route("/user-admin", methods=["GET"])
def user_admin_api():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    
    roles, error_response = get_roles_from_token(token)
    if error_response:
        return jsonify(error_response)

    if "USER" not in roles and "ADMIN" not in roles:
        return jsonify({"error": "Access denied"}), 403

    return jsonify({"message": "Hello, USER or ADMIN! You have access to this API"}), 200



if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

