window.parseAPI = {
    init: () => {
      const appId = 'parse-app'
      const serverURL = 'https://atie.leoyuholo.com/api'
  
      Parse.initialize(appId)
      Parse.serverURL = serverURL
    },

    saveResult: (obj, metaInfo) => {
        const Result = Parse.Object.extend('Baseline') //change name open new data sheet

        const result = new Result()
        const acl = new Parse.ACL()
        acl.setPublicWriteAccess(false)
        acl.setPublicReadAccess(false)
        result.setACL(acl)

        // result.set('username', obj.username)
        // result.set('q1', obj.q1)
        // result.set('q2', obj.q2)
        // result.set('anything', obj.anything)
        // result.set('numbers', obj.number)
        // result.set('but', obj.but)

        _.forEach(metaInfo, (v, k) => {
          result.set(k, v)
        })
    
        return result.save()
    },


    saveClickResult: (obj,metaInfo) =>{
      const Result = Parse.Object.extend('Baseline') //change name open new data sheet

      const result = new Result()
      const acl = new Parse.ACL()
      acl.setPublicWriteAccess(false)
      acl.setPublicReadAccess(false)
      result.setACL(acl)

      // result.set('username', obj.username)
      // result.set('q1', obj.q1)
      // result.set('q2', obj.q2)
      result.set('Button', obj.Button)
      result.set('ID', obj.ID)
      // result.set('Hotel', obj.Hotel)
      // result.set('anything', obj.anything)
      // result.set('numbers', obj.number)
      // result.set('but', obj.but)

      _.forEach(metaInfo, (v, k) => {
        result.set(k, v)
      })
  
      return result.save()

  },
  // saveClickShowAll
  saveClickShowAll: (obj,metaInfo) =>{
    const Result = Parse.Object.extend('Baseline') //change name open new data sheet

    const result = new Result()
    const acl = new Parse.ACL()
    acl.setPublicWriteAccess(false)
    acl.setPublicReadAccess(false)
    result.setACL(acl)

    // result.set('username', obj.username)
    // result.set('q1', obj.q1)
    // result.set('q2', obj.q2)
    result.set('Button', obj.Button)
    result.set('ID', obj.ID)
    result.set('Hotel', obj.Hotel)
    // result.set('anything', obj.anything)
    // result.set('numbers', obj.number)
    // result.set('but', obj.but)

    _.forEach(metaInfo, (v, k) => {
      result.set(k, v)
    })

    return result.save()

},


saveReason: (obj,metaInfo) =>{
  const Result = Parse.Object.extend('Baseline') //change name open new data sheet

  const result = new Result()
  const acl = new Parse.ACL()
  acl.setPublicWriteAccess(false)
  acl.setPublicReadAccess(false)
  result.setACL(acl)

  // result.set('username', obj.username)
  // result.set('q1', obj.q1)
  // result.set('q2', obj.q2)
  result.set('Button', obj.Button)
  result.set('ID', obj.ID)
  result.set('Hotel', obj.Hotel)
  result.set('Reason',obj.Reason)
  result.set('Ranking',obj.Ranking)
  // result.set('anything', obj.anything)
  // result.set('numbers', obj.number)
  // result.set('but', obj.but)

  _.forEach(metaInfo, (v, k) => {
    result.set(k, v)
  })

  return result.save()

},

saveClickAspectsTag:(obj,metaInfo) =>{
  const Result = Parse.Object.extend('Baseline') //change name open new data sheet

  const result = new Result()
  const acl = new Parse.ACL()
  acl.setPublicWriteAccess(false)
  acl.setPublicReadAccess(false)
  result.setACL(acl)

  // result.set('username', obj.username)
  // result.set('q1', obj.q1)
  // result.set('q2', obj.q2)
  result.set('Button', obj.Button)
  result.set('ID', obj.ID)
  result.set('Hotel', obj.Hotel)
  // result.set('ReviewNum',obj.ReviewNum)
  // result.set('anything', obj.anything)
  // result.set('numbers', obj.number)
  // result.set('but', obj.but)

  _.forEach(metaInfo, (v, k) => {
    result.set(k, v)
  })

  return result.save()

},

saveClickReadMore: (obj,metaInfo) =>{
  const Result = Parse.Object.extend('Baseline') //change name open new data sheet

  const result = new Result()
  const acl = new Parse.ACL()
  acl.setPublicWriteAccess(false)
  acl.setPublicReadAccess(false)
  result.setACL(acl)

  // result.set('username', obj.username)
  // result.set('q1', obj.q1)
  // result.set('q2', obj.q2)
  result.set('Button', obj.Button)
  result.set('ID', obj.ID)
  result.set('Hotel', obj.Hotel)
  result.set('ReviewNum',obj.ReviewNum)
  // result.set('anything', obj.anything)
  // result.set('numbers', obj.number)
  // result.set('but', obj.but)

  _.forEach(metaInfo, (v, k) => {
    result.set(k, v)
  })

  return result.save()

},

//   saveButtonClickResult: (obj,metaInfo) =>{
//     const Result = Parse.Object.extend('Baseline') //change name open new data sheet

//     const result = new Result()
//     const acl = new Parse.ACL()
//     acl.setPublicWriteAccess(false)
//     acl.setPublicReadAccess(false)
//     result.setACL(acl)

//     result.set('username', obj.username)
//     result.set('q1', obj.q1)
//     result.set('q2', obj.q2)
//     result.set('ID', obj.ID)
//     result.set('Button', obj.Button)
//     // result.set('anything', obj.anything)
//     // result.set('numbers', obj.number)
//     // result.set('but', obj.but)

//     _.forEach(metaInfo, (v, k) => {
//       result.set(k, v)
//     })

//     return result.save()

// },
    saveMouseOver: (obj,metaInfo) =>{
      const Result = Parse.Object.extend('Baseline') //change name open new data sheet

      const result = new Result()
      const acl = new Parse.ACL()
      acl.setPublicWriteAccess(false)
      acl.setPublicReadAccess(false)
      result.setACL(acl)

      // result.set('username', obj.username)
      // result.set('q1', obj.q1)
      // result.set('q2', obj.q2)
      result.set('Button', obj.Button)
      result.set('ID', obj.ID)
      result.set('Hotel', obj.Hotel)
      // result.set('anything', obj.anything)
      // result.set('numbers', obj.number)
      // result.set('but', obj.but)

      _.forEach(metaInfo, (v, k) => {
        result.set(k, v)
      })

      return result.save()

    },
    saveMouseOut: (obj,metaInfo) =>{
      const Result = Parse.Object.extend('Baseline') //change name open new data sheet

      const result = new Result()
      const acl = new Parse.ACL()
      acl.setPublicWriteAccess(false)
      acl.setPublicReadAccess(false)
      result.setACL(acl)

      // result.set('username', obj.username)
      // result.set('q1', obj.q1)
      // result.set('q2', obj.q2)
      result.set('Button', obj.Button)
      result.set('ID', obj.ID)
      result.set('Hotel', obj.Hotel)
      // result.set('anything', obj.anything)
      // result.set('numbers', obj.number)
      // result.set('but', obj.but)

      _.forEach(metaInfo, (v, k) => {
        result.set(k, v)
      })

      return result.save()

    },

    saveDrag: (obj,metaInfo) =>{
      const Result = Parse.Object.extend('Baseline')

      const result = new Result()
      const acl = new Parse.ACL()
      acl.setPublicWriteAccess(false)
      acl.setPublicReadAccess(false)
      result.setACL(acl)

      result.set('ID', obj.ID)
      result.set('dragrank1', obj.Rank1)
      result.set('dragrank2', obj.Rank2)
      result.set('dragrank3', obj.Rank3)

      _.forEach(metaInfo, (v, k) => {
        result.set(k, v)
      })


      return result.save()
    },

    saveScroll: (obj,metaInfo) =>{
      const Result = Parse.Object.extend('Baseline') //change name open new data sheet

      const result = new Result()
      const acl = new Parse.ACL()
      acl.setPublicWriteAccess(false)
      acl.setPublicReadAccess(false)
      result.setACL(acl)

      // result.set('username', obj.username)
      // result.set('q1', obj.q1)
      // result.set('q2', obj.q2)
      result.set('ID', obj.ID)
      result.set('Length', obj.Length)

      _.forEach(metaInfo, (v, k) => {
        result.set(k, v)
      })

      return result.save()

    },
    // saveTime: (obj,metaInfo) =>{
    //   const Result = Parse.Object.extend('Baseline') //change name open new data sheet

    //   const result = new Result()
    //   const acl = new Parse.ACL()
    //   acl.setPublicWriteAccess(false)
    //   acl.setPublicReadAccess(false)
    //   result.setACL(acl)

    //   result.set('username', obj.username)
    //   result.set('q1', obj.q1)
    //   result.set('q2', obj.q2)

    //   _.forEach(metaInfo, (v, k) => {
    //     result.set(k, v)
    //   })  

    //   return result.save()

    // }

    
  }
  