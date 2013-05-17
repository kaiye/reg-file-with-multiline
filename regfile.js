var fs = require('fs');
var lineReader = require('line-reader');
var flag = false , //当前行是否需转义
    linePiece = '', //转义片段
    lineTotal = ''; //转义后的行总和

/* 字符串转16进制补零 */
function str2Hex(str){
    var ret = [];
    for(var i = 0, len = str.length; i< len; i++){
        ret.push(('0' + str.charCodeAt(i).toString(16)).slice(-2).toUpperCase());
        ret.push('00');
    }
    return ret.join(',');
}

/* 注册表换行字符串转16进制，细节点
1、\r\n 换行换成 \n
2、最后需加上 00,00 表示字符串结束
3、转义路径\\反转义一次
*/
function convertReg(file){
    lineReader.eachLine(file, function(line, end) {
        var tmpLine, tmpArr;
        if(flag){
            if(/^\"[^"]*$/.test(line)){
                flag = false;
                lineTotal += 'hex(1):' + linePiece + ',00,00' + '\n';
                line = ''; //去掉当前行关闭引号
                linePiece = '';
            }else{
                linePiece += ',' + str2Hex(line.replace(/\\\\/g,'\\').replace('\r','\n'));
            }
        }else{
            tmpArr = line.match(/^(\"[^"]+\"\=)\"([^"]*)$/);
            if(tmpArr){
                flag = true;
                linePiece += str2Hex(tmpArr[2].replace(/\\\\/g,'\\').replace('\r','\n'));
                lineTotal += tmpArr[1];
            } 
        }
        
        if(!flag){
            lineTotal += line;
        }
        if(end){
            var newFile = file.replace(/\.reg$/,'_new.reg');
            fs.writeFile(newFile, lineTotal, 'UCS-2' ,function (err) {
                if (err) throw err;
                console.log('File <' + file + '> Convert to <' + newFile + '> Success!');
            });
            return false;
        }
    }, '\n' ,'UCS-2');
}

process.argv.splice(2).forEach(function(file, index){
    if(!/\.reg$/.test(file)){ 
        console.log('File <' + file + '> is NOT a .reg File!');
        return '';
    }
    fs.exists(file, function (exists) {
        if(exists){
            convertReg(file);
        }else{
            console.log('File <' + file + '> is NOT EXISTS!');
        }  
    });
})

