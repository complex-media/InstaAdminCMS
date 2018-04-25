import fetch from 'isomorphic-fetch';
import FormData from 'form-data';

class ApiService {
    constructor() {
        console.log('apiservice created');
        this.apiUrl = InstaAdminConfig.baseAPIPath
    }

    _errorHandling(resp){
      if(!resp.ok) {
        var error = new Error(resp.statusText);
        error.response = resp;
        // throw error;
        if(resp.status == 403) {
          return {status:'err',response:'Unauthorized endpoint'}
        }
        if(resp.status == 401) {
          setTimeout(function(){window.location = "/auth/login";}, 3000);
          return {status:'err',response:'You need to be logged in to access this endpoint.'}
        }
        return {status:'err',response:'Critical Error: '}
      } else {
        let c = resp.json();
        return c;
      }  
    }

    createResource(post,resourceType,callback){
      return fetch(this.apiUrl+'/'+resourceType,{
          credentials: 'same-origin' ,
          method: "POST",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify(post)
      })
      .then(this._errorHandling)

    }

    duplicateResource(post){
      return fetch(this.apiUrl+'/applications',{
          credentials: 'same-origin' ,
          method: "POST",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify(post)
      })
      .then(this._errorHandling)

    }

    deleteResource(id,resourceType){
      return fetch(this.apiUrl+'/'+resourceType+'/'+id,{
          credentials: 'same-origin' ,
          method: "DELETE",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' //multipart
          }
      })
      .then(this._errorHandling)
    }

    getResource(id,type,callback){
        return fetch(this.apiUrl+'/'+type+'/'+id+'?useData=true',{
            credentials: 'same-origin'  
        })
        .then(this._errorHandling)
    }

    getResourceProto(id,resourceType){
        return fetch(this.apiUrl+'/'+resourceType+'/'+id+'?useData=true&useSchema=appData&useType=developer',{
            credentials: 'same-origin'  
        })
        .then(this._errorHandling)
    }

    getResources(type,callback){
        return fetch(this.apiUrl+'/'+type+'?by=updatedAt&order=desc',{
            credentials: 'same-origin'  
        })
        .then(this._errorHandling)
    }

    publish(id,callback){
        return fetch(this.apiUrl+'/applications/'+id+'/publish',{
            credentials: 'same-origin'  
        })
        .then(this._errorHandling)
    }

    updateResourceMeta(id,form,resourceType){
      return fetch(this.apiUrl+'/'+resourceType+'/'+id+'',{
          credentials: 'same-origin' ,
          method: "PUT",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8'
          },
          body: JSON.stringify({metaData:form})
      })
      .then(this._errorHandling)
    }

    updateElements(id,resourceType,nodeId,form,callback){
      return fetch(this.apiUrl+'/'+resourceType+'/'+id+'/element/'+nodeId+'?updateSet=true',{
          credentials: 'same-origin' ,
          method: "PUT",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8'
          },
          body: JSON.stringify({data:form,updateSet:true,id,eid:nodeId})
      })
      .then(this._errorHandling)
    }

    getLibraryComponents(callback){
      return fetch('/api/instaapp/getLibraryComponents',{
          credentials: 'same-origin'  
      })
      .then(this._errorHandling)
    }

    getFormElements(callback){
      return fetch('/api/instaapp/getFormElements',{
          credentials: 'same-origin'  
      })
      .then(this._errorHandling)
    }

    duplicateElement(id,resourceType,dupId,targetId,callback){
      return fetch(this.apiUrl+'/'+resourceType+'/'+id+'/element/'+targetId+'/copy',{
          credentials: 'same-origin' ,
          method: "POST",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8'
          },
          body: JSON.stringify({dupCompId:dupId,id})
      })
      .then(this._errorHandling)
    }

    uploadFile(appId,eId, file, callback){
      let formData = new FormData();
      formData.append('file',file);
      formData.append('appId', appId);
      formData.append('eId', eId);
      return fetch(this.apiUrl+'/applications/'+appId+'/upload',{
          credentials: 'same-origin' ,
          method: "POST",
          headers: {
            'Accept': 'application/json, */*'
          },
          body: formData
      })
      .then(this._errorHandling)
    }

    deleteElement(id,resourceType,eId){
      return fetch(this.apiUrl+'/'+resourceType+'/'+id+'/element/'+eId+'',{
          credentials: 'same-origin' ,
          method: "DELETE",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' //multipart
          }
      })
      .then(this._errorHandling)
    }


    updateElement(id,resourceType,eid,data){
      return fetch(this.apiUrl+'/'+resourceType+'/'+id+'/element/'+eid+'',{
          credentials: 'same-origin' ,
          method: "PUT",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' //multipart
          },
          body: JSON.stringify({id,eid,data})
      })
      .then(this._errorHandling)
    }

    addElements(id,resourceType,eid,structure,callback){
      return fetch(this.apiUrl+'/'+resourceType+'/'+id+'/element/'+eid+'',{
          credentials: 'same-origin' ,
          method: "POST",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify({id,eid,structure})
      })
      .then(this._errorHandling)
    }

    addToList(id,resourceType,eid,listIndex,callback){
      return fetch(this.apiUrl+'/'+resourceType+'/'+id+'/list/'+eid+'',{
          credentials: 'same-origin' ,
          method: "POST",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify({id,eid,listIndex})
      })
      .then(this._errorHandling)
    }

    removeFromList(id,resourceType,eid,index,callback){
      return fetch(this.apiUrl+'/'+resourceType+'/'+id+'/list/'+eid+'?listIndex='+index,{
          credentials: 'same-origin' ,
          method: "DELETE",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          }
      })
      .then(this._errorHandling)
    }

    getAppActivity(){
      return fetch(this.apiUrl.replace('/v1','')+'/getActivity',{
          credentials: 'same-origin' ,
          method: "GET",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          }
      })
      .then(this._errorHandling)
    }

    getTemplates(callback){
      return fetch(this.apiUrl.replace('/v1','')+'/getTemplates',{
          credentials: 'same-origin' ,
          method: "GET",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          }
      })
      .then(this._errorHandling)
    }

    getRoles(){
      return fetch(this.apiUrl.replace('/api/instaapp/v1','')+'/auth/usersRole',{
          credentials: 'same-origin' ,
          method: "GET",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          }
      })
      .then(this._errorHandling)
    }

    updateRoles(userId,role){
      return fetch(this.apiUrl.replace('/api/instaapp/v1','')+'/auth/usersRole/'+userId,{
          credentials: 'same-origin' ,
          method: "PUT",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify({userId,role})
      })
      .then(this._errorHandling)
    }

    deleteUser(userId){
      return fetch(this.apiUrl.replace('/api/instaapp/v1','')+'/auth/users/'+userId,{
          credentials: 'same-origin' ,
          method: "DELETE",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          }
      })
      .then(this._errorHandling)
    }

    reIssueUserCreds(email){
      return fetch(this.apiUrl.replace('/api/instaapp/v1','')+'/auth/reissue',{
          credentials: 'same-origin' ,
          method: "PUT",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify({email})
      })
      .then(this._errorHandling)
    }

    invite(email,role){
      return fetch(this.apiUrl.replace('/api/instaapp/v1','')+'/auth/invite',{
          credentials: 'same-origin' ,
          method: "POST",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify({email,role})
      })
      .then(this._errorHandling)
    }

    getProfile(){
      return fetch(this.apiUrl.replace('/api/instaapp/v1','')+'/auth/me',{
          credentials: 'same-origin' ,
          method: "GET",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          }
      })
      .then(this._errorHandling)
    }

    updateProfileEmail(newEmail){
      return fetch(this.apiUrl.replace('/api/instaapp/v1','')+'/auth/me/email',{
          credentials: 'same-origin' ,
          method: "PUT",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify({newEmail})
      })
      .then(this._errorHandling)
    }


    updateProfilePassword(newPassword){
      return fetch(this.apiUrl.replace('/api/instaapp/v1','')+'/auth/me/password',{
          credentials: 'same-origin' ,
          method: "PUT",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify({newPassword})
      })
      .then(this._errorHandling)
    }

    deleteOAuth(oauthtype){
      return fetch(this.apiUrl.replace('/api/instaapp/v1','')+'/auth/me/oauth?oauthType='+oauthtype,{
          credentials: 'same-origin' ,
          method: "DELETE",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          }
      })
      .then(this._errorHandling) // oauth issues restart to login
    }

    getHelpDescriptions(){
      return fetch('http://instaadmin.local.com/api/instaapp/v1/applications/aaaa/object',{
          credentials: 'same-origin' ,
          method: "GET",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          }
      })
      .then((resp)=>{
        return {"status":"ok","response":"Recieved.","data":{"id":"57ac9465d1295e71001eb64f","description":"This will describe Instaddmin App's configuration","title":"InstAdmin Configuration","appData":{"helpText":{"schemaBuilder":{"editorButton":"Goes to content editor that will be seen by editor roles.","jsonViewerButton":"Link to endpoint that shows the formated data structure and hierarchy of this apps schema. Each element under a component will be returned as an object with attribute name as the field name with the value as the value of that element. Any components that are list will present data in a consolidated array. Component objest will retain their field names but can be overwritten if two elements have the same field name.","lockButton":"Locks and unlocks schema to prevent editors from editing the data or schema from being changed."},"contentEditor":{"schemaBuilderButton":"Schema Builder - For developers and owners to create and update the schema structure for endpoints.","expandButton":"Expands current editor view. Displays forms of currentently components.","addListButton":"Adds a list item. Items conform to a preset item structure by the developer.","navigatedChildButton":"Navigates to child components and forms."},"listPanel":{"contentEditorButton":"Content Editor - For editors to update data in the schema.","schemaBuilderButton":"Schema Builder - For developers and owners to create and update the schema structure for endpoints.","jsonViewerButton":"Schema Json - Formatted data that will be used as the endpoint for the app.","settingsButton":"General settings to update meta and the apps state.","permissionsButton":"User permissions for different roles and accounts.","dupAppButton":"Duplicates data for this app","hooksButton":"Custom api hooks that will occur when app gets updated."}},"helpTabs":[{"title":"Schema Builder","helpImage":"http://instaadmin.local/images/schema-builder.gif","descriptionHtml":"<p>This interface allows you to start building your data hierarchy. This will define the data that will be accessed through a standard endpoint. It also defines how the content editor will display fields and values for other users to edit.</p><div class=\"media tutorial-media pl-16\">\n                <img class=\"image\"  src=\"http://instaadmin.local/images/schema-builder.gif\" >\n            </div>"},{"title":"Editor","helpImage":"http://instaadmin.local/images/content-editor.gif","descriptionHtml":"<p>This interface allows a user to edit various elements of a data hierarchy defined in the schema builder.</p><div class=\"media tutorial-media pl-16\" ><img class=\"image\"  src=\"http://instaadmin.local/images/content-editor.gif\" ></div>"},{"title":"Templates & Components","helpImage":null,"descriptionHtml":"<p>Templates are used to create a data schema and admin that can be reused later as basis for a new application. Once it is published the template is available in the drop down menu when creating a new application.</p>\n                <p>Components are similar to templates but on a smaller scale. They are reusuable parts that can be reused on different parts of the same data schema or on all schemas. They will be available in the application schema builder once they are published.</p>"},{"title":"Extra","helpImage":"","descriptionHtml":"","tab":{"title":"Editor","helpImage":"http://instaadmin.local/images/content-editor.gif","descriptionHtml":"<p>This interface allows a user to edit various elements of a data hierarchy defined in the schema builder.</p>"}}]}}}
      })
    }

    updateHook(hooks,id){
      return fetch(this.apiUrl+'/applications/'+id,{
          credentials: 'same-origin' ,
          method: "PUT",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify({id,metaData:{hooks}})
      })
      .then(this._errorHandling)
    }

    getUsers(){
      return fetch(this.apiUrl.replace('/api/instaapp/v1','')+'/auth/users',{
          credentials: 'same-origin' ,
          method: "GET",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          }
      })
      .then(this._errorHandling)
    }

    getAppUsers(id){
      return fetch(this.apiUrl+'/applications/'+id+'/user',{
          credentials: 'same-origin' ,
          method: "GET",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          }
      })
      .then(this._errorHandling)
    }

    addResourceUser(appTitle,id,handle,userId,role){
      return fetch(this.apiUrl+'/applications/'+id+'/user',{
          credentials: 'same-origin' ,
          method: "POST",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify({appTitle,id,newUser:{handle,role,id:userId}})
      })
      .then(this._errorHandling)
    }

    inviteResourceUser(email,role,resourceId){
      return fetch(this.apiUrl.replace('/api/instaapp/v1','')+'/auth/invite',{
          credentials: 'same-origin' ,
          method: "POST",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify({email,role,resourceId})
      })
      .then(this._errorHandling)
    }

    updateResourceUser(id,handle,originalRole,role,_id){
       return fetch(this.apiUrl+'/applications/'+id+'/user',{
          credentials: 'same-origin' ,
          method: "PUT",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          },
          body: JSON.stringify({id,user:{handle,originalRole,role,_id}})
      })
      .then(this._errorHandling)
    }


    deleteResourceUser(id,userid,role){
       return fetch(this.apiUrl+'/applications/'+id+'/user?role='+role+'&userid='+userid,{
          credentials: 'same-origin' ,
          method: "DELETE",
          headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json;charset=UTF-8' 
          }
      })
      .then(this._errorHandling)
    }
}

let apiService = new ApiService();

export default apiService;
