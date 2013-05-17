var fs = require('fs');
var lineReader = require('line-reader');
var flag = false , //��ǰ���Ƿ���ת��
    linePiece = '', //ת��Ƭ��
    lineTotal = ''; //ת�������ܺ�

/* �ַ���ת16���Ʋ��� */
function str2Hex(str){
    var ret = [];
    for(var i = 0, len = str.length; i< len; i++){
        ret.push(('0' + str.charCodeAt(i).toString(16)).slice(-2).toUpperCase());
        ret.push('00');
    }
    return ret.join(',');
}

/* ע������ַ���ת16���ƣ�ϸ�ڵ�
1��\r\n ���л��� \n
2���������� 00,00 ��ʾ�ַ�������
3��ת��·��\\��ת��һ��
*/
function convertReg(file){
    lineReader.eachLine(file, function(line, end) {
        var tmpLine, tmpArr;
        if(flag){
            if(/^\"[^"]*$/.test(line)){
                flag = false;
                lineTotal += 'hex(1):' + linePiece + ',00,00' + '\n';
                line = ''; //ȥ����ǰ�йر�����
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

