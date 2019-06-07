var emails = require('./imap.js')

const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({
  path: 'emails.csv',
  header: [
    {id: 'name', title: 'Name'},
    {id: 'email', title: 'Email'},
  ]
})

async function getEmails() {
  try {
    let result = await emails.imapConection()
    return Promise.resolve(result)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function csvWriteEmails() {
  try {
    let result = await getEmails()
    const unique = getUnique(result)
    const data = Object.keys(unique).reduce((acc, act) => {
      return [
        ...acc,
        { 
          name: unique[act],
          email: act
        }
      ]
    }, [])
    csvWriter.writeRecords(data).then(()=> console.log('The CSV file was written successfully'))
  } catch(error) {
    console.log(error)
  }
}

csvWriteEmails()

const getUnique = (data) => (
  data.reduce((acc, act) => {
    const [name, email] = removedTrash(act);
    return {
      ...acc,
      [email]: name 
    }
  },{}) 
)

const removedTrash = (act) => {
  let mail = act.toString()
  mail = mail.split('<')
  if (mail[1] !== undefined){
    mail[1] = mail[1].slice(0, -1);
  }
  return mail.toString().split(',')
}