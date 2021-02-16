window.parseAPI = {
    init: () => {
      const appId = 'parse-app'
      const serverURL = 'https://atie.leoyuholo.com/api'
  
      Parse.initialize(appId)
      Parse.serverURL = serverURL
    },

    saveResult: (obj, metaInfo) => {
        const Result = Parse.Object.extend('Result')

        const result = new Result()
        const acl = new Parse.ACL()
        acl.setPublicWriteAccess(false)
        acl.setPublicReadAccess(false)
        result.setACL(acl)

        result.set('username', obj.username)
        result.set('q1', obj.q1)
        result.set('q2', obj.q2)

        _.forEach(metaInfo, (v, k) => {
          result.set(k, v)
        })
    
        return result.save()
    }
  }
  