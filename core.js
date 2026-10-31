(function(g){
const sample={old:'周末读书会通知\n时间：周六下午两点\n请带上一本正在读的书。\n地点：一楼活动室\n活动结束后请整理桌椅。',new:'周末读书会通知\n时间：周六下午三点\n请带上一本正在读的书。\n地点：二楼活动室\n活动结束后请整理桌椅。\n请提前十分钟签到。'};
function normalize(t){if(typeof t!=='string')throw Error('文本格式不正确');const s=t.replace(/\r\n?/g,'\n');if([...s].length>12000)throw Error('每版最多12000字符');const lines=s===''?[]:s.split('\n');if(lines.length>200)throw Error('每版最多200行，末尾换行也占一行');return lines;}
function diff(s){if(!s||typeof s!=='object')throw Error('条件格式不正确');const a=normalize(s.old),b=normalize(s.new),n=a.length,m=b.length,L=Array.from({length:n+1},()=>new Uint16Array(m+1));for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=a[i]===b[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);let i=0,j=0,blocks=[],changes=0,added=0,removed=0;function push(type,line){let k=blocks.at(-1);if(!k||k.type!==type){k={type,a:[],b:[],aStart:i+1,bStart:j+1};if(type==='change')k.id=changes++;blocks.push(k)}if(type==='equal'){k.a.push(line);k.b.push(line)}else if(line.kind==='del'){k.a.push(line.value);removed++}else{k.b.push(line.value);added++}}
while(i<n||j<m){if(i<n&&j<m&&a[i]===b[j]){push('equal',a[i]);i++;j++}else if(i<n&&(j===m||L[i+1][j]>=L[i][j+1])){push('change',{kind:'del',value:a[i]});i++}else{push('change',{kind:'add',value:b[j]});j++}}
return {blocks,changes,added,removed,unchanged:L[0][0],oldLines:n,newLines:m};}
function choicesFor(r,choices){if(!Array.isArray(choices)||choices.length!==r.changes||choices.some(x=>x!==null&&x!=='old'&&x!=='new'))throw Error('取舍记录与文本不匹配');return choices;}
function merge(r,c){choicesFor(r,c);if(c.some(x=>x===null))throw Error('请先决定全部变动块');return r.blocks.flatMap(b=>b.type==='equal'?b.a:c[b.id]==='old'?b.a:b.b).join('\n')}
function validate(s){const r=diff(s);choicesFor(r,s.choices);return r}
const api={sample,normalize,diff,choicesFor,merge,validate};g.AppCore=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
