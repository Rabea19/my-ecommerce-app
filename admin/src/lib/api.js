// Small compatibility layer for the existing views; every operation uses our API.
const listeners = new Set();
export async function request(path, options = {}) {
  const response = await fetch('/api' + path, { credentials: 'same-origin', ...options, headers: { ...(options.body instanceof Blob ? {} : { 'Content-Type': 'application/json' }), ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Request failed. Please try again.');
  return body;
}
const notify = session => listeners.forEach(fn => fn(session ? 'SIGNED_IN' : 'SIGNED_OUT', session));
async function authRequest(path, body) { try { const data = await request(path,{ method:'POST', body:JSON.stringify(body) }); const session = data.user ? {user:data.user}:null;notify(session);return {data:{user:data.user,session},error:null}; } catch(error){ return {data:{},error}; } }
class Query {
  constructor(table){this.table=table;this.method='GET';this.filters=[];}
  select(_fields,options={}){this.options=options;return this;}
  eq(field,value){this.filters.push([field,value,'eq']);return this;}
  lt(field,value){this.filters.push([field,value,'lt']);return this;}
  order(field,options={}){this.sort=[field,options.ascending!==false];return this;}
  single(){this.one=true;return this;}
  insert(value){this.method='POST';this.body=Array.isArray(value)?value[0]:value;return this;}
  update(value){this.method='PATCH';this.body=value;return this;}
  delete(){this.method='DELETE';return this;}
  then(resolve,reject){return this.run().then(resolve,reject);}
  async run(){try{
    const id=this.filters.find(([field])=>field==='id')?.[1];
    if(['PATCH','DELETE'].includes(this.method)&&!id)throw new Error('An ID is required');
    let data=await request('/'+this.table+(['PATCH','DELETE'].includes(this.method)?'/'+encodeURIComponent(id):''),{method:this.method,...(this.body?{body:JSON.stringify(this.body)}:{})});
    if(this.method==='GET'){
      if(this.table==='products') data=data.map(p=>({...p,title:p.name}));
      data=data.filter(row=>this.filters.every(([field,value,op])=>op==='lt'?row[field]<value:String(row[field])===String(value)));
      if(this.sort){const [field,asc]=this.sort;data.sort((a,b)=>(a[field]>b[field]?1:a[field]<b[field]?-1:0)*(asc?1:-1));}
      const count=data.length;if(this.one){if(data.length!==1)throw new Error('Item not found');data=data[0];}return {data,count,error:null};
    }
    return {data,error:null};
  }catch(error){return {data:null,count:0,error};}}
}
export const api={
 from:table=>new Query(table),
 auth:{
   signInWithPassword:body=>authRequest('/auth/login',body),
   signUp:body=>authRequest('/auth/register',body),
   async signOut(){const result=await authRequest('/auth/logout',{});if(!result.error)notify(null);return result;},
   async getSession(){try{const {user}=await request('/auth/session');return {data:{session:user?{user}:null},error:null};}catch(error){return {data:{session:null},error};}},
   onAuthStateChange(fn){listeners.add(fn);const channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel('market-auth'):null;if(channel)channel.onmessage=()=>api.auth.getSession().then(({data})=>fn('SESSION_CHANGED',data.session));return {data:{subscription:{unsubscribe(){listeners.delete(fn);channel?.close();}}}};}
 }
};
listeners.add(()=>{if(typeof BroadcastChannel!=='undefined'){const channel=new BroadcastChannel('market-auth');channel.postMessage('changed');channel.close();}});
export async function uploadImage(file){return request('/images',{method:'POST',headers:{'Content-Type':file.type},body:file});}
