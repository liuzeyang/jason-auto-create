#!/usr/bin/env node 
const fs = require('fs');
const path = require('path')
const chalk = require('chalk');
const template = require('./template');

const resolve = (...file) => path.resolve(__dirname, ...file);
const log = message => console.log(chalk.green(message));
const successLog = message => console.log(chalk.blue(message));
const errorLog = message => console.log(chalk.red(message));

const dirCreate = (targetPath, cb) => {
    if(fs.existsSync(targetPath)){
        cb()
    } else {
        dirCreate(path.dirname(targetPath), () => {
            fs.mkdirSync(targetPath);
            cb();
        })
    }
}
const generateDirectoryCreate = async (dirPath) => {
    return new Promise((resolve, reject) => {
        dirCreate(dirPath, resolve)
    })
}

const generateFileCreate = async (filePath, content) => {
    if (fs.existsSync(filePath)) {
        errorLog(`${filePath}文件已存在`)
        return
    }
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, 'utf8', err => {
            if (err) {
                errorLog(err.message)
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
}

log(`请输入生成的文件路径(包含文件名)，格式：./Test/Test1`)
process.stdin.on('data', async (data) => {
    const stdinPath = data.toString().trim();
    const ClassName = stdinPath.split('/').pop();
    const dirPath = resolve(stdinPath);

    const exist = fs.existsSync(dirPath);
    if(exist) {
        errorLog(`${dirPath}已经存在该目录文件，请重新输入`);
        return
    }else{
        log(`正在生成${dirPath}目录中。。。`)
        await generateDirectoryCreate(dirPath);
    }

    try {
        log(`正在生成ts文件中。。。`);
        await generateFileCreate(resolve(stdinPath, 'index.tsx'), template.typeclinet(ClassName));
        log(`正在生成less文件中。。。`)
        await generateFileCreate(resolve(stdinPath, 'index.less'), '');
        successLog(`目标文件生成成功`)
    } catch (error) {
        errorLog(`发生错误：${error}`);
    }

    process.stdin.emit('end');
})


process.stdin.on('end', () => {
    log('exit')
    process.exit()
})