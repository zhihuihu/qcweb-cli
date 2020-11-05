#!/usr/bin/env node
const commander = require('commander');
const download = require('download-git-repo');      //github仓库下载
const inquirer = require('inquirer');       //命令行答询
const handlebars = require('handlebars');       //修改字符
const ora = require('ora');         //命令行中加载状态标识
const chalk = require('chalk');     //命令行输出字符颜色
const logSymbols = require('log-symbols');      //命令行输出符号
const fs = require('fs');
const request = require('request');
const compressing = require('compressing');
const {resolve} = require("path");

const qcwebProject = {
  url: 'direct:https://github.com/zhihuihu/qcweb.git'
}

// 工具版本号
commander.version('1.0.0');

commander
  .command('server-init')
  .description('init server project in current location')
  .action(function () {
    let cloneUrl = qcwebProject.url;
    if (fs.existsSync(resolve('./') + '/qcweb')) {
      console.log(chalk.red(`
                          server-init failed
      The "qcweb" folder already exists at the current path`
      ));
      return;
    }
    const spinner = ora('start download...').start();
    download(cloneUrl, 'qcweb', {clone: true}, err => {
      if (err) {
        spinner.fail('download failed');
        console.log(err);
      } else {
        spinner.succeed('download success');
        console.log(chalk.green(`
        Next you should do it
        
        cd qcweb && npm install
        
        then you can start the project and use config.json to config your project and user
        
        node ./bin/www
        `));
      }
    });
  });

async function deploy(url, describe) {
  const routerUrl = '/deploy/new';
  if (!fs.existsSync(resolve('./') + '/dist')) {
    console.log(chalk.red(`
                          package failed
      The "dist" folder not exists at the current path`
    ));
    return;
  }
  if (fs.existsSync(resolve('./') + '/dist.zip')) {
    fs.unlinkSync(resolve('./') + '/dist.zip');
  }
  await compressing.zip.compressDir(resolve('./') + '/dist', resolve('./') + '/dist.zip');
  let formData = {
    describe: describe,
    file: fs.createReadStream(resolve('./') + '/dist.zip')
  }
  request.post({url: url + routerUrl, formData: formData, json: true}, function (err, rep, body) {
    if (err) {
      printError("deploy failed",err);
    } else {
      if (body.code !== 0) {
        printFailed('deploy failed',body);
      } else {
        printSuccess(`deploy success`,body);
      }
    }
  });
}

commander
  .command('deploy <url> <describe>')
  .description('package .zip file and deploy new version to server')
  .action(function (url, describe) {
    deploy(url, describe)
      .catch(function (err) {
        printError("deploy failed",err);
      });
  });

commander
  .command('rollback <url> <historyId>')
  .description('rollback project to historyId version')
  .action(function (url, historyId) {
    const routerUrl = '/deploy/rollback';
    let form = {
      historyId: historyId,
    }
    request.post({url: url + routerUrl, form: form, json: true}, function (err, rep, body) {
      if (err) {
        printError("rollback failed",err);
      } else {
        if (body.code !== 0) {
          printFailed('rollback failed',body);
        } else {
          printSuccess(`rollback success`,body);
        }
      }
    });
  });

commander
  .command('history <url> <top>')
  .description('show project deploy history')
  .action(function (url, top) {
    const routerUrl = '/deploy/list';
    request.get({
      url: url + routerUrl,
      qs: {
        pageNum: 1,
        pageSize: top
      },
      json: true
    }, function (err, rep, body) {
      if(err){
        printError("history failed",err);
      }else{
        if (body.code !== 0) {
          printFailed('history failed',body);
        } else {
          console.log(chalk.green(`historyId                             uploadUser         uploadTime    describe`));
          body.data.list.forEach(function (history) {
            console.log(chalk.green(`${history.id}  ${history.operator}   ${history.createTime}   ${history.describe}`));
          });
        }
      }

    })
  });

function printError(title,err){
  console.log(chalk.red(`${title}`));
  console.log(chalk.red(`${err}`));
}

function printFailed(title,body){
  console.log(chalk.red(`${title}`));
  console.log(chalk.red(`code=${body.code}`));
  console.log(chalk.red(`codeMessage=${body.codeMessage}`));
  console.log(chalk.red(`data=${body.data}`));
}

function printSuccess(title,body){
  console.log(chalk.green(`${title}`));
  console.log(chalk.green(`code=${body.code}`));
  console.log(chalk.green(`codeMessage=${body.codeMessage}`));
  console.log(chalk.green(`data=${body.data}`));
}

commander.parse(process.argv);
