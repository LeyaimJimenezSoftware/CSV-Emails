var imaps = require('imap-simple');
require('dotenv').config()
 


var config = {
  imap: {
    user: process.env.EMAIL,
    password: process.env.PASSWORD,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    authTimeout: 3000
  }
}

var searchCriteria = ['All']

class ImapEmails {
  constructor(configInitial,searchCriteria){
    this.configInitial = configInitial
    this.searchCriteria = searchCriteria
  }

  imapConection() {
    return new Promise((resolve, reject) => {
      imaps.connect(this.configInitial).then(connection => {
        return connection.openBox('INBOX').then(() => {
          var fetchOptions = {
              bodies: ['HEADER', 'TEXT'],
              markSeen: false
          };
          return connection.search(this.searchCriteria, fetchOptions).then(results => {
            connection.end()
            const emails = results.map(function (res) {
              return res.parts.filter(function (part) {
                  return part.body.from;
              })[0].body.from
            });
            return resolve(emails)
          }).catch((error) => reject(error))
        }).catch((error) => reject(error))
      })
    })
  } 
}
 
module.exports = new ImapEmails(config, searchCriteria)

