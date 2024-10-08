from flask import Flask, send_file, abort
import zipfile
import os
import io

app = Flask(__name__)

@app.route('/download-folder/<folder_name>', methods=['GET'])
def download_folder(folder_name):
    folder_path = os.path.join('folders', folder_name)  # Adjust the path as necessary

    if not os.path.exists(folder_path):
        abort(404)

    # Create a ZIP file in memory
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
        for root, _, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                # Add file to the zip file
                zip_file.write(file_path, os.path.relpath(file_path, folder_path))
    
    zip_buffer.seek(0)  # Go to the beginning of the BytesIO buffer

    # Send the zip file
    return send_file(zip_buffer, as_attachment=True, download_name=f"{folder_name}.zip", mimetype='application/zip')

if __name__ == '__main__':
    app.run(port=5000)
