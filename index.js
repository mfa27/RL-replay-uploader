const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const chokidar = require("chokidar");


async function uploadFile(token, path) {
    const form = new FormData();
    form.append("file", fs.createReadStream(path));
    try {
        
        const response = await axios.post("https://ballchasing.com/api/v2/upload?visibility=" + 'public', form, {
            headers: {
                'Authorization': token,
                files: form.getHeaders("file"), 
            },
        });
        console.log("Upload successful:", response.data);

    } catch (error) {
        console.log("Upload failed:", error.response.status);
        console.log(error.response.data.error);
    }
}

 function main() {
    let path = ''; // replace with your actual path: C:\Users\YOUR_WINDOWS_USERNAME\OneDrive\documents\My Games\Rocket League\TAGame\DemosEpic
    const token = ""; // Replace with your actual token
    const timers = new Map();
    let fetching = [];
    const watcher = chokidar.watch(path, {
        persistent: true,
        ignoreInitial: true,
        ignored: (path, stats) => stats?.isFile() && !path.endsWith('.replay'),
        
    });

    watcher.on('add',  (filePath) => {
        
        if (timers.has(filePath)){
            clearTimeout(timers.get(filePath));
        }
        let t = setTimeout( () => {   
                const result =  uploadFile(token, filePath);
            }, 2000);
        timers.set(filePath, t);
        
    });
}

main();