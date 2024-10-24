// Initialize Lucide icons
lucide.createIcons();

// Get the drop zone element
const dropZone = document.getElementById('dropZone');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop zone when dragging over it
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('drag-over');
}

function unhighlight(e) {
    dropZone.classList.remove('drag-over');
}

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    [...files].forEach(uploadFile);
}

function uploadFile(file) {
    // Simulate file upload - in a real application, you would send the file to a server
    console.log('File uploaded:', file.name);
    // You could add AJAX request here to upload the file
}

// Handle click on drop zone to select files
dropZone.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        const files = e.target.files;
        handleFiles(files);
    };
    input.click();
});

// Add click handlers for buttons
document.querySelectorAll('.upload-btn').forEach(button => {
    button.addEventListener('click', () => {
        const type = button.querySelector('span').textContent;
        console.log(`${type} upload button clicked`);
        // Add specific handling for each upload type
    });
});

// Add click handlers for dropdown buttons
document.querySelectorAll('.dropdown-btn').forEach(button => {
    button.addEventListener('click', () => {
        const setting = button.parentElement.querySelector('span').textContent;
        console.log(`${setting} dropdown clicked`);
        // Add dropdown menu toggle logic here
    });
});