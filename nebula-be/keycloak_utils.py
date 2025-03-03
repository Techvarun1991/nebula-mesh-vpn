from keycloak import KeycloakAdmin, KeycloakOpenID
import requests

# Keycloak Configuration
KEYCLOAK_SERVER_URL = "http://localhost:8080"
KEYCLOAK_REALM = "nebula-app"
KEYCLOAK_CLIENT_ID = "peer-management-app"
KEYCLOAK_CLIENT_SECRET = "v41ghCneMBcrcdasa9YNMWe2PnJGIRr8"
KEYCLOAK_ADMIN_USER = "nebula@admin"
KEYCLOAK_ADMIN_PASSWORD = "admin"

# Function to get an admin access token manually
def get_admin_token():
    url = f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/token"
    payload = {
        "client_id": "admin-cli",
        "username": KEYCLOAK_ADMIN_USER,
        "password": KEYCLOAK_ADMIN_PASSWORD,
        "grant_type": "password"
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    response = requests.post(url, data=payload, headers=headers)

    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        print(f"Failed to get admin token: {response.status_code}, {response.text}")
        return None

# Initialize Keycloak OpenID and Admin
keycloak_openid = KeycloakOpenID(
    server_url=KEYCLOAK_SERVER_URL,
    client_id=KEYCLOAK_CLIENT_ID,
    realm_name=KEYCLOAK_REALM,
    client_secret_key=KEYCLOAK_CLIENT_SECRET
)

keycloak_admin = KeycloakAdmin(
    server_url=KEYCLOAK_SERVER_URL,
    username=KEYCLOAK_ADMIN_USER,
    password=KEYCLOAK_ADMIN_PASSWORD,
    realm_name=KEYCLOAK_REALM,
    client_id="admin-cli",
    verify=False
)

# Function to get access token (Already Implemented)
def get_access_token(username, password):
    try:
        token = keycloak_openid.token(username, password)
        return token
    except Exception as e:
        print(e)
        return {"error": str(e)}

# Function to get user information (Already Implemented)
def get_user_info(token):
    try:
        return keycloak_openid.userinfo(token["access_token"])
    except Exception as e:
        return {"error": str(e)}

# Function to register a new user
def create_user(username, email, first_name, last_name, password):
    try:
        new_user = {
            "username": username,
            "email": email,
            "firstName": first_name,
            "lastName": last_name,
            "enabled": True,
            "credentials": [{"type": "password", "value": password, "temporary": False}]
        }
        user_id = keycloak_admin.create_user(new_user)
        return {"message": "User created successfully", "user_id": user_id}
    except Exception as e:
        print(e)
        return {"error": str(e)}

# Function to update user details
def update_user(user_id, update_data):
    try:
        keycloak_admin.update_user(user_id, update_data)
        return {"message": "User updated successfully"}
    except Exception as e:
        return {"error": str(e)}

# Function to delete a user
def delete_user(user_id):
    try:
        keycloak_admin.delete_user(user_id)
        return {"message": "User deleted successfully"}
    except Exception as e:
        return {"error": str(e)}

# Function to assign a role to a user
def assign_role_to_user(user_id, role_name):
    try:
        role = keycloak_admin.get_realm_role(role_name)
        keycloak_admin.assign_realm_roles(user_id, [role])
        return {"message": f"Role '{role_name}' assigned successfully"}
    except Exception as e:
        return {"error": str(e)}

# Function to remove a role from a user
def remove_role_from_user(user_id, role_name):
    try:
        role = keycloak_admin.get_realm_role(role_name)
        keycloak_admin.delete_realm_roles_of_user(user_id, [role])
        return {"message": f"Role '{role_name}' removed successfully"}
    except Exception as e:
        return {"error": str(e)}

# Function to reset user password
def reset_password(user_id, new_password):
    try:
        keycloak_admin.set_user_password(user_id, new_password, temporary=False)
        return {"message": "Password reset successfully"}
    except Exception as e:
        return {"error": str(e)}

def verify_token(token):
    """
    Introspect the given access token.
    Returns a dictionary with keys like 'active', 'sub', 'preferred_username', etc.
    """
    try:
        return keycloak_openid.introspect(token["access_token"])
    except Exception as e:
        return {"error": str(e)}

def get_user_info(token):
    """
    Fetch user information (claims) from the token.
    Returns a dictionary with user claims like 'email', 'given_name', etc.
    """
    try:
        return keycloak_openid.userinfo(token["access_token"])
    except Exception as e:
        return {"error": str(e)}
    

def refresh_access_token(refresh_token):
    """
    Refreshes the access token using python-keycloak.
    """
    try:
        new_token = keycloak_openid.refresh_token(refresh_token)
        return new_token
    except Exception as e:
        return {"error": "Failed to refresh token", "details": str(e)}



# Function to logout user (invalidate session)
def logout_user(user_id):
    try:
        keycloak_admin.logout_user(user_id)
        return {"message": "User logged out successfully"}
    except Exception as e:
        return {"error": str(e)}
