from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

# Nebula Certificate Authority details (adjust paths as needed)
NEBULA_CA_CERT = "/etc/nebula/ca.crt"
NEBULA_CA_KEY = "/etc/nebula/ca.key"
NEBULA_CONFIG_DIR = "/etc/nebula/certs"

@app.route('/api/user/peers', methods=['POST'])
def create_peer():
    data = request.json
    peer_name = data.get("name")

    if not peer_name:
        return jsonify({"error": "Peer name is required"}), 400

    # Generate key pair
    peer_key_path = os.path.join(NEBULA_CONFIG_DIR, f"{peer_name}.key")
    peer_cert_path = os.path.join(NEBULA_CONFIG_DIR, f"{peer_name}.crt")

    try:
        # Generate Nebula key
        subprocess.run(["nebula-cert", "keygen", "-out-key", peer_key_path], check=True)

        # Sign certificate with CA
        subprocess.run([
            "nebula-cert", "sign",
            "-name", peer_name,
            "-out-crt", peer_cert_path,
            "-ca-crt", NEBULA_CA_CERT,
            "-ca-key", NEBULA_CA_KEY
        ], check=True)

        return jsonify({
            "message": "Peer created successfully",
            "peer_name": peer_name,
            "key_path": peer_key_path,
            "cert_path": peer_cert_path
        }), 201

    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Failed to generate peer certificate: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
