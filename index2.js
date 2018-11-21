const fs = require('fs');
const path = require('path');
const program = require('commander');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const rename = util.promisify(fs.rename);
let arr = [];


async function getAllFiles(folderName) {
    const files = await readdir(folderName);

    for (const file of files) {
        const filePath = path.join(folderName, file);
        const fileType = await stat(filePath);

        if (!fileType.isDirectory()) {
            arr.push({pth: filePath, name: file})
        } else {
            await getAllFiles(filePath);
        }
    }
    return arr;
}

async function copyFiles(folderName, dest, files){
    if(!fs.existsSync(dest)){
        fs.mkdirSync(dest);
    }

    for(let file of files) {
        let firstLetter = file.name[0].toLowerCase(),
            Dest = path.join(dest, firstLetter),
            newFilePath = path.join(Dest, file.name);

        if(!fs.existsSync(Dest)){
            fs.mkdirSync(Dest)
        }
        await rename(file.pth, newFilePath);
    }
    return folderName;
}

function removeDir(folderName) {
    let files = fs.readdirSync(folderName);

    for (let file of files) {
        let filePath = path.join(folderName, file);
        removeDir(filePath);
    }
    fs.rmdirSync(folderName);
}

async function sortFiles(from, to){
    let files = await getAllFiles(from);
    await copyFiles(from, to, files)
        .then(folder=>removeDir(folder))
}

program
    .command('rmv')
    .arguments('<dir1> <dir2>')
    .action(function (dir1, dir2) {
        sortFiles(dir1, dir2)
            .then(()=>console.log('Success!'))
            .catch(err=>console.log(err));
    })

;
program.parse(process.argv);
